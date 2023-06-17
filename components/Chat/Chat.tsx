import {Conversation, ErrorMessage, KeyConfiguration, KeyValuePair, Message, OpenAIModel,} from '@/types';
import {throttle} from '@/utils';
import {IconClearAll, IconSettings} from '@tabler/icons-react';
import {useTranslation} from 'next-i18next';
import {FC, memo, MutableRefObject, useEffect, useRef, useState} from 'react';
import {ChatInput} from './ChatInput';
import {ChatLoader} from './ChatLoader';
import {ChatMessage} from './ChatMessage';
import {ErrorMessageDiv} from './ErrorMessageDiv';
import {ModelSelect} from './ModelSelect';
import {Upload} from "@/components/Chat/Upload";
import {CHAT_FILES_MAX_SIZE} from "@/utils/app/const";
import {humanFileSize} from "@/utils/app/files";

interface Props {
    conversation: Conversation;
    models: OpenAIModel[];
    keyConfiguration: KeyConfiguration;
    messageIsStreaming: boolean;
    modelError: ErrorMessage | null;
    messageError: boolean;
    loading: boolean;
    onSend: (message: Message, deleteCount?: number) => void;
    onUpdateConversation: (
        conversation: Conversation,
        data: KeyValuePair,
    ) => void;
    onEditMessage: (message: Message, messageIndex: number) => void;
    stopConversationRef: MutableRefObject<boolean>;
    handleKeyConfigurationValidation: () => boolean;
}

