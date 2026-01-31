# backend/app/core/firestore_client.py
import os
from app.core.config import settings

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    
    # Initialize firebase admin
    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if cred_path:
        # use explicit service account
        cred = credentials.Certificate(cred_path)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
    else:
        # rely on environment credentials (GCP) or default
        if not firebase_admin._apps:
            firebase_admin.initialize_app()

    db = firestore.client()
    print("✅ Using Firebase Firestore client")
    
except ImportError:
    # Fallback to mock client for development
    print("⚠️  firebase-admin not installed, using mock client")
    from app.core.firestore_client_mock import db

def base_collection(app_id: str | None = None):
    app_id = app_id or settings.APP_ID
    return db.collection("artifacts").document(app_id)

def users_root(app_id: str | None = None):
    return base_collection(app_id).collection("users")
