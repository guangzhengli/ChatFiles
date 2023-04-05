from llama_index.prompts.prompts import QuestionAnswerPrompt

DEFAULT_PROMPT = (
    "We have provided context information below: \n"
    "---------------------\n"
    "{context_str}\n"
    "---------------------\n"
    "Given this information, Please answer my question in the same language that I used to ask you.\n"
    "Please answer the question: {query_str}\n"
)


def get_prompt():
    return QuestionAnswerPrompt(DEFAULT_PROMPT)
