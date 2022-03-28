from flask import Flask, send_from_directory, request

print("hello")
word = "neuro"
app = Flask(__name__, static_url_path='/static')

@app.route("/")
def index():
    return send_from_directory('static', 'index.html')

@app.route("/test")
def hello_world():
    return "Hello, World!"

@app.route("/guess", methods=["POST"])
def make_guess():
    data = request.get_json()
    guess = data['text']

    result = ""
    for i in range(len(word)):
        if guess[i] == word[i]:
            result += '2'
        elif guess[i] in word:
            result += '1'
        else: 
            result += '0'

    return result