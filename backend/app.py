from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
import logging

# Enable debugging logs
logging.basicConfig(level=logging.DEBUG)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get API Key
API_KEY = os.getenv('PLANT_API_KEY')
BASE_URL = 'https://api.kindwise.com/v3'

if not API_KEY:
    logging.error("❌ PLANT_API_KEY is missing! Set it in .env")

# ... (previous imports and setup)

@app.route('/api/identify', methods=['POST'])
def identify_plant():
    try:
        if 'image' not in request.files:
            return jsonify(error='No image provided'), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify(error='Invalid file'), 400

        file_bytes = file.read()
        file.stream.seek(0)  # Reset if needed

        response = requests.post(
            f'{BASE_URL}/identification',
            headers={'Api-Key': API_KEY},
            files={'images': (file.filename, file_bytes, file.mimetype)},
            data={
                'health': 'all',
                'similar_images': 'true',
                'classification_level': 'species'
            }
        )

        response.raise_for_status()
        return jsonify(response.json())

    except requests.exceptions.RequestException as e:
        return jsonify(error='Plant API error'), 502
    except Exception as e:
        return jsonify(error='Server error'), 500

@app.route('/api/chat/<access_token>', methods=['POST'])
def chat_conversation(access_token):
    try:
        data = request.json
        
        # Adjust request body as per API docs
        request_body = {
            "messages": [{
                "role": "user",
                "content": data.get("question")
            }]
        }

        response = requests.post(
            f'{BASE_URL}/identification/{access_token}/conversation',
            headers={'Api-Key': API_KEY},
            json=request_body  # Send properly formatted body
        )

        response.raise_for_status()
        return jsonify(response.json())

    except requests.exceptions.RequestException as e:
        return jsonify(error='Chat failed'), 502