import os
from pathlib import Path

single_file_upload_path = "./documents"
single_file_upload_path_dir = Path(single_file_upload_path)

multi_file_upload_path = "./decompress"
multi_file_upload_path_dir = Path(multi_file_upload_path)


def get_index_name_from_single_file_path(file_name):
    file_with_type = str(Path(file_name).relative_to(single_file_upload_path_dir).name)
    file_index_name = file_with_type.split(".")[0].replace(" ", "")
    return file_index_name


def get_index_name_from_multi_file_filepath(file_name):
    file_with_type = str(Path(file_name).relative_to(multi_file_upload_path_dir).name)
    file_index_name = file_with_type.split(".")[0].replace(" ", "")
    return file_index_name


def get_index_name_without_json_extension(index_name):
    return index_name.replace(".json", "")


def get_name_with_json_extension(index_name):
    if index_name is None:
        # Handle the error here. You could raise an exception, or return None.
        raise ValueError("index_name cannot be None")
    return index_name + ".json"


def get_single_file_upload_filepath(index_name):
    return single_file_upload_path_dir / index_name


def get_single_file_upload_path():
    return single_file_upload_path


def check_index_file_exists(index_name):
    return get_single_file_upload_filepath(index_name).is_file()


def check_index_exists(index_name):
    index_name = get_name_with_json_extension(index_name)
    return check_index_file_exists(index_name)


def clean_file(filepath):
    if filepath is not None and os.path.exists(filepath):
        os.remove(filepath)
