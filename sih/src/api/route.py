from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000/home"]) # Enable CORS for all routes

# Set your Google Generative AI API key
genai.configure(api_key="AIzaSyAtC1vtTrW4hP2Gvov_3tKf3dJtOCAPh1k")  # Replace with your actual API key

@app.route('/generate-complaint', methods=['POST'])
def generate_complaint():
    try:
        data = request.json
        file_url = data.get('filePath')
        prompt = data.get('prompt')

        if not file_url or not prompt:
            return jsonify({"message": "filePath and prompt are required", "status": "error"}), 400

        # Generate complaint text using the prompt
        response = genai.text.prompt(
            model="text-bison-001",  # Replace with your model
            prompt=f"Analyze the image at {file_url} and generate a complaint: {prompt}"
        )

        if not response or 'candidates' not in response:
            return jsonify({"message": "Failed to generate complaint text", "status": "error"}), 500

        complaint_text = response['candidates'][0]['output']

        # Dummy response for success
        result = {
            "message": "Complaint generated successfully.",
            "status": "success",
            "complaintText": complaint_text
        }
        return jsonify(result), 200

    except Exception as e:
        error_response = {
            "message": str(e),
            "status": "error"
        }
        return jsonify(error_response), 500

if __name__ == '__main__':
    app.run(debug=True)
