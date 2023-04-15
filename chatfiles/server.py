import argparse
import os

from flask import Flask, request, make_response

from chat import create_llama_index, get_answer_from_index, check_llama_index_exists, get_answer_from_graph, \
    create_llama_graph_index

from file import get_index_path, get_index_name_from_file_path, check_index_file_exists, \
    get_index_name_without_json_extension, clean_file, check_file_is_compressed, index_path, compress_path, \
    decompress_files_and_get_filepaths, clean_files, check_index_exists

app = Flask(__name__)


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "Please send a POST request with a file", 400
    filepath = None
    try:
        uploaded_file = request.files["file"]

        filename = uploaded_file.filename
        if check_file_is_compressed(filename) is False:
            filepath = os.path.join(get_index_path(), os.path.basename(filename))

            if check_llama_index_exists(filepath) is True:
                return get_index_name_without_json_extension(get_index_name_from_file_path(filepath))

            uploaded_file.save(filepath)

            index_name, index = create_llama_index(filepath)

            clean_file(filepath)
            return make_response(
                {"indexName": get_index_name_without_json_extension(index_name), "indexType": "index"}), 200

        else:
            filepaths = decompress_files_and_get_filepaths(uploaded_file)
            if filepaths is not None:
                graph_name, graph = create_llama_graph_index(filepaths)

            clean_files(filepaths)
            return make_response(
                {"indexName": get_index_name_without_json_extension(graph_name), "indexType": "graph"}), 200

    except Exception as e:
        # cleanup temp file
        if filepath is not None and os.path.exists(filepath):
            os.remove(filepath)
        return "Error: {}".format(str(e)), 500


@app.route('/query', methods=['GET'])
def query_from_llama_index():
    try:
        message = request.args.get('message')
        index_name = request.args.get('indexName')
        index_type = request.args.get('indexType')
        if check_index_exists(index_name) is False:
            return "Index file does not exist", 404

        if index_type == 'index':
            answer = get_answer_from_index(message, index_name)
        elif index_type == 'graph':
            answer = get_answer_from_graph(message, index_name)

        return make_response(str(answer.response)), 200
    except Exception as e:
        return "Error: {}".format(str(e)), 500


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Chat Files")
    parser.add_argument("--debug", action="store_true", help="Enable debug mode")
    args = parser.parse_args()
    if not os.path.exists(index_path):
        os.makedirs(index_path)
    if not os.path.exists(compress_path):
        os.makedirs(compress_path)
    if os.environ.get('CHAT_FILES_MAX_SIZE') is not None:
        app.config['MAX_CONTENT_LENGTH'] = int(os.environ.get('CHAT_FILES_MAX_SIZE'))
    app.run(port=5000, host='0.0.0.0', debug=args.debug)
