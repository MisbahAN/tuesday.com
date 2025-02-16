import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

# Environment Variables
TOGETHER_AI_API_KEY = os.getenv("TOGETHER_AI_API_KEY")  # Load API key securely
NODE_API_URL = "http://your-node-server-ip:PORT/get-task"  # Change this to your Node.js API URL
TOGETHER_AI_ENDPOINT = "https://api.together.xyz/v1/chat/completions"


if not TOGETHER_AI_API_KEY:
    raise ValueError("Missing Together AI API Key. Set it as an environment variable.")


# Function to fetch task details from Node.js API
def fetch_task_from_node(task_id):
    try:
        response = requests.get(f"{NODE_API_URL}?task_id={task_id}")
        if response.status_code == 200:
            task_data = response.json()
            if "name" in task_data and "description" in task_data:
                return {
                    "name": task_data["name"],
                    "description": task_data["description"]
                }
        print(f"Invalid response from Node.js API: {response.text}")
        return None
    except Exception as e:
        print(f"Request to Node.js failed: {e}")
        return None


# Function to generate subtasks using Together AI
def generate_subtasks(task_name, description):
    headers = {
        "Authorization": f"Bearer {TOGETHER_AI_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        "messages": [
            {"role": "system", "content": "You are a task manager assistant."},
            {"role": "user",
             "content": f"Break down the task '{task_name}' into subtasks. Task description: '{description}'. Provide 3-5 subtasks in a numbered list."}
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post(TOGETHER_AI_ENDPOINT, json=payload, headers=headers)
        result = response.json()

        # Handle potential API errors
        if "choices" not in result or not result["choices"]:
            return []

        # Extract subtasks
        content = result["choices"][0]["message"]["content"].strip()
        subtasks = []

        for line in content.split("\n"):
            line = line.strip()
            if line and any(line.startswith(f"{i}.") for i in range(1, 6)):  # Detect numbered list
                subtask_text = line.split(". ", 1)[-1].strip()
                subtasks.append({
                    "id": len(subtasks) + 1,
                    "title": subtask_text,
                    "completed": False
                })

        return subtasks
    except requests.RequestException as e:
        print(f"Error connecting to Together AI: {e}")
        return []


# API Endpoint to generate subtasks
@app.route('/generate-subtasks', methods=['POST'])
def handle_generate_subtasks():
    data = request.json
    if not data or 'task_id' not in data:
        return jsonify({'error': 'Missing task_id'}), 400

    # Fetch task details from Node.js API
    task_data = fetch_task_from_node(data['task_id'])
    if not task_data or 'name' not in task_data or 'description' not in task_data:
        return jsonify({'error': 'Task not found'}), 404

    # Generate subtasks
    subtasks = generate_subtasks(task_data['name'], task_data['description'])
    return jsonify({'task_id': data['task_id'], 'subtasks': subtasks})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
