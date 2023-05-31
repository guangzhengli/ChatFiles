from file import (
    check_index_file_exists,
    get_index_name_from_single_file_path,
)
from llm import (
    get_index_by_index_name,
    create_index,
)
from prompt import get_prompt


def check_llama_index_exists(file_name):
    index_name = get_index_name_from_single_file_path(file_name)
    return check_index_file_exists(index_name)


def create_llama_index(filepath):
    index_name = get_index_name_from_single_file_path(filepath)
    index = create_index(filepath, index_name)
    return index_name, index


def get_answer_from_index(text, index_name):
    index = get_index_by_index_name(index_name)
    return index.query(text, text_qa_template=get_prompt())
