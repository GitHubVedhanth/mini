from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import io
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model
MODEL_PATH = "/app/models/efficientnetb3-Eye Disease-94.93 (1).h5"
model = load_model(MODEL_PATH)
print("Model loaded successfully!")

# Define class labels (update these based on your dataset)
CLASS_LABELS = ["ARMD", "cataract", "DR", "glaucoma","normal"]  # Example: Replace with your actual class names

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ready"}), 200

# Prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    try:
        # Read the image file from the request
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes))

        # Preprocess the image to match the model's input requirements
        img = img.resize((224, 224))  # Resize to the input size expected by the model (e.g., 224x224 for EfficientNetB3)
        img_array = image.img_to_array(img)  # Convert image to NumPy array
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        img_array /= 255.0  # Normalize pixel values to [0, 1]

        # Perform prediction
        predictions = model.predict(img_array)

        # Get the predicted class and confidence
        predicted_class = np.argmax(predictions, axis=1)[0]  # Get the index of the highest probability
        confidence = float(predictions[0][predicted_class])  # Confidence score for the predicted class
        label = CLASS_LABELS[predicted_class]  # Map index to class label

        # Return the result as JSON
        return jsonify({
            "class": int(predicted_class),
            "label": label,
            "confidence": confidence
        }), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)