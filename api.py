from flask import Flask, request, jsonify
import openai
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Define GPT-2 model and parameters
model_engine = "text-davinci-002"
max_tokens = 10
temperature = 0.2

@app.route('/api/gpt2', methods=['POST'])
def generate_words():
    # Get prompt from POST request
    prompt = request.json['prompt']

    # Generate text using GPT-2 model
    completion = openai.Completion.create(
        engine=model_engine,
        prompt=prompt,
        max_tokens=1,
        temperature=temperature,
        logprobs=5,
        n=1,
        stop=None,
        # echo=True,
        )
    
    choices = completion.choices[0]
    words = []
    for word in choices.text.split(" "):
        if word not in prompt.split(" "):
            words.append(word)

    print(completion)

    output = {
        'text': choices['text'],
        'logprobs': choices['logprobs']['top_logprobs'],
        'tokens': choices['logprobs']['tokens'],
    }

    return jsonify(output)

if __name__ == '__main__':
    app.run(debug=True)
