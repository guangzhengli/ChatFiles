from pathlib import Path

index_path = './documents'
index_file_dir = Path(index_path)


def get_index_name_from_file_name(file_name):
    file_with_type = str(Path(file_name).relative_to(index_file_dir).name)
    file_index_name = file_with_type.split('.')[0].replace(" ", "")
    return get_index_name_with_json_extension(file_index_name)


def get_index_name_without_json_extension(index_name):
    return index_name.replace(".json", "")


def get_index_name_with_json_extension(index_name):
    return index_name + '.json'


def get_index_filepath(index_name):
    return index_file_dir / index_name


def get_index_path():
    return index_path


def check_index_file_exists(index_name):
    return get_index_filepath(index_name).is_file()


def check_index_exists(file_name):
    index_name = get_index_name_from_file_name(file_name)
    return check_index_file_exists(index_name)
