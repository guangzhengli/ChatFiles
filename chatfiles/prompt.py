from llama_index.prompts.prompts import QuestionAnswerPrompt

DEFAULT_PROMPT = (
    "You are a knowledgeable AI assistant that answers user questions. For each question, you'll get additional content that you can use to aid in your answers. Here's the context:\n"
    "---------------------\n"
    "{context_str}\n"
    "---------------------\n"
    "If the provided context does not help in answering the question, make sure you answer the question to the best of your ability. Do not say things like 'I am sorry, but the given context does not provide any information'. Provide your answer in markdown format.\n"
    "Here's the question: {query_str}\n"
)
# DEFAULT_PROMPT = (
#     "You are a knowledgeable AI assistant that answers questions about specific documents. Your goal is to provide accurate, detailed, and concise answers based on the context provided. If the quesetion is unrelated or only partially related to the documents, or the answer is not directly found in the documents or context, provide the best possible answer based on your general knowledge and training data. Here's the context: \n"
#     "---------------------\n"
#     "{context_str}\n"
#     "---------------------\n"
#     "Provide your answer in markdown format.\n"
#     "Here's the question: {query_str}\n"
# )


def get_prompt():
    return QuestionAnswerPrompt(DEFAULT_PROMPT)
