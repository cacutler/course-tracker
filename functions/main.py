# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`
from firebase_functions import https_fn
from firebase_admin import initialize_app, firestore
import json
initialize_app()
@https_fn.on_request()
def on_request_example(req: https_fn.Request) -> https_fn.Response:
    if req.method == 'OPTIONS':
        # Set CORS headers for preflight requests
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600'
        }
        return https_fn.Response("", status=204, headers=headers)
    # Set CORS headers for main requests
    headers = {
        'Access-Control-Allow-Origin': '*'
    }
    # Your actual function logic
    return https_fn.Response("Hello world!", headers=headers)
@https_fn.on_request()
def get_degree_data(req: https_fn.Request) -> https_fn.Response:
    if req.method == 'OPTIONS':
        # Set CORS headers for preflight requests
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600'
        }
        return https_fn.Response("", status=204, headers=headers)
    # Set CORS headers for main requests
    headers = {
        'Access-Control-Allow-Origin': '*'
    }
    try:
        db = firestore.client()
        
        # Get degrees
        degrees = db.collection("degrees").get()
        degrees_data = []
        
        # Process each degree document
        for degree in degrees:
            degree_dict = degree.to_dict()
            
            # Make a copy of the degree data that we can modify
            serializable_degree = {}
            
            # Process all fields in the degree
            for key, value in degree_dict.items():
                # Handle fields that might contain document references
                if isinstance(value, list) and key in ["PassedCourses", "AvailableCourses", "FutureCourses"]:
                    # Add course data
                    course_data = []
                    ref_paths = []
                    
                    for course_ref in value:
                        # Skip None values
                        if course_ref is None:
                            ref_paths.append(None)
                            continue
                            
                        try:
                            # Add reference path
                            ref_paths.append(course_ref.path if hasattr(course_ref, 'path') else str(course_ref))
                            
                            # Get and add course data
                            if hasattr(course_ref, 'get'):
                                course_doc = course_ref.get()
                                if course_doc.exists:
                                    course_data.append(course_doc.to_dict())
                        except Exception as e:
                            print(f"Error processing reference: {e}")
                            ref_paths.append(str(course_ref))
                    
                    # Add the course data to our serializable object
                    serializable_degree[f"{key}Data"] = course_data
                    
                    # Store the reference paths
                    serializable_degree[key] = ref_paths
                else:
                    # For non-reference fields, copy as-is
                    serializable_degree[key] = value
            
            degrees_data.append(serializable_degree)
        
        return https_fn.Response(json.dumps(degrees_data), mimetype="application/json", headers=headers)
    except Exception as e:
        return https_fn.Response(f"Error: {e}", status=500)