from llama_index import QuestionAnswerPrompt

PROMPT = (
    "Context information is below. \n"
    "---------------------\n"
    "{context_str}"
    "\n---------------------\n"
    "My question is {query_str}\n"
)

def get_prompt_template():
    return QuestionAnswerPrompt(PROMPT)