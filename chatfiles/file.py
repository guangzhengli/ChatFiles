import os
import zipfile
import tarfile
import rarfile
import py7zr
from pathlib import Path

index_path = './documents'
index_file_dir = Path(index_path)

compress_path = './decompress'
compress_file_dir = Path(compress_path)


def get_index_name_from_file_path(file_name):
    file_with_type = str(Path(file_name).relative_to(index_file_dir).name)
    file_index_name = file_with_type.split('.')[0].replace(" ", "")
    return file_index_name


def get_index_name_from_compress_filepath(file_name):
    file_with_type = str(Path(file_name).relative_to(compress_file_dir).name)
    file_index_name = file_with_type.split('.')[0].replace(" ", "")
    return file_index_name


def get_index_name_without_json_extension(index_name):
    return index_name.replace(".json", "")


def get_name_with_json_extension(index_name):
    return index_name + '.json'


def get_index_filepath(index_name):
    return index_file_dir / index_name


def get_index_path():
    return index_path


def check_index_file_exists(index_name):
    return get_index_filepath(index_name).is_file()


def check_index_exists(index_name):
    index_name = get_name_with_json_extension(index_name)
    return check_index_file_exists(index_name)


def clean_file(filepath):
    if filepath is not None and os.path.exists(filepath):
        os.remove(filepath)


def clean_files(filepaths):
    for filepath in filepaths:
        clean_file(filepath)


def check_file_is_compressed(file_name):
    return file_name.endswith('.zip') or file_name.endswith('.tar.gz') or \
        file_name.endswith('.7z') or file_name.endswith('.rar')


def decompress_files_and_get_filepaths(uploaded_file):
    file_name = uploaded_file.filename
    if check_file_is_compressed(file_name) is False:
        return None
    else:
        if file_name.endswith('.zip'):
            with zipfile.ZipFile(uploaded_file, 'r') as zip_ref:
                zip_ref.extractall(compress_path)
        elif file_name.endswith('.tar.gz'):
            with tarfile.open(fileobj=uploaded_file, mode='r:gz') as tar_ref:
                tar_ref.extractall(compress_path)
        elif file_name.endswith('.7z'):
            with py7zr.SevenZipFile(uploaded_file, mode='r') as sz_ref:
                sz_ref.extractall(compress_path)
        elif file_name.endswith('.rar'):
            with rarfile.RarFile(uploaded_file, 'r') as rar_ref:
                rar_ref.extractall(compress_path)
        return get_decompress_filepaths()


def get_decompress_filepaths():
    filepaths = [os.path.join(compress_path, f) for f in os.listdir(compress_path) if os.path.isfile(os.path.join(compress_path, f))]
    return filepaths
