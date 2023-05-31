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
  const [loading, setLoading] = useState<boolean>(false);

  const handleNewConversation = () => {
    const lastConversation = conversations[conversations.length - 1];

    const newConversation: Conversation = {
      id: lastConversation ? lastConversation.id + 1 : 1,
      name: `${t('Conversation')} ${
        lastConversation ? lastConversation.id + 1 : 1
      }`,
      messages: [],
      model: OpenAIModels[OpenAIModelID.GPT_3_5],
      prompt: DEFAULT_SYSTEM_PROMPT,
      folderId: 0,
      index: {
        indexName: '',
        indexType: '',
      },
    };

    const updatedConversations = [...conversations, newConversation];

    setSelectedConversation(newConversation);
    setConversations(updatedConversations);

    saveConversation(newConversation);
    saveConversations(updatedConversations);

    setLoading(false);
  };

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
    handleNewConversation,
    handleDeleteConversation,
    handleUpdateConversation,
  };
};

export default useConversations;
