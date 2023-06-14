import {ChatBody, KeyConfiguration} from '@/types';
import {DEFAULT_SYSTEM_PROMPT} from '@/utils/app/const';
// @ts-expect-error
import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';
import {getKeyConfiguration} from "@/utils/app/configuration";
import {NextApiRequest, NextApiResponse} from "next";
import {AIChatMessage, BaseChatMessage, HumanChatMessage} from "langchain/schema";
import {getChatModel} from "@/utils/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate
} from "langchain/prompts";
import {BufferMemory, ChatMessageHistory} from "langchain/memory";
import {ConversationChain} from "langchain/chains";

export const config = {
  // runtime: 'edge',
};


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { messages, prompt } = req.body as ChatBody;
  const keyConfiguration = getKeyConfiguration(req);

  let input: string;
  if (messages.length === 1) {
    input = messages[0].content;
  } else {
    input = messages[messages.length - 1].content;
  }

  const historyMessages: BaseChatMessage[] = messages?.slice(0, messages.length - 1)
  .map((message) => {
    if (message.role === 'user') {
      return new HumanChatMessage(message.content);
    } else if (message.role === 'assistant') {
      return new AIChatMessage(message.content);
    }
    throw new TypeError('Invalid message role');
  });

  try {
    const stream = callChain(input, prompt, historyMessages, keyConfiguration);
    return new Response(await stream, {
      headers: {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (err) {
    console.error(err);
    let error = "Unexpected message";
    if (err instanceof Error) {
      error = err.message;
    }
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

const callChain = async (input: string, prompt: string, historyMessages: BaseChatMessage[], keyConfiguration: KeyConfiguration) => {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const llm = await getChatModel(keyConfiguration, encoder, writer);

  const promptTemplate = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(prompt ? prompt : DEFAULT_SYSTEM_PROMPT),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  const memory = new BufferMemory({
    returnMessages: true,
    chatHistory: new ChatMessageHistory(historyMessages),
  });

  const chain = new ConversationChain({
    prompt: promptTemplate,
    llm,
    memory,
  });

  chain.call({ input }).catch(console.error);
  return stream.readable;
}

export default handler;
