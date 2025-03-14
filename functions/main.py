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
        degrees = firestore.client().collection("degrees").get()
        data = [degree.to_dict() for degree in degrees]
        return https_fn.Response(json.dumps(data), mimetype="application/json", headers=headers)
    except Exception as e:
        return https_fn.Response(f"Error: {e}", status=500)