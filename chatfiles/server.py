import os
import argparse
from flask import Flask, request, make_response, jsonify

from chat import create_llama_index, get_answer_from_llama_index, check_llama_index_exists
from file import get_index_name_without_json_extension
from file import get_index_path, get_index_name_from_file_name, check_index_file_exists, \
    get_index_name_with_json_extension

app = Flask(__name__)
print("Initiling....")

@app.route('/upload', methods=['POST'])
def upload_file():
    filepath = None
    try:
        uploaded_files = request.files.getlist('files')
        # Check if there are any files uploaded
        if not uploaded_files:
            return "No files uploaded", 400
        index_names = []
        for file in uploaded_files:
            filename = file.filename
            filepath = os.path.join(get_index_path(), os.path.basename(filename))
            if check_llama_index_exists(filepath) is True:
                index_names.append(get_index_name_without_json_extension(get_index_name_from_file_name(filepath)))
            else:    
                # Append the file name to the file_names list
                file.save(filepath)
                index_name = create_llama_index(filepath)
                index_names.append(get_index_name_without_json_extension(index_name))
            
        # cleanup temp file
        if filepath is not None and os.path.exists(filepath):
            os.remove(filepath)
        return {"Index_names": index_names}

    except Exception as e:
        # cleanup temp file
        if filepath is not None and os.path.exists(filepath):
            os.remove(filepath)
        return "Error: {}".format(str(e)), 500


@app.route('/query', methods=['GET'])
def query_from_llama_index():
    try:
        message = request.args.get('message')
        index_names_str = request.args.get('indexNames')

        if not index_names_str:
            return make_response("No index names provided", 400)

        index_names = [get_index_name_with_json_extension(name.strip()) for name in index_names_str.split(',')]

        missing_indexes = [name for name in index_names if not check_index_file_exists(name)]

        if missing_indexes:
            return make_response(f"Index file(s) do not exist: {', '.join(missing_indexes)}", 404)

        answers = []
        for index_name in index_names:
            answer = get_answer_from_llama_index(message, index_name)
            answers.append(str(answer.response))

        return make_response(jsonify(answers), 200)
    except Exception as e:
        return make_response("Error: {}".format(str(e)), 500)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Chat Files")
    parser.add_argument("--debug", action="store_true", help="Enable debug mode")
    args = parser.parse_args()
    if not os.path.exists('./documents'):
        os.makedirs('./documents')
    if (os.environ.get('CHAT_FILES_MAX_SIZE') is not None):
        app.config['MAX_CONTENT_LENGTH'] = int(os.environ.get('CHAT_FILES_MAX_SIZE'))
    app.run(port=5000, host='0.0.0.0',debug=args.debug)
