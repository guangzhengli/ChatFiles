# Deploying to Fly.io

## Deploy chatfiles

To deploy the Docker container from this repository to Fly.io, follow
these steps:

[Install Docker](https://docs.docker.com/engine/install/) on your local machine if it is not already installed.

Install the [Fly.io CLI](https://fly.io/docs/getting-started/installing-flyctl/) on your local machine.

Clone the repository from GitHub:

```
git clone https://github.com/guangzhengli/ChatFiles
```

Navigate to the cloned repository directory:

```
cd path/to/ChatFiles/chatfiles
```

Log in to the Fly.io CLI:

```
flyctl auth login
```

Create and launch your Fly.io app:

```
flyctl launch
```

Follow the instructions in your terminal:

- Choose your app name
- Choose your app region
- Don't add any databases
- Don't deploy yet (if you do, the first deploy might fail as the environment variables are not yet set)

Set the required environment variables:

```
flyctl secrets set OPENAI_API_KEY=your_openai_api_key 
```

Alternatively, you could set environment variables in the [Fly.io Console](https://fly.io/dashboard).

Deploy your app with:

```
flyctl deploy
```

After completing these steps, your Docker container should be deployed to Fly.io and running with the necessary environment variables set. You can view your app by running:

```
flyctl open
```

which will open your app url `https://your-app-name.fly.dev`.

To view your app logs:

```
flyctl logs
```

## Deploy chatfiles-ui

```
cd path/to/ChatFiles/chatfiles
```

Create and launch your Fly.io app:

```
flyctl launch
```

Follow the instructions in your terminal:

- Choose your app name
- Choose your app region
- Don't add any databases
- Don't deploy yet (if you do, the first deploy might fail as the environment variables are not yet set)

Set the required environment variables:

```
flyctl secrets set OPENAI_API_KEY=your_openai_api_key
flyctl secrets set CHAT_FILES_SERVER_HOST=https://your-app-name.fly.dev
```

Deploy your app with:

```
flyctl deploy
```

After completing these steps, your Docker container should be deployed to Fly.io and running with the necessary environment variables set. You can view your app by running:

```
flyctl open
```