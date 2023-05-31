import argparse
import os

from flask import Flask, request, make_response, jsonify

from chat import (
    create_llama_index,
    get_answer_from_index,
    check_llama_index_exists,
    get_answer_from_graph,
    create_llama_graph_index,
)

from file import (
    get_single_file_upload_path,
    get_index_name_from_single_file_path,
    check_index_file_exists,
    get_index_name_without_json_extension,
    clean_file,
    single_file_upload_path,
    multi_file_upload_path,
    check_index_exists,
)

app = Flask(__name__)


@app.route("/upload", methods=["POST"])
def upload_file():
    if not request.files:
        return "Please send a POST request with a file", 400

    filepaths = []
    uploaded_files = list(request.files.values())

    for file in request.files.values():
        uploaded_file = file
        filename = uploaded_file.filename
        # Use different file upload paths based on the number of files in the request
        if len(uploaded_files) > 1:
            filepath = os.path.join(multi_file_upload_path, os.path.basename(filename))
        else:
            filepath = os.path.join(
                get_single_file_upload_path(), os.path.basename(filename)
            )
        uploaded_file.save(filepath)
        filepaths.append(filepath)

    if len(filepaths) == 1:
        filepath = filepaths[0]
        if check_llama_index_exists(filepath) is True:
            return get_index_name_without_json_extension(
                get_index_name_from_single_file_path(filepath)
            )

        index_name, index = create_llama_index(filepath)

        clean_file(filepath)
        return (
            make_response(
                {
                    "indexName": get_index_name_without_json_extension(index_name),
                    "indexType": "index",
                }
            ),
            200,
        )

    elif len(filepaths) > 1:
        graph_name, graph = create_llama_graph_index(filepaths)

        for filepath in filepaths:
            clean_file(filepath)
        return (
            make_response(
                {
                    "indexName": get_index_name_without_json_extension(graph_name),
                    "indexType": "graph",
                }
            ),
            200,
        )

    else:
        return "No files found in request", 400


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
        elif index_type == "graph":
            answer = get_answer_from_graph(message, index_name)

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
    if not os.path.exists(single_file_upload_path):
        os.makedirs(single_file_upload_path)
    if not os.path.exists(multi_file_upload_path):
        os.makedirs(multi_file_upload_path)
    if os.environ.get("CHAT_FILES_MAX_SIZE") is not None:
        app.config["MAX_CONTENT_LENGTH"] = int(os.environ.get("CHAT_FILES_MAX_SIZE"))
    app.run(port=5000, host="0.0.0.0", debug=args.debug)
