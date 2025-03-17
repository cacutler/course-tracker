from firebase_functions import https_fn
from firebase_admin import initialize_app, firestore
import json
from google.cloud.firestore_v1.document import DocumentReference
initialize_app()
class FirestoreEncoder(json.JSONEncoder): # Custom JSON encoder to handle Firestore objects
    def default(self, obj):
        if isinstance(obj, DocumentReference):
            return obj.path
        return super().default(obj)
@https_fn.on_request()
def get_degree_data(req: https_fn.Request) -> https_fn.Response:
    if req.method == 'OPTIONS': # Set CORS headers for preflight requests
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600'
        }
        return https_fn.Response("", status=204, headers=headers)
    headers = { # Set CORS headers for main requests
        'Access-Control-Allow-Origin': '*'
    }
    try:
        db = firestore.client()
        degrees = db.collection("degrees").get()
        degrees_data = []
        reference_fields = { # Define all fields that contain references
            "courses": ["PassedCourses", "AvailableCourses", "FutureCourses"],
            "plans": ["DefaultPlans"]
        }
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