import { IconCheck, IconTrash, IconX } from '@tabler/icons-react';
import { FC, useState } from 'react';
import { SidebarButton } from './SidebarButton';

interface Props {
  onUpdateConversation: (
    conversation: any,
    data: { key: string; value: any },
  ) => void; // replace `any` with the proper type of your `conversation` object
  conversation: any; // replace `any` with the proper type of your `conversation` object
}

export const ClearMessages: React.FC<Props> = ({
  onUpdateConversation,
  conversation,
}) => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  return isConfirming ? (
    <div className="flex cursor-pointer items-center rounded-md py-3 px-3 hover:bg-[#343541]/50">
      <IconTrash size={18} />

      <div className="mx-3 flex-1 text-left text-[12.5px] leading-3 text-white">
        Are you sure?
      </div>

      <div className="flex w-[40px]">
        <IconCheck
          className="ml-auto mr-1 min-w-[20px] text-neutral-400 hover:text-neutral-100"
          size={18}
          onClick={(e) => {
            e.stopPropagation();
            onUpdateConversation(conversation, { key: 'messages', value: [] });
            setIsConfirming(false); // Also reset the confirming state here
          }}
        />

        <IconX
          className="ml-auto min-w-[20px] text-neutral-400 hover:text-neutral-100"
          size={18}
          onClick={(e) => {
            e.stopPropagation();
            setIsConfirming(false);
          }}
        />
      </div>
    </div>
  ) : (
    <button
      className="flex cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[12.5px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/50"
      onClick={() => setIsConfirming(true)}
    >
      <div>
        <IconTrash size={18} />
      </div>
      <span>Clear messages</span>
    </button>
  );
};
