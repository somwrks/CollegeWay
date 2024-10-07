from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/python/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Make sure the port is 5000

