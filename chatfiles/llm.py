import os
import openai
from langchain.chat_models import ChatOpenAI
from llama_index import (
    LLMPredictor,
    GPTSimpleVectorIndex,
    ServiceContext,
    SimpleDirectoryReader,
)

from file import (
    check_index_file_exists,
    get_single_file_upload_filepath,
    get_name_with_json_extension,
)
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

llm_predictor = LLMPredictor(llm=ChatOpenAI(temperature=1, model_name="gpt-3.5-turbo"))

service_context = ServiceContext.from_defaults(llm_predictor=llm_predictor)


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
