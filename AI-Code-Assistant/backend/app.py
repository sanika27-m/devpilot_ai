import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from routes import api_bp

# Load environment configuration
load_dotenv()

app = Flask(__name__)

# Enable CORS globally for our API endpoints to communicate with Vite React client
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "Backend server is running correctly."})

if __name__ == '__main__':
    # Retrieve port from env, fallback to 5000
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
