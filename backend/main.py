from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = os.getenv("GEMINI_URL")  # Ensure this is the correct URL

@app.route('/analyze-plant', methods=['POST'])
def analyze_plant():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400
            
        image_file = request.files['image']
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')

        prompt = """
        Analyze this plant image and provide:
        1. Identify the disease (if any) in point form
        2. List precautions in point form
        3. Prevention methods in point form
        4. Suggested pesticides (if needed) in point form
        Structure the response in JSON format with keys: disease, precautions, prevention, pesticides
        """

        payload = {
            "contents": [{
                "parts": [
                    {"text": prompt},
                    {
                        "inline_data": {
                            "mime_type": image_file.mimetype,  # Use the actual MIME type of the uploaded file
                            "data": base64_image
                        }
                    }
                ]
            }]
        }

        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {GEMINI_API_KEY}'
        }

        # Debugging: Print the URL and payload
        print("Final URL:", GEMINI_URL)
        print("Payload:", payload)

        response = requests.post(GEMINI_URL, json=payload, headers=headers)
        response.raise_for_status()
        
        # Process Gemini response
        gemini_response = response.json()
        analysis = extract_analysis(gemini_response)  # Implement this based on Gemini's response structure
        
        return jsonify(analysis)

    except requests.exceptions.HTTPError as http_err:
        return jsonify({'error': f'HTTP error occurred: {http_err}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def extract_analysis(response):
    # Implement parsing logic based on Gemini's actual response structure
    # This is a simplified example
    try:
        text = response['candidates'][0]['content']['parts'][0]['text']
        # Add logic to convert text response to JSON format
        return {
            'disease': 'Sample disease',
            'precautions': ['Precaution 1', 'Precaution 2'],
            'prevention': ['Prevention method 1', 'Prevention method 2'],
            'pesticides': ['Pesticide 1', 'Pesticide 2']
        }
    except KeyError as e:
        return {'error': f'Key error in parsing response: {str(e)}'}
    except Exception as e:
        return {'error': f'Failed to parse response: {str(e)}'}

if __name__ == '__main__':
    app.run(debug=True)