# Environment Variable

if you have any confusion about the environment variable, please create an issue or contact me.

| Name | Description                                                                            | Default Value | Vercel                                                         |
| ---- |----------------------------------------------------------------------------------------| ------------- |----------------------------------------------------------------|
| NEXT_PUBLIC_CHAT_FILES_UPLOAD_PATH | The path to store uploaded files.                                                      | public/uploads | /tmp                                                           |
| NEXT_PUBLIC_CHAT_FILES_MAX_SIZE | The maximum value for file upload. If not set or set to 0, it means there is no limit. | 0 | 0                                                              |
| SUPABASE_URL | The url of supabase.                                                                   | |                                                                |
| SUPABASE_SERVICE_ROLE_KEY | The service role key of supabase.                                                      | |                                                                |
| OPENAI_TYPE | The type of openai api. OPENAI or AZURE_OPENAI                                         | OPENAI | OPENAI                                                         |
| OPENAI_API_KEY | The api key of openai.                                                                 | |                                                                |
| OPENAI_API_MODEL | The api model of openai.                                                               | | gpt-3.5-turbo / gpt-4 / gpt-3.5-turbo-0613 / gpt-3.5-turbo-16k |
| AZURE_OPENAI_API_KEY | The api key of azure openai.                                                           | |                                                                |
| AZURE_OPENAI_API_DEPLOYMENT_NAME | The deployment name of azure openai.                                                   | |                                                                |
| AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME | The deployment name of azure openai embeddings.                                        | |                                                                |
| AZURE_OPENAI_API_INSTANCE_NAME | The instance name of azure openai.                                                     | |                                                                |
| AZURE_OPENAI_API_VERSION | The version of azure openai.                                                           | 2023-05-15 | 2023-05-15                                                     |
