import os

from flask import Flask, request, make_response, jsonify
from werkzeug.utils import secure_filename

from chatfile import create_llama_index, get_answer_from_llama_index

app = Flask(__name__)


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "Please send a POST request with a file", 400
    filepath = None
    try:
        uploaded_file = request.files["file"]
        filename = secure_filename(uploaded_file.filename)
        filepath = os.path.join('./documents', os.path.basename(filename))

        uploaded_file.save(filepath)

        return create_llama_index(filepath)
    except Exception as e:
        # cleanup temp file
        if filepath is not None and os.path.exists(filepath):
            os.remove(filepath)
        return "Error: {}".format(str(e)), 500


@app.route('/query', methods=['GET'])
def query_from_llama_index():
    message = request.args.get('message')
    index_name = request.args.get('indexName')
    answer = get_answer_from_llama_index(message, index_name)
    return make_response(jsonify(str(answer.response))), 200


if __name__ == '__main__':
    if not os.path.exists('./documents'):
        os.makedirs('./documents')
    app.run(port=5001, debug=True)
