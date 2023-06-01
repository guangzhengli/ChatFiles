from flask import Flask, request, make_response, jsonify
import uuid

import argparse
import os

from helpers import (
    get_answer_from_index,
    file_upload_path,
    check_index_exists,
    clean_file,
)

from llama_index import (
    GPTSimpleVectorIndex,
    SimpleDirectoryReader,
)

app = Flask(__name__)


@app.route("/upload", methods=["POST"])
def upload_file():
    if not request.files:
        return "Please send a POST request with a file", 400

    filepaths = []
    filenames = []

    for file in request.files.values():
        uploaded_file = file
        filename = uploaded_file.filename
        filepath = os.path.join(file_upload_path, os.path.basename(filename))
        uploaded_file.save(filepath)
        filepaths.append(filepath)
        filenames.append(filename)

    documents = SimpleDirectoryReader(input_dir="./documents").load_data()
    index = GPTSimpleVectorIndex.from_documents(documents)

    json_filename = None

    if len(filepaths) == 1:
        json_filename = os.path.splitext(filenames[0])[0]
        json_filepath = f"./documents/{json_filename}.json"
        index.save_to_disk(json_filepath)
        clean_file(filepaths[0])

    elif len(filepaths) > 1:
        json_filename = f"{str(uuid.uuid4())}"
        json_filepath = f"./documents/{json_filename}.json"
        index.save_to_disk(json_filepath)

        for filepath in filepaths:
            clean_file(filepath)

    else:
        return "No files found in request", 400

    return (
        make_response(
            {
                "indexName": json_filename,
                "indexType": "index",
                "fileNames": filenames,
            }
        ),
        200,
    )


@app.route("/query", methods=["GET"])
def query_from_llama_index():
    try:
        message = request.args.get("message")
        index_name = request.args.get("indexName")
        print("\nindex name is ", index_name)
        index_type = request.args.get("indexType")
        print("\nindex type is ", index_type)
        if check_index_exists(index_name) is False:
            return "Index file does not exist", 404

        if index_type == "index":
            answer = get_answer_from_index(message, index_name)

        return make_response(str(answer.response)), 200
    except Exception as e:
        return "Error: {}".format(str(e)), 500


@app.errorhandler(500)
def handle_internal_server_error(e):
    response = {"error": "Internal Server Error", "message": str(e)}
    return jsonify(response), 500


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Chat Files")
    parser.add_argument("--debug", action="store_true", help="Enable debug mode")
    args = parser.parse_args()
    if not os.path.exists(file_upload_path):
        os.makedirs(file_upload_path)
    if os.environ.get("CHAT_FILES_MAX_SIZE") is not None:
        app.config["MAX_CONTENT_LENGTH"] = int(os.environ.get("CHAT_FILES_MAX_SIZE"))
    app.run(port=5000, host="0.0.0.0", debug=args.debug)
