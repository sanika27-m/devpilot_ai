import os
import sqlite3
import json
from flask import Blueprint, request, jsonify
from ai import process_code_request

# Initialize Blueprint
api_bp = Blueprint('api', __name__)

# Dynamically locate database directory
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BACKEND_DIR)
DB_DIR = os.path.join(ROOT_DIR, 'database')
DB_PATH = os.path.join(DB_DIR, 'history.db')

def init_db():
    """Ensure the database directory and required table exist."""
    if not os.path.exists(DB_DIR):
        os.makedirs(DB_DIR)
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            feature TEXT NOT NULL,
            language TEXT NOT NULL,
            prompt TEXT NOT NULL,
            code TEXT,
            response TEXT NOT NULL, -- Stored as a JSON string
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Run database setup on module load
init_db()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@api_bp.route('/process', methods=['POST'])
def process_request():
    data = request.get_json() or {}
    feature = data.get('feature')
    language = data.get('language')
    prompt = data.get('prompt', '')
    code = data.get('code', '')

    if not feature or not language:
        return jsonify({"error": "Missing required fields 'feature' or 'language'"}), 400

    # Call AI module to fetch response
    ai_response = process_code_request(feature, language, prompt, code)

    # Save execution history to database
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO chat_history (feature, language, prompt, code, response) VALUES (?, ?, ?, ?, ?)",
            (feature, language, prompt, code, json.dumps(ai_response))
        )
        conn.commit()
        inserted_id = cursor.lastrowid
        conn.close()
    except Exception as db_err:
        print(f"Database insertion failed: {db_err}")
        inserted_id = None

    return jsonify({
        "id": inserted_id,
        "feature": feature,
        "language": language,
        "prompt": prompt,
        "code": code,
        "response": ai_response
    })

@api_bp.route('/history', methods=['GET'])
def get_history():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        rows = cursor.execute("SELECT * FROM chat_history ORDER BY id DESC").fetchall()
        conn.close()

        history_list = []
        for r in rows:
            try:
                parsed_response = json.loads(r['response'])
            except Exception:
                parsed_response = {}
            history_list.append({
                "id": r['id'],
                "feature": r['feature'],
                "language": r['language'],
                "prompt": r['prompt'],
                "code": r['code'],
                "response": parsed_response,
                "created_at": r['created_at']
            })

        return jsonify(history_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/history/<int:item_id>', methods=['DELETE'])
def delete_history_item(item_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM chat_history WHERE id = ?", (item_id,))
        conn.commit()
        deleted = cursor.rowcount > 0
        conn.close()

        if deleted:
            return jsonify({"message": f"History item {item_id} deleted successfully."})
        else:
            return jsonify({"error": f"Item {item_id} not found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/history', methods=['DELETE'])
def clear_history():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM chat_history")
        conn.commit()
        conn.close()
        return jsonify({"message": "All chat history cleared successfully."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