export const Chat: FC<Props> = memo(
    ({
         conversation,
         models,
         keyConfiguration,
         messageIsStreaming,
         modelError,
         loading,
         onSend,
         onUpdateConversation,
         onEditMessage,
         stopConversationRef,
         handleKeyConfigurationValidation,
     }) => {
        const {t} = useTranslation('chat');
        const [currentMessage, setCurrentMessage] = useState<Message>();
        const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
        const [showSettings, setShowSettings] = useState<boolean>(false);
        const [isUploading, setIsUploading] = useState<boolean>(false);
        const [errorMsg, setErrorMsg] = useState<string>();
        const [isUploadSuccess, setIsUploadSuccess] = useState(true);

        const messagesEndRef = useRef<HTMLDivElement>(null);
        const chatContainerRef = useRef<HTMLDivElement>(null);
        const textareaRef = useRef<HTMLTextAreaElement>(null);

        const handleIsUploading = (isUploading: boolean) => {
            setIsUploading(isUploading);
        }

        const handleIsUploadSuccess = (isUploadSuccess: boolean) => {
            setIsUploadSuccess(isUploadSuccess);
        }

        const handleUploadError = (errorMsg: string) => {
            setErrorMsg(errorMsg);
        }

        const onClearAll = () => {
            if (confirm(t<string>('Are you sure you want to clear all messages?'))) {
                onUpdateConversation(conversation, {key: 'messages', value: []});
            }
        };

        const scrollDown = () => {
            if (autoScrollEnabled) {
                messagesEndRef.current?.scrollIntoView(true);
            }
        };
        const throttledScrollDown = throttle(scrollDown, 250);

        useEffect(() => {
            throttledScrollDown();
            setCurrentMessage(
                conversation.messages[conversation.messages.length - 2],
            );
        }, [conversation.messages, throttledScrollDown]);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    setAutoScrollEnabled(entry.isIntersecting);
                    if (entry.isIntersecting) {
                        textareaRef.current?.focus();
                    }
                },
                {
                    root: null,
                    threshold: 0.5,
                },
            );
            const messagesEndElement = messagesEndRef.current;
            if (messagesEndElement) {
                observer.observe(messagesEndElement);
            }
            return () => {
                if (messagesEndElement) {
                    observer.unobserve(messagesEndElement);
                }
            };
        }, [messagesEndRef]);

        return (
            <div className="overflow-none relative flex-1 bg-white dark:bg-[#343541]">
                {modelError ? (
                    <ErrorMessageDiv error={modelError}/>
                ) : (
                    <>
                        <div
                            className="max-h-full overflow-x-hidden"
                            ref={chatContainerRef}
                        >
                            {(conversation.index?.indexName.length === 0) && (conversation.messages.length === 0) ? (
                                <>
                                    {!isUploadSuccess ? (
                                        <>
                                            <div id="alert-2"
                                                 className="flex p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                                                 role="alert">
                                                <svg aria-hidden="true" className="flex-shrink-0 w-5 h-5"
                                                     fill="currentColor" viewBox="0 0 20 20"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd"
                                                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                          clipRule="evenodd"></path>
                                                </svg>
                                                <span className="sr-only">Error</span>
                                                <div className="ml-3 text-sm font-medium">
                                                    {errorMsg}.
                                                </div>
                                                <button type="button" onClick={() => handleIsUploadSuccess(true)}
                                                        className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                                                        data-dismiss-target="#alert-2" aria-label="Close">
                                                    <span className="sr-only">Close</span>
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd"
                                                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                              clipRule="evenodd"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </>
                                    ) : undefined}

                                    <div className="mx-auto flex w-[350px] flex-col space-y-10 pt-12 sm:w-[600px]">
                                        <div
                                            className="flex h-full flex-col space-y-4 rounded border border-neutral-200 p-4 dark:border-neutral-600">
                                            <Upload onIndexChange={(index) =>
                                                onUpdateConversation(conversation, {
                                                    key: 'index',
                                                    value: index,
                                                })}
                                                    keyConfiguration={keyConfiguration}
                                                    handleIsUploading={handleIsUploading}
                                                    handleIsUploadSuccess={handleIsUploadSuccess}
                                                    handleUploadError={handleUploadError}
                                                    handleKeyConfigurationValidation={handleKeyConfigurationValidation}
                                            />
                                            {CHAT_FILES_MAX_SIZE != 0 &&
                                                <>
                                                    <p className="mt-2 px-8 text-xs text-gray-500 dark:text-gray-400">This
                                                        environment is only for trial and supports a maximum file size
                                                        of {humanFileSize(CHAT_FILES_MAX_SIZE)}.</p>
                                                    <p className="mt-2 px-8 text-xs text-gray-500 dark:text-gray-400">Here
                                                        are some good starting questions:
                                                        <a className="text-xs text-gray-500 dark:text-gray-400 underline"
                                                           href="https://github.com/guangzhengli/ChatFiles/blob/main/doc/Example.md"> Good
                                                            Examples .</a>
                                                    </p>
                                                    <p className="mt-2 px-8 text-xs text-gray-500 dark:text-gray-400">If
                                                        you need to upload larger files, please deploy your own
                                                        chatfiles by:
                                                        <a className="text-xs text-gray-500 dark:text-gray-400 underline"
                                                           href="https://github.com/guangzhengli/ChatFiles"> ChatFiles</a>
                                                    </p>
                                                </>
                                            }
                                        </div>
                                    </div>
                                    {isUploading ? (
                                        <>
                                            <div role="status"
                                                 className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                                                <svg aria-hidden="true"
                                                     className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                                     viewBox="0 0 100 101" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                        fill="currentColor"/>
                                                    <path
                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                        fill="currentFill"/>
                                                </svg>
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </>
                                    ) : undefined}
                                </>
                            ) : (
                                <>
                                    <div
                                        className="flex justify-center border border-b-neutral-300 bg-neutral-100 py-2 text-sm text-neutral-500 dark:border-none dark:bg-[#444654] dark:text-neutral-200">
                                        {t('File')}: {conversation.index.indexName}
                                        <IconClearAll
                                            className="ml-2 cursor-pointer hover:opacity-50"
                                            onClick={onClearAll}
                                            size={18}
                                        />
                                    </div>
                                    {showSettings && (
                                        <div className="mx-auto flex w-[200px] flex-col space-y-10 pt-8 sm:w-[300px]">
                                            <div
                                                className="flex h-full flex-col space-y-4 rounded border border-neutral-500 p-2">
                                                <ModelSelect
                                                    model={conversation.model}
                                                    models={models}
                                                    onModelChange={(model) =>
                                                        onUpdateConversation(conversation, {
                                                            key: 'model',
                                                            value: model,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {conversation.messages.map((message, index) => (
                                        <ChatMessage
                                            key={index}
                                            message={message}
                                            messageIndex={index}
                                            onEditMessage={onEditMessage}
                                        />
                                    ))}

                                    {loading && <ChatLoader/>}

                                    <div
                                        className="h-[162px] bg-white dark:bg-[#343541]"
                                        ref={messagesEndRef}
                                    />
                                </>
                            )}
                        </div>

                        <ChatInput
                            stopConversationRef={stopConversationRef}
                            textareaRef={textareaRef}
                            messageIsStreaming={messageIsStreaming}
                            conversationIsEmpty={conversation.messages.length > 0}
                            model={conversation.model}
                            onSend={(message) => {
                                setCurrentMessage(message);
                                onSend(message);
                            }}
                            onRegenerate={() => {
                                if (currentMessage) {
                                    onSend(currentMessage, 2);
                                }
                            }}
                            handleKeyConfigurationValidation={handleKeyConfigurationValidation}
                        />
                    </>
                )}
            </div>
        );
    },
);
Chat.displayName = 'Chat';
