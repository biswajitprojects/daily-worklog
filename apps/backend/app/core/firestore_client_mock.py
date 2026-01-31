# backend/app/core/firestore_client_mock.py
"""
Mock Firestore client for development when Firebase Admin is not available
"""
import json
import os
from typing import Dict, Any, List
from datetime import datetime

class MockDocumentReference:
    def __init__(self, data: Dict[str, Any] = None):
        self.data = data or {}
        self.id = f"mock_id_{datetime.now().timestamp()}"
    
    def get(self):
        return MockDocumentSnapshot(exists=bool(self.data), data=self.data)
    
    def set(self, data: Dict[str, Any]):
        self.data = data
        return self
    
    def update(self, data: Dict[str, Any]):
        self.data.update(data)
        return self
    
    def delete(self):
        self.data = {}
        return self

class MockDocumentSnapshot:
    def __init__(self, exists: bool = True, data: Dict[str, Any] = None):
        self._exists = exists
        self.data = data or {}
        self.id = f"mock_id_{datetime.now().timestamp()}"
    
    def exists(self) -> bool:
        return self._exists
    
    def to_dict(self) -> Dict[str, Any]:
        return self.data

class MockCollectionReference:
    def __init__(self):
        self.documents = {}
    
    def document(self, doc_id: str = None) -> MockDocumentReference:
        if doc_id is None:
            doc_id = f"auto_id_{datetime.now().timestamp()}"
        
        if doc_id not in self.documents:
            self.documents[doc_id] = MockDocumentReference()
        return self.documents[doc_id]
    
    def add(self, data: Dict[str, Any]) -> tuple:
        doc_id = f"auto_id_{datetime.now().timestamp()}"
        doc_ref = MockDocumentReference(data)
        doc_ref.id = doc_id
        self.documents[doc_id] = doc_ref
        return (None, doc_ref)  # (timestamp, doc_ref)
    
    def stream(self):
        for doc_id, doc_ref in self.documents.items():
            yield MockDocumentSnapshot(exists=True, data=doc_ref.data)
    
    def get(self):
        return list(self.stream())
    
    def where(self, field: str, operator: str, value: Any):
        # Simple mock implementation
        return self

class MockFirestoreClient:
    def __init__(self):
        self.collections = {}
    
    def collection(self, name: str) -> MockCollectionReference:
        if name not in self.collections:
            self.collections[name] = MockCollectionReference()
        return self.collections[name]

# Create a mock database instance
db = MockFirestoreClient()

print("🚧 Using mock Firestore client for development")
print("   Install firebase-admin for production use")