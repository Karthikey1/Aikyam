from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import io
import os

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load your trained model
model = load_model('plant_disease_prediction_model.h5')

# Define class names (replace with your actual class labels)
class_names = [
    'Tomato_Early_Blight',
    'Tomato_Late_Blight',
    'Tomato_Healthy',
    # ... add all your classes
]

def preprocess_image(img):
    """Preprocess image for model prediction"""
    img = img.resize((256, 256))  # Match your model's expected input
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array / 255.0  # Normalize if your model requires it

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    try:
        # Convert to PIL Image
        img = Image.open(io.BytesIO(file.read())).convert('RGB')
        
        # Preprocess and predict
        processed_img = preprocess_image(img)
        predictions = model.predict(processed_img)
        confidence = np.max(predictions[0])
        class_index = np.argmax(predictions[0])
        predicted_class = class_names[class_index]

        return jsonify({
            'disease': predicted_class,
            'confidence': float(confidence),
            'treatment': get_treatment(predicted_class)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_treatment(disease):
    """Add your custom treatment recommendations"""
    treatments = {
        'Tomato_Early_Blight': 'Apply copper-based fungicides every 7-10 days. Remove infected leaves.',
        'Tomato_Late_Blight': 'Use fungicides containing chlorothalonil. Improve air circulation.',
        'Tomato_Healthy': 'No treatment needed. Maintain good growing conditions.',
        # ... add treatments for all classes
    }
    return treatments.get(disease, 'Consult agricultural expert')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)