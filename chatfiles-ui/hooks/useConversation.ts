import { useState } from 'react';
import {
  Conversation,
  OpenAIModels,
  KeyValuePair,
  OpenAIModelID,
} from '../types';

import {
  saveConversation,
  saveConversations,
  updateConversation,
} from '@/utils/app/conversation';
import { useTranslation } from 'react-i18next';

import { DEFAULT_SYSTEM_PROMPT } from '@/utils/app/const';

const useConversations = () => {
  const { t } = useTranslation('chat');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation>();

  const handleDeleteConversation = (conversation: Conversation) => {
    const updatedConversations = conversations.filter(
      (c) => c.id !== conversation.id,
    );
    setConversations(updatedConversations);
    saveConversations(updatedConversations);

    if (updatedConversations.length > 0) {
      setSelectedConversation(
        updatedConversations[updatedConversations.length - 1],
      );
      saveConversation(updatedConversations[updatedConversations.length - 1]);
    } else {
      setSelectedConversation({
        id: 1,
        name: 'New conversation',
        messages: [],
        model: OpenAIModels[OpenAIModelID.GPT_3_5],
        prompt: DEFAULT_SYSTEM_PROMPT,
        folderId: 0,
        filepaths: [],
        index: {
          indexName: '',
          indexType: '',
        },
      });
      localStorage.removeItem('selectedConversation');
    }
  };

  const handleUpdateConversation = (
    conversation: Conversation,
    data: KeyValuePair,
  ) => {
    const updatedConversation = {
      ...conversation,
      [data.key]: data.value,
    };

    const { single, all } = updateConversation(
      updatedConversation,
      conversations,
    );

    setSelectedConversation(single);
    setConversations(all);
  };

  return {
    conversations,
    setConversations,
    selectedConversation,
    setSelectedConversation,
    handleDeleteConversation,
    handleUpdateConversation,
  };
};

export default useConversations;
