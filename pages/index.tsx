import {Chat} from '@/components/Chat/Chat';
import {Navbar} from '@/components/Mobile/Navbar';
import {Sidebar} from '@/components/Sidebar/Sidebar';
import {
    ChatBody,
    ChatFolder,
    Conversation,
    ErrorMessage,
    KeyConfiguration,
    KeyValuePair,
    Message,
    ModelType,
    OpenAIModel,
    OpenAIModelID,
    OpenAIModels,
} from '@/types';
import {
    cleanConversationHistory,
    cleanSelectedConversation,
} from '@/utils/app/clean';
import {DEFAULT_SYSTEM_PROMPT} from '@/utils/app/const';
import {
    saveConversation,
    saveConversations,
    updateConversation,
} from '@/utils/app/conversation';
import {saveFolders} from '@/utils/app/folders';
import {exportData, importData} from '@/utils/app/importExport';
import {IconArrowBarRight} from '@tabler/icons-react';
import {GetServerSideProps} from 'next';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import {useEffect, useRef, useState} from 'react';
import {KeySettingsAlertDialog} from "@/components/Sidebar/KeySettingsAlert";

interface HomeProps {
    serverSideApiKeyIsSet: boolean;
}

const Home: React.FC<HomeProps> = ({serverSideApiKeyIsSet}) => {
    const {t} = useTranslation('chat');
    const [folders, setFolders] = useState<ChatFolder[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] =
        useState<Conversation>();
    const [loading, setLoading] = useState<boolean>(false);
    const [models, setModels] = useState<OpenAIModel[]>([]);
    const [lightMode, setLightMode] = useState<'dark' | 'light'>('dark');
    const [messageIsStreaming, setMessageIsStreaming] = useState<boolean>(false);
    const [showSidebar, setShowSidebar] = useState<boolean>(true);
    const [messageError, setMessageError] = useState<boolean>(false);
    const [modelError, setModelError] = useState<ErrorMessage | null>(null);
    const [currentMessage, setCurrentMessage] = useState<Message>();
    const [showKeyConfigurationAlert, setShowKeyConfigurationAlert] = useState(false);
    const [keyConfiguration, setkeyConfiguration] = useState<KeyConfiguration>({
        apiType: ModelType.OPENAI,
        apiKey: '',
        azureApiKey: '',
        azureInstanceName: '',
        azureApiVersion: '',
        azureDeploymentName: '',
        azureEmbeddingDeploymentName: '',
    });
    const stopConversationRef = useRef<boolean>(false);

    const keyConfigurationButtonRef = useRef<HTMLButtonElement>(null);
    const handleKeyConfigurationButtonClick = () => {
        if (keyConfigurationButtonRef.current) {
            keyConfigurationButtonRef.current.click();
        }
    };

    const handleShowKeyConfigurationAlertCancel = () => {
        setShowKeyConfigurationAlert(false);
      };
    
      const handleShowKeyConfigurationAlertContinue = () => {
        setShowKeyConfigurationAlert(false);
        handleKeyConfigurationButtonClick();
      };

    const handleKeyConfigurationValidation = (): boolean => {
        if (!serverSideApiKeyIsSet && !keyConfiguration.apiKey && !keyConfiguration.azureApiKey) {
            setShowKeyConfigurationAlert(true);
            return false;
        }
        return true;
    }

    const handleSend = async (message: Message, deleteCount = 0) => {
        if (!handleKeyConfigurationValidation()) {
            return;
        }
        if (selectedConversation) {
            let updatedConversation: Conversation;

            if (deleteCount) {
                const updatedMessages = [...selectedConversation.messages];
                for (let i = 0; i < deleteCount; i++) {
                    updatedMessages.pop();
                }

                updatedConversation = {
                    ...selectedConversation,
                    messages: [...updatedMessages, message],
                };
            } else {
                updatedConversation = {
                    ...selectedConversation,
                    messages: [...selectedConversation.messages, message],
                };
            }

            setSelectedConversation(updatedConversation);
            setLoading(true);
            setMessageIsStreaming(true);
            setMessageError(false);


            const controller = new AbortController();

            let response: Response;

            if (updatedConversation.index.indexName.length === 0) {

                response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-type': keyConfiguration.apiType ?? '',
                        'x-api-key': keyConfiguration.apiKey ?? '',
                        'x-azure-api-key': keyConfiguration.azureApiKey ?? '',
                        'x-azure-instance-name': keyConfiguration.azureInstanceName ?? '',
                        'x-azure-api-version': keyConfiguration.azureApiVersion ?? '',
                        'x-azure-deployment-name': keyConfiguration.azureDeploymentName ?? '',
                        'x-azure-embedding-deployment-name': keyConfiguration.azureEmbeddingDeploymentName ?? '',
                    },
                    signal: controller.signal,
                    body: JSON.stringify({
                        messages: updatedConversation.messages,
                        prompt: updatedConversation.prompt,
                    }),
                });

                console.log("handle chat response")
            } else {
                response = await fetch(
                    `/api/query?message=${message.content}&indexName=${updatedConversation.index.indexName}`, {
                        method: 'GET',
                        headers: {
                            'x-api-type': keyConfiguration.apiType ?? '',
                            'x-api-key': keyConfiguration.apiKey ?? '',
                            'x-azure-api-key': keyConfiguration.azureApiKey ?? '',
                            'x-azure-instance-name': keyConfiguration.azureInstanceName ?? '',
                            'x-azure-api-version': keyConfiguration.azureApiVersion ?? '',
                            'x-azure-deployment-name': keyConfiguration.azureDeploymentName ?? '',
                            'x-azure-embedding-deployment-name': keyConfiguration.azureEmbeddingDeploymentName ?? '',
                        },
                    });
                console.log("handle file chat response")
            }

            if (!response.ok) {
                setLoading(false);
                setMessageIsStreaming(false);
                setMessageError(true);
                return;
            }

            if (!response?.body) {
                setLoading(false);
                setMessageIsStreaming(false);
                setMessageError(true);
                return;
            }

            if (updatedConversation.messages.length === 1) {
                const {content} = message;
                const customName =
                    content.length > 30 ? content.substring(0, 30) + '...' : content;

                updatedConversation = {
                    ...updatedConversation,
                    name: customName,
                };
            }

            setLoading(false);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let isFirst = true;
            let text = '';

            while (!done) {
                if (stopConversationRef.current === true) {
                    controller.abort();
                    done = true;
                    break;
                }
                const {value, done: doneReading} = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);

                text += chunkValue;

                if (isFirst) {
                    isFirst = false;
                    const updatedMessages: Message[] = [
                        ...updatedConversation.messages,
                        {role: 'assistant', content: chunkValue},
                    ];

                    updatedConversation = {
                        ...updatedConversation,
                        messages: updatedMessages,
                    };

                    setSelectedConversation(updatedConversation);
                } else {
                    const updatedMessages: Message[] = updatedConversation.messages.map(
                        (message, index) => {
                            if (index === updatedConversation.messages.length - 1) {
                                return {
                                    ...message,
                                    content: text,
                                };
                            }

                            return message;
                        },
                    );

                    updatedConversation = {
                        ...updatedConversation,
                        messages: updatedMessages,
                    };

                    setSelectedConversation(updatedConversation);
                }
            }
            await reader.cancel();

            saveConversation(updatedConversation);

            const updatedConversations: Conversation[] = conversations.map(
                (conversation) => {
                    if (conversation.id === selectedConversation.id) {
                        return updatedConversation;
                    }

                    return conversation;
                },
            );

            if (updatedConversations.length === 0) {
                updatedConversations.push(updatedConversation);
            }

            setConversations(updatedConversations);

            saveConversations(updatedConversations);

            setMessageIsStreaming(false);
        }
    };

    const handleLightMode = (mode: 'dark' | 'light') => {
        setLightMode(mode);
        localStorage.setItem('theme', mode);
    };

    const handleExportData = () => {
        exportData();
    };

    const handleKeyConfigrationChange = (keySettings: KeyConfiguration) => {
        setkeyConfiguration(keySettings);
        localStorage.setItem('keyConfiguation', JSON.stringify(keySettings));
    };

    const handleImportConversations = (data: {
        conversations: Conversation[];
        folders: ChatFolder[];
    }) => {
        importData(data.conversations, data.folders);
        setConversations(data.conversations);
        setSelectedConversation(data.conversations[data.conversations.length - 1]);
        setFolders(data.folders);
    };

    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
        saveConversation(conversation);
    };

    const handleCreateFolder = (name: string) => {
        const lastFolder = folders[folders.length - 1];

        const newFolder: ChatFolder = {
            id: lastFolder ? lastFolder.id + 1 : 1,
            name,
        };

        const updatedFolders = [...folders, newFolder];

        setFolders(updatedFolders);
        saveFolders(updatedFolders);
    };

    const handleDeleteFolder = (folderId: number) => {
        const updatedFolders = folders.filter((f) => f.id !== folderId);
        setFolders(updatedFolders);
        saveFolders(updatedFolders);

        const updatedConversations: Conversation[] = conversations.map((c) => {
            if (c.folderId === folderId) {
                return {
                    ...c,
                    folderId: 0,
                };
            }

            return c;
        });
        setConversations(updatedConversations);
        saveConversations(updatedConversations);
    };

    const handleUpdateFolder = (folderId: number, name: string) => {
        const updatedFolders = folders.map((f) => {
            if (f.id === folderId) {
                return {
                    ...f,
                    name,
                };
            }

            return f;
        });

        setFolders(updatedFolders);
        saveFolders(updatedFolders);
    };

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

        const {single, all} = updateConversation(
            updatedConversation,
            conversations,
        );

        setSelectedConversation(single);
        setConversations(all);
    };

    const handleClearConversations = () => {
        setConversations([]);
        localStorage.removeItem('conversationHistory');

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

        setFolders([]);
        localStorage.removeItem('folders');
    };

    const handleEditMessage = (message: Message, messageIndex: number) => {
        if (selectedConversation) {
            const updatedMessages = selectedConversation.messages
                .map((m, i) => {
                    if (i < messageIndex) {
                        return m;
                    }
                })
                .filter((m) => m) as Message[];

            const updatedConversation = {
                ...selectedConversation,
                messages: updatedMessages,
            };

            const {single, all} = updateConversation(
                updatedConversation,
                conversations,
            );

            setSelectedConversation(single);
            setConversations(all);

            setCurrentMessage(message);
        }
    };

    useEffect(() => {
        if (currentMessage) {
            handleSend(currentMessage);
            setCurrentMessage(undefined);
        }
    }, [currentMessage]);

    useEffect(() => {
        if (window.innerWidth < 640) {
            setShowSidebar(false);
        }
    }, [selectedConversation]);

    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme) {
            setLightMode(theme as 'dark' | 'light');
        }

        const keyConfiguation = localStorage.getItem('keyConfiguation');
        if (keyConfiguation) {
            setkeyConfiguration(JSON.parse(keyConfiguation));
        }

        if (window.innerWidth < 640) {
            setShowSidebar(false);
        }

        const folders = localStorage.getItem('folders');
        if (folders) {
            setFolders(JSON.parse(folders));
        }

        const conversationHistory = localStorage.getItem('conversationHistory');
        if (conversationHistory) {
            const parsedConversationHistory: Conversation[] =
                JSON.parse(conversationHistory);
            const cleanedConversationHistory = cleanConversationHistory(
                parsedConversationHistory,
            );
            setConversations(cleanedConversationHistory);
        }

        const selectedConversation = localStorage.getItem('selectedConversation');
        if (selectedConversation) {
            const parsedSelectedConversation: Conversation =
                JSON.parse(selectedConversation);
            const cleanedSelectedConversation = cleanSelectedConversation(
                parsedSelectedConversation,
            );
            setSelectedConversation(cleanedSelectedConversation);
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
        }
    }, [serverSideApiKeyIsSet]);

    return (
        <>
            <Head>
                <title>ChatFiles</title>
                <meta name="description" content="ChatGPT but better."/>
                <meta name="viewport"
                      content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            {showKeyConfigurationAlert && (
                <KeySettingsAlertDialog onCancellation={handleShowKeyConfigurationAlertCancel} onContinue={handleShowKeyConfigurationAlertContinue} />
            )}
            {selectedConversation && (
                <main
                    className={`flex h-screen w-screen flex-col text-sm text-white dark:text-white ${lightMode}`}
                >
                    <div className="fixed top-0 w-full sm:hidden">
                        <Navbar
                            selectedConversation={selectedConversation}
                            onNewConversation={handleNewConversation}
                        />
                    </div>

                    <div className="flex h-full w-full pt-[48px] sm:pt-0">
                        {showSidebar ? (
                            <div>
                                <Sidebar
                                    loading={messageIsStreaming}
                                    conversations={conversations}
                                    lightMode={lightMode}
                                    selectedConversation={selectedConversation}
                                    folders={folders}
                                    onToggleLightMode={handleLightMode}
                                    onCreateFolder={handleCreateFolder}
                                    onDeleteFolder={handleDeleteFolder}
                                    onUpdateFolder={handleUpdateFolder}
                                    onNewConversation={handleNewConversation}
                                    onSelectConversation={handleSelectConversation}
                                    onDeleteConversation={handleDeleteConversation}
                                    onToggleSidebar={() => setShowSidebar(!showSidebar)}
                                    onUpdateConversation={handleUpdateConversation}
                                    onClearConversations={handleClearConversations}
                                    onExportConversations={handleExportData}
                                    onImportConversations={handleImportConversations}
                                    keyConfiguration={keyConfiguration}
                                    onKeyConfigrationChange={handleKeyConfigrationChange}
                                    keyConfigurationButtonRef={keyConfigurationButtonRef}
                                />

                                <div
                                    onClick={() => setShowSidebar(!showSidebar)}
                                    className="absolute top-0 left-0 z-10 h-full w-full bg-black opacity-70 sm:hidden"
                                ></div>
                            </div>
                        ) : (
                            <IconArrowBarRight
                                className="fixed top-2.5 left-4 z-50 h-7 w-7 cursor-pointer text-white hover:text-gray-400 dark:text-white dark:hover:text-gray-300 sm:top-0.5 sm:left-4 sm:h-8 sm:w-8 sm:text-neutral-700"
                                onClick={() => setShowSidebar(!showSidebar)}
                            />
                        )}

                        <Chat
                            conversation={selectedConversation}
                            messageIsStreaming={messageIsStreaming}
                            keyConfiguration={keyConfiguration}
                            modelError={modelError}
                            messageError={messageError}
                            models={models}
                            loading={loading}
                            onSend={handleSend}
                            onUpdateConversation={handleUpdateConversation}
                            onEditMessage={handleEditMessage}
                            stopConversationRef={stopConversationRef}
                            handleKeyConfigurationValidation={handleKeyConfigurationValidation}
                        />
                    </div>
                </main>
            )}
        </>
    );
};
export default Home;

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
    return {
        props: {
            serverSideApiKeyIsSet: !!process.env.OPENAI_TYPE,
            ...(await serverSideTranslations(locale ?? 'en', [
                'common',
                'chat',
                'sidebar',
                'markdown',
            ])),
        },
    };
};
