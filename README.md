[![My Skills](https://skillicons.dev/icons?i=nextjs,tailwind,react,python,flask)](https://skillicons.dev)

# ChatFiles

> this repository use [jerryjliu/llama_index](https://github.com/jerryjliu/llama_index), based on [mckaywrigley/chatbot-ui](https://github.com/mckaywrigley/chatbot-ui), inspired by [madawei2699/myGPTReader](https://github.com/madawei2699/myGPTReader)

![Chatfiles](./doc/chatfiles.png)

**Upload your file and have a conversation with it.**

## How to use it
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
cd chatfiles-ui
npm install
npm run dev
```

### chatfiles
```shell
cd chatfiles
```

create a file named .env with value(OPENAI_API_KEY=your token)

```shell
python3 server.py
```

## 与文件交流

> 这个项目使用 [jerryjliu/llama_index](https://github.com/jerryjliu/llama_index), 项目代码基于 [mckaywrigley/chatbot-ui](https://github.com/mckaywrigley/chatbot-ui) 开发, 受 [madawei2699/myGPTReader](https://github.com/madawei2699/myGPTReader) 所启发而创建。


**上传文件然后与之对话.**

## 如何使用
1. 克隆此存储库。
2. 在根路径上创建 .env 文件。
3. 将您的 OpenAI Key 放入 .env 文件中，使用 OPENAI_API_KEY='您的令牌'。

使用 docker compose 启动项目
```shell
docker compose up
```

打开浏览器输入： http://localhost:3000

### 与文件对话
上传文件。
问与文件有关的内容。

### 与 GPT 对话
直接发送消息，而无需上传文件。

## 如何本地运行
### chatfiles-ui

```shell
cd chatfiles-ui
npm install
npm run dev
```

### chatfiles
```shell
cd chatfiles
```

创建一个名为 .env的文件，里面设置值为(OPENAI_API_KEY=your token)

```shell
python3 server.py
```
