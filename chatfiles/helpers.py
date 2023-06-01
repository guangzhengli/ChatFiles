import os
from pathlib import Path
import openai
from langchain.chat_models import ChatOpenAI
from llama_index import (
    LLMPredictor,
    GPTSimpleVectorIndex,
    ServiceContext,
    SimpleDirectoryReader,
)

from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

llm_predictor = LLMPredictor(llm=ChatOpenAI(temperature=1, model_name="gpt-3.5-turbo"))

service_context = ServiceContext.from_defaults(llm_predictor=llm_predictor)

file_upload_path = "./documents"
file_upload_dir = Path(file_upload_path)

from prompt import get_prompt


def create_index(filepath, index_name):
    index = get_index_by_index_name(index_name)
    if index is not None:
        return index

    index_name = get_name_with_json_extension(index_name)
    documents = SimpleDirectoryReader(input_files=[filepath]).load_data()
    index = GPTSimpleVectorIndex.from_documents(documents)
    index.save_to_disk(get_single_file_upload_filepath(index_name))

    return index


def get_index_by_index_name(index_name):
    index_name = get_name_with_json_extension(index_name)
    if check_index_file_exists(index_name) is False:
        return None
    index_filepath = get_single_file_upload_filepath(index_name)
    index = GPTSimpleVectorIndex.load_from_disk(
        index_filepath, service_context=service_context
    )
    return index


def get_answer_from_index(text, index_name):
    index = get_index_by_index_name(index_name)
    return index.query(text, text_qa_template=get_prompt())


def get_index_name_from_single_file_path(file_name):
    file_with_type = str(Path(file_name).relative_to(file_upload_dir).name)
    file_index_name = file_with_type.split(".")[0].replace(" ", "")
    return file_index_name


def get_name_with_json_extension(index_name):
    if index_name is None:
        raise ValueError("index_name cannot be None")
    return index_name + ".json"


def get_single_file_upload_filepath(index_name):
    return file_upload_dir / index_name


def check_index_file_exists(index_name):
    return get_single_file_upload_filepath(index_name).is_file()


def check_index_exists(index_name):
    index_name = get_name_with_json_extension(index_name)
    return check_index_file_exists(index_name)


def clean_file(filepath):
    if filepath is not None and os.path.exists(filepath):
        os.remove(filepath)
