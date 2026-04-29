#!/usr/bin/env python3
"""
Root-level app launcher - runs the Flask application from the backend
"""
import os
import sys

# Add backend directory to Python path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend')
sys.path.insert(0, backend_dir)

# Change to backend directory for proper relative path resolution
os.chdir(backend_dir)

# Import and run the Flask app from backend
from app import app

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
