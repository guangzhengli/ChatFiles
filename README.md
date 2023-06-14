[![My Skills](https://skillicons.dev/icons?i=nextjs,tailwind,react,python,flask)](https://skillicons.dev)<a href="https://www.buymeacoffee.com/iguangzhengli" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

# ChatFiles

EN | [中文文档](README.zh.md)

> this repository use [hwchase17/langchainjs](https://github.com/hwchase17/langchainjs), based on [mckaywrigley/chatbot-ui](https://github.com/mckaywrigley/chatbot-ui)

![Chatfiles](./doc/chatfiles.png)

**Upload your file and have a conversation with it.**


## How to use it

### How to run locally without limited
1. clone this repository.
2. create a .env file on root path.
3. put your OpenAI Key to .env file with OPENAI_API_KEY='your token'

run this project with docker compose.
```shell
docker compose up
```

open browser with http://localhost:3000

### chat with file
1. upload a file.
2. have a conversation with it.

### chat with GPT
1. send message without upload file.

## How to run locally
### chatfiles-ui

```shell
npm install
npm run dev
```

## Feature

- [x] Chat with GPT-3.5
- [x] Chat with file by langchainjs