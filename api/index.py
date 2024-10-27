from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/python/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == '__main__':
    app.run(port=5328) 

#  fetch common app questions an pass it to frontend for answering

# fetch scholarship application form questions and pass it to frontend for answering

# scrape through university websites, articles and accepted student's application from previous admissions along wiht user's profile to develop context for the llm then ask specific questions requested as part of the application that the user is trying to fill out.  

# ai api with small prompts for that it is a counsellor bot with some knowledge about user's info