import os
from pathlib import Path

import openai
from langchain.chat_models import ChatOpenAI

from llama_index import GPTSimpleVectorIndex, LLMPredictor, SimpleDirectoryReader

from src.prompt import get_prompt

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
openai.api_key = OPENAI_API_KEY

index_cache_file_dir = Path('./documents')

llm_predictor = LLMPredictor(llm=ChatOpenAI(
    temperature=0.2, model_name="gpt-3.5-turbo"))


def create_llama_index(filepath):
    index_name = get_index_name_from_file(filepath)
    if get_index_from_file_cache(index_name) is not None:
        return index_name
    documents = SimpleDirectoryReader(input_files=[filepath]).load_data()
    index = GPTSimpleVectorIndex(documents)
    index.save_to_disk(index_cache_file_dir / index_name)
    return index_name


def get_answer_from_llama_index(text, index_name):
    index = get_index_from_file_cache(index_name)
    return index.query(text, llm_predictor=llm_predictor, text_qa_template=get_prompt())


def get_index_name_from_file(filepath):
    file_md5_with_extension = str(Path(filepath).relative_to(index_cache_file_dir).name)
    file_md5 = file_md5_with_extension.split('.')[0]
    return file_md5 + '.json'


def get_index_from_file_cache(name):
    file_cache_file = index_cache_file_dir / name
    if not file_cache_file.is_file():
        return None
    index = GPTSimpleVectorIndex.load_from_disk(file_cache_file)
    return index
