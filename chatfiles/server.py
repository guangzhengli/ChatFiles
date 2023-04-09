import os

from flask import Flask, request, make_response

from chat import create_llama_index, get_answer_from_llama_index, check_llama_index_exists
from file import get_index_name_without_json_extension
from file import get_index_path, get_index_name_from_file_name, check_index_file_exists, \
    get_index_name_with_json_extension

app = Flask(__name__)


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "Please send a POST request with a file", 400
    filepath = None
    try:
        uploaded_file = request.files["file"]
        filename = uploaded_file.filename
        filepath = os.path.join(get_index_path(), os.path.basename(filename))

        if check_llama_index_exists(filepath) is True:
            return get_index_name_without_json_extension(get_index_name_from_file_name(filepath))

        uploaded_file.save(filepath)

        index_name = create_llama_index(filepath)

        # cleanup temp file
        if filepath is not None and os.path.exists(filepath):
            os.remove(filepath)

        return get_index_name_without_json_extension(index_name)
    except Exception as e:
        # cleanup temp file
        if filepath is not None and os.path.exists(filepath):
            os.remove(filepath)
        return "Error: {}".format(str(e)), 500


@app.route('/query', methods=['GET'])
def query_from_llama_index():
    message = request.args.get('message')
    index_name = request.args.get('indexName')
    index_name = get_index_name_with_json_extension(index_name)

    if check_index_file_exists(index_name) is False:
        return "Index file does not exist", 404

    answer = get_answer_from_llama_index(message, index_name)
    return make_response(str(answer.response)), 200


if __name__ == '__main__':
    if not os.path.exists('./documents'):
        os.makedirs('./documents')
    app.run(port=5000, host='0.0.0.0')
