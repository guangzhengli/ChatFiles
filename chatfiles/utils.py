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
from prompt import get_prompt

load_dotenv()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

llm_predictor = LLMPredictor(llm=ChatOpenAI(temperature=1, model_name="gpt-3.5-turbo"))

service_context = ServiceContext.from_defaults(llm_predictor=llm_predictor)

file_upload_path = "./documents"
file_upload_dir = Path(file_upload_path)


def create_index(filepath, index_name):
    if index_name is None:
        raise ValueError("index_name cannot be None")

    index_name = index_name if index_name.endswith(".json") else index_name + ".json"

    index_filepath = file_upload_dir / index_name

    if index_filepath.is_file():
        index = GPTSimpleVectorIndex.load_from_disk(
            index_filepath, service_context=service_context
        )
        return index

    documents = SimpleDirectoryReader(input_files=filepath).load_data()
    index = GPTSimpleVectorIndex.from_documents(documents)
    index.save_to_disk(index_filepath)

    return index


def get_answer_from_index(text, index_name):
    index = create_index(None, index_name)
    return index.query(text, text_qa_template=get_prompt())


def clean_file(filepath):
    if filepath is not None and os.path.exists(filepath):
        os.remove(filepath)
