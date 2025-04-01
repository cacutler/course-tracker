from firebase_functions import https_fn, firestore_fn, options
from firebase_admin import initialize_app, firestore
import json
from google.cloud.firestore_v1.document import DocumentReference
try:
    # Try to initialize with default project
    initialize_app()
except ValueError:
    # If that fails, initialize with no arguments for emulator use
    initialize_app(options={'projectId': 'demo-project'})
from firebase_functions.firestore_fn import Event, DocumentSnapshot, Change
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
    try:
        db = firestore.client()
        degrees = db.collection("degrees").get()
        degrees_data = []
        reference_fields = {"courses": ["PassedCourses", "AvailableCourses", "FutureCourses"], "plans": ["DefaultPlans"]} # Define all fields that contain references
        for degree in degrees:
            degree_dict = degree.to_dict()
            serializable_degree = {}
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
def process_reference_list(key, value, result_dict): # Helper function to process lists of references
    data_list = []
    for ref in value:
        if ref is None:
            continue
        try:
            if hasattr(ref, 'get'):
                doc = ref.get()
                if doc.exists:
                    data_list.append(doc.to_dict())
        except Exception as e:
            print(f"Error processing reference in {key}: {e}")
    result_dict[f"{key}Data"] = data_list # Add the data to our result
    result_dict[key] = value  # Let the encoder handle the original references
@firestore_fn.on_document_written(document="degrees/{degreeId}")
def ondegreedataupdated(event: Event[Change[DocumentSnapshot]]):
    """
    This function is triggered when a document in the 'degrees' collection is created, updated, or deleted.
    It logs the event and saves the data to Firestore.
    """
    degree_id = event.params["degreeId"]
    if event.data is None:
        print(f"Document was deleted: {degree_id}")
        return
    new_value = event.data.after.to_dict()
    previous_value = event.data.before.to_dict()
    print(f"Degree data changed for degree ID: {degree_id}")
    print(f"Previous value: {previous_value}")
    print(f"New value: {new_value}")
    try: # Example: Save the data to Firestore (you might want to save it to a different collection/document)
        db = get_db()
        doc_ref = db.collection("degree_updates").document(degree_id)
        doc_ref.set(new_value)
        print(f"Degree data saved to Firestore for degree ID: {degree_id}")
    except Exception as e:
        print(f"Error saving degree data to Firestore: {e}")