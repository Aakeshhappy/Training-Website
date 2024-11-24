import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)

# Securely load OpenAI API key from environment variable
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/generate-plan', methods=['POST'])
def generate_plan():
    data = request.json
    age = data.get('age')
    goal = data.get('goal')
    experience = data.get('experience')

    prompt = f"""
    Create a 7-day fitness plan for:
    - Age: {age}
    - Goal: {goal}
    - Experience Level: {experience}
    Include exercises and time durations.
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a fitness expert."},
                {"role": "user", "content": prompt}
            ]
        )

        plan = response['choices'][0]['message']['content']
        timer_duration = 7 * 24 * 60 * 60  # 7 days in seconds

        return jsonify({
            "plan": plan,
            "timer_duration": timer_duration
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
