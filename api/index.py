import os
import sys
import io
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from fuzzywuzzy import process  # <-- Import this for fuzzy matching

# Set default encoding to UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
os.environ['PYTHONIOENCODING'] = 'utf-8'

app = Flask(__name__)
CORS(app)

# Get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Load the model and metadata
try:
    model = tf.keras.models.load_model(os.path.join(current_dir, 'book_recommender_nn.keras'))
    book_metadata = joblib.load(os.path.join(current_dir, 'book_metadata.pkl'))
    print("Model and metadata loaded successfully")
except Exception as e:
    print(f"Error loading model or metadata: {str(e)}")
    model = None
    book_metadata = None

@app.route('/api/python/recommend', methods=['POST'])
def recommend_books():
    print("Recommendation request received")
    if model is None or book_metadata is None:
        return jsonify({"error": "Model or metadata not loaded"}), 500

    try:
        data = request.json
        user_id = data.get('user_id')
        books_liked = data.get('books')  # Expecting book titles

        if not isinstance(books_liked, list) or not books_liked:
            return jsonify({"error": "Books list must be a non-empty array"}), 400

        book_to_index = book_metadata.get('book_to_index', {})
        index_to_book = book_metadata.get('index_to_book', {})
        book_titles = book_metadata.get('book_titles', {})

        # Convert user_id to a unique integer
        user_idx = hash(user_id) % 10000

        # Fuzzy match liked books to their corresponding indices in the metadata
        book_idxs = []
        for book in books_liked:
            matches = process.extractBests(book, book_titles.values(), score_cutoff=80, limit=1)
            print(matches)
            if matches:
                matched_title, score = matches[0]
                matched_id = next(id for id, title in book_titles.items() if title == matched_title)
                book_idxs.append(book_to_index[matched_id])
                print(f"Matched '{book}' to '{matched_title}' with score {score}")
            else:
                print(f"No match found for '{book}'")

        # If no valid books are found, return an error
        if not book_idxs:
            print("No valid books found")
            return jsonify({"error": "No valid books found"}), 400

        # Prepare input for the model
        user_input = np.array([[user_idx]] * len(book_idxs))
        book_input = np.array([[idx] for idx in book_idxs])

        # Make predictions
        predictions = model.predict([user_input, book_input])
        print("predictions :", predictions)

        # Sort and get top 5 recommendations
        recommended_indices = predictions.flatten().argsort()[-5:][::-1]
        recommendations = []
        for i in recommended_indices:
            book_id = index_to_book.get(book_idxs[i])
            if book_id:
                try:
                    book_title = book_titles.get(book_id, f"Book ID: {book_id}")
                    recommendations.append(book_title)
                except (UnicodeEncodeError, KeyError):
                    recommendations.append(f"Book ID: {book_id}")
            else:
                recommendations.append("Unknown Book")

        print(f"Recommendations: {recommendations}")
        return jsonify(recommendations)

    except Exception as e:
        print(f"Error during recommendation: {str(e)}")
        return jsonify({"error": f"{str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5328, debug=True)
