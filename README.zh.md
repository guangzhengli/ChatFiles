[![My Skills](https://skillicons.dev/icons?i=nextjs,tailwind,react,python,flask)](https://skillicons.dev)

# ChatFiles
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
