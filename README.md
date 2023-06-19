[![My Skills](https://skillicons.dev/icons?i=nextjs,tailwind,react,vercel,ts,supabase)](https://skillicons.dev)<a href="https://www.buymeacoffee.com/iguangzhengli" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" >[![](https://dcbadge.vercel.app/api/server/z2jdk28M)](https://discord.gg/z2jdk28M)

# ChatFiles

## Deploy with Vercel

<p align="center">
<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fguangzhengli%2FChatFiles&env=NEXT_PUBLIC_CHAT_FILES_UPLOAD_PATH,SUPABASE_SERVICE_ROLE_KEY,SUPABASE_URL&envDescription=Have%20a%20conversation%20with%20files&envLink=https%3A%2F%2Fgithub.com%2Fguangzhengli%2FChatFiles%2Fblob%2Fmain%2Fdoc%2Fenv-vars.md&demo-title=ChatFiles&demo-description=Have%20a%20conversation%20with%20files&demo-url=https%3A%2F%2Fchat-file.vercel.app%2F"><img src="https://vercel.com/button" alt="Deploy with Vercel"/></a>
</p>

> this repository use [LangchainJS](https://github.com/hwchase17/langchainjs), based on [Chatbot-ui](https://github.com/mckaywrigley/chatbot-ui)

![ChatFiles](./doc/chatfiles.png)

**Upload your file and have a conversation with it.**


## How to use it

### Init Vector DB
[Crate a vector db on Supabase](doc/vectordb/supabase.md)

### How to run locally without limited
1. clone this repository.
2. create a .env file on root path.
3. set environment variables in .env file follow [doc/env-vars.md](doc/env-vars.md).

open browser with http://localhost:3000

## How to run locally
### chatfiles-ui

```shell
npm install
npm run dev
```

### How to deploy on vercel
1. Click the Deploy Button.
2. Set environment variables follow [doc/env-vars.md](doc/env-vars.md).
3. Pay attention to the NEXT_PUBLIC_CHAT_FILES_UPLOAD_PATH value must be /tmp.

## Feature

- [x] Chat with GPT-3.5
- [x] Chat with file by langchainjs and supabase vector db.


## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=guangzhengli/ChatFiles&type=Date)](https://star-history.com/#guangzhengli/ChatFiles&Date)

## Sponsors

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/iguangzhengli)

More Sponsor methods:

https://guangzhengli.com/sponsors

### Who is sponsoring this project?

<p>
<!-- real-sponsors -->
<a href="https://github.com/johnliu33"><img src="https://github.com/johnliu33.png" width="50px" alt="johnliu33" /></a>&nbsp;&nbsp;
<a href="https://github.com/noxonsu"><img src="https://github.com/noxonsu.png" width="50px" alt="noxonsu" /></a>&nbsp;&nbsp;
<a href="https://github.com/magedhelmy1"><img src="https://github.com/magedhelmy1.png" width="50px" alt="magedhelmy1" /></a>&nbsp;&nbsp;
Zhang Andy&nbsp;&nbsp;
<a href="https://github.com/Huayu-Qin"><img src="https://github.com/Huayu-Qin.png" width="50px" alt="Huayu-Qin" /></a>&nbsp;&nbsp;
<!-- real-sponsors -->
</p>


