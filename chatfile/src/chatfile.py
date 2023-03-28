from prompt import get_prompt_template
import os
import openai
from pathlib import Path
from llama_index import GPTSimpleVectorIndex, LLMPredictor, SimpleDirectoryReader
from langchain.chat_models import ChatOpenAI

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
openai.api_key = OPENAI_API_KEY

index_cache_file_dir = Path('../data/files/')

llm_predictor = LLMPredictor(llm=ChatOpenAI(
    temperature=0.2, model_name="gpt-3.5-turbo"))

def create_llama_index(file):
    index_name = get_index_name_from_file(file)
    documents = SimpleDirectoryReader(input_files=[file]).load_data()
    index = GPTSimpleVectorIndex(documents)
    index.save_to_disk(index_cache_file_dir / index_name)
    return index_name

def get_answer_from_llama_index(messages, index_name):
    index = get_index_from_file_cache(index_name)
    prompt = get_prompt_template()
    return index.query("\n".join(messages), llm_predictor=llm_predictor, text_qa_template=prompt)

def get_index_name_from_file(file: str):
    file_md5_with_extension = str(Path(file).relative_to(index_cache_file_dir).name)
    file_md5 = file_md5_with_extension.split('.')[0]
    return file_md5 + '.json'

def get_index_from_file_cache(name):
    file_cache_file = index_cache_file_dir / name
    if not file_cache_file.is_file():
        return None
    index = GPTSimpleVectorIndex.load_from_disk(file_cache_file)
    return index