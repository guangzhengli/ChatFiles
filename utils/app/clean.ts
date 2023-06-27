import {Conversation} from '@/types';
import {DEFAULT_SYSTEM_PROMPT} from './const';

export const cleanSelectedConversation = (conversation: Conversation) => {
  let updatedConversation = conversation;

  if (!updatedConversation.prompt) {
    updatedConversation = {
      ...updatedConversation,
      prompt: updatedConversation.prompt || DEFAULT_SYSTEM_PROMPT,
    };
  }

  if (!updatedConversation.folderId) {
    updatedConversation = {
      ...updatedConversation,
      folderId: updatedConversation.folderId || 0,
    };
  }

  return updatedConversation;
};

export const cleanConversationHistory = (history: Conversation[]) => {
  return history.reduce((acc: Conversation[], conversation) => {
    try {
      if (!conversation.prompt) {
        conversation.prompt = DEFAULT_SYSTEM_PROMPT;
      }

      if (!conversation.folderId) {
        conversation.folderId = 0;
      }

      acc.push(conversation);
      return acc;
    } catch (error) {
      console.warn(
        `error while cleaning conversations' history. Removing culprit`,
        error,
      );
    }
    return acc;
  }, []);
};
