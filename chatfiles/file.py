import os
from pathlib import Path

file_upload_path = "./documents"
file_upload_dir = Path(file_upload_path)


def get_index_name_from_single_file_path(file_name):
    file_with_type = str(Path(file_name).relative_to(file_upload_dir).name)
    file_index_name = file_with_type.split(".")[0].replace(" ", "")
    return file_index_name


def get_index_name_without_json_extension(index_name):
    return index_name.replace(".json", "")


def get_name_with_json_extension(index_name):
    if index_name is None:
        raise ValueError("index_name cannot be None")
    return index_name + ".json"


def get_single_file_upload_filepath(index_name):
    return file_upload_dir / index_name


def check_index_file_exists(index_name):
    print(
        get_single_file_upload_filepath(index_name).is_file(),
        "inside of check-index file exists\n",
    )
    return get_single_file_upload_filepath(index_name).is_file()


def check_index_exists(index_name):
    index_name = get_name_with_json_extension(index_name)
    return check_index_file_exists(index_name)


def clean_file(filepath):
    if filepath is not None and os.path.exists(filepath):
        os.remove(filepath)
