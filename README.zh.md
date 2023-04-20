[![My Skills](https://skillicons.dev/icons?i=nextjs,tailwind,react,python,flask)](https://skillicons.dev)<a href="https://www.buymeacoffee.com/iguangzhengli" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

# ChatFiles
**上传文件然后与之对话.**

## 如何使用

浏览器打开：https://chatfiles-ui.fly.dev 。
上传文件对话，可以看看这些好的例子: [Good Example](./doc/Example.md)

### 如何无限制的本地运行
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

## 如何部署到 fly.io
- [Deploy to fly.io](./doc/deploy-flyio.md)

## 功能

- [x] 与 GPT-3.5 对话。
- [x] 与你上传的文件对话。
- [x] 上传多个文件，构建同一个 Index，然后与之对话。
