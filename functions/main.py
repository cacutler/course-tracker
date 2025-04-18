from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore
import json
from google.cloud.firestore_v1.document import DocumentReference
try:
    initialize_app() # Try to initialize with default project
except ValueError:
    initialize_app(options={'projectId': 'demo-project'}) # If that fails, initialize with no arguments for emulator use
options.set_global_options(region=options.SupportedRegion.US_CENTRAL1)
db = None
def get_db():
    global db
    if db is None:
        db = firestore.client()
    return db
class FirestoreEncoder(json.JSONEncoder): # Custom JSON encoder to handle Firestore objects
    def default(self, obj):
        if isinstance(obj, DocumentReference):
            return obj.path
        return super().default(obj)
@https_fn.on_request()
def get_degree_data(req: https_fn.Request) -> https_fn.Response:
    if req.method == 'OPTIONS': # Set CORS headers for preflight requests
        headers = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Max-Age': '3600'}
        return https_fn.Response("", status=204, headers=headers)
    headers = {'Access-Control-Allow-Origin': '*'} # Set CORS headers for main requests
    db = get_db()
    if req.method == "GET": # Handle GET requests (retrieve data)
        try:
            db = firestore.client()
            degrees = db.collection("degrees").get()
            degrees_data = []
            reference_fields = {"courses": ["PassedCourses", "AvailableCourses", "FutureCourses"], "plans": ["DefaultPlans"]} # Define all fields that contain references
            for degree in degrees:
                degree_dict = degree.to_dict()
                serializable_degree = {"id": degree.id}
                for key, value in degree_dict.items():
                    if isinstance(value, list) and key in reference_fields["courses"]: # Handle course reference fields
                        process_reference_list(key, value, serializable_degree)
                    elif isinstance(value, list) and key in reference_fields["plans"]: # Handle plan reference fields - same processing as courses
                        process_reference_list(key, value, serializable_degree)
                    elif key == "plan" and hasattr(value, 'get'): # Handle single plan reference
                        try:
                            plan_doc = value.get()
                            if plan_doc.exists:
                                serializable_degree[f"{key}Data"] = plan_doc.to_dict()
                            serializable_degree[key] = value  # Let the encoder handle this
                        except Exception as e:
                            print(f"Error processing single plan reference: {e}")
                            serializable_degree[key] = str(value)
                    else: # For non-reference fields, copy as-is
                        serializable_degree[key] = value
                degrees_data.append(serializable_degree)
            json_data = json.dumps(degrees_data, cls=FirestoreEncoder) # Use the custom encoder to handle DocumentReferences
            return https_fn.Response(json_data, mimetype="application/json", headers=headers)
        except Exception as e:
            return https_fn.Response(f"Error: {e}", status=500)
    elif req.method == "POST": # Handle POST requests (create new data)
        try:
            data = req.get_json()
            if not data:
                return https_fn.Response("No data provided", status=400, headers=headers)
            new_degree_ref = db.collection("degrees").document() # Create a new document with auto-generated ID
            new_degree_ref.set(data)
            return https_fn.Response(json.dumps({"success": True, "id": new_degree_ref.id}), mimetype="application/json", headers=headers)
        except Exception as e:
            return https_fn.Response(f"Error saving data: {e}", status=500, headers=headers)
    elif req.method == 'PUT': # Handle PUT requests (update existing data)
        try:
            data = req.get_json()
            if not data:
                return https_fn.Response("No data provided", status=400, headers=headers)
            degree_id = req.args.get('id') # Check if ID is provided in the request
            if not degree_id:
                return https_fn.Response("No degree ID provided in query parameters", status=400, headers=headers)
            degree_ref = db.collection("degrees").document(degree_id) # Update the existing document
            doc = degree_ref.get() # Check if document exists
            if not doc.exists:
                return https_fn.Response(f"Degree with ID {degree_id} not found", status=404, headers=headers)
            degree_ref.update(data) # Update the document
            return https_fn.Response(json.dumps({"success": True, "id": degree_id}), mimetype="application/json", headers=headers)
        except Exception as e:
            return https_fn.Response(f"Error updating data: {e}", status=500, headers=headers)
    else: # Handle other methods
        return https_fn.Response("Method not allowed", status=405, headers=headers)
def process_reference_list(key, value, result_dict): # Helper function to process lists of references
    data_list = []
    db = get_db()
    for ref in value:
        if ref is None:
            continue
        try:
            if hasattr(ref, 'get'):
                doc = ref.get()
            elif isinstance(ref, str) and '/' in ref:
                collection_id, doc_id = ref.split('/', 1)
                doc_ref = db.collection(collection_id).document(doc_id)
            else:
                print(f"Unrecognized reference format in {key}: {ref}")
                continue
            doc = doc_ref.get()
            if doc.exists:
                # Include the document ID in the data
                doc_data = doc.to_dict()
                doc_data['id'] = doc.id
                data_list.append(doc_data)
        except Exception as e:
            print(f"Error processing reference in {key}: {e}")
    # Store the resolved data
    result_dict[f"{key}Data"] = data_list
    # Keep the original references 
    result_dict[key] = value  # Let the encoder handle the original references