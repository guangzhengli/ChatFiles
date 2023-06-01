from flask import Flask, request, make_response, jsonify
import uuid

import argparse
import os
from pathlib import Path


from utils import create_index, get_answer_from_index, clean_file

app = Flask(__name__)

file_upload_path = "./documents"


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

    index_name = (
        str(uuid.uuid4()) if len(filepaths) > 1 else os.path.splitext(filenames[0])[0]
    )

    index = create_index(filepaths, index_name)

    if index is None:
        return "Failed to create index", 500

    for filepath in filepaths:
        clean_file(filepath)

    return (
        make_response(
            {
                "indexName": index_name,
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
        index_type = request.args.get("indexType")
        index_file_path = Path(file_upload_path) / f"{index_name}.json"

        if not os.path.isfile(index_file_path):
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
