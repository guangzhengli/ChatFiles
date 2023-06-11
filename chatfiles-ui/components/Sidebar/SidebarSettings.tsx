import { ChatFolder, Conversation, KeyConfiguration, ModelType } from '@/types';
import { IconFileExport, IconMoon, IconSun } from '@tabler/icons-react';
import { FC, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ClearConversations } from './ClearConversations';
import { Import } from './Import';
import { SidebarButton } from './SidebarButton';
import { KeySettings } from './KeySettings';

interface Props {
  lightMode: 'light' | 'dark';
  apiKey: string;
  onToggleLightMode: (mode: 'light' | 'dark') => void;
  onApiKeyChange: (apiKey: string) => void;
  onClearConversations: () => void;
  onExportConversations: () => void;
  onImportConversations: (data: {
    conversations: Conversation[];
    folders: ChatFolder[];
  }) => void;
  onKeyConfigrationChange: (keySettings: KeyConfiguration) => void;
}

export const SidebarSettings: FC<Props> = ({
  lightMode,
  apiKey,
  onToggleLightMode,
  onApiKeyChange,
  onClearConversations,
  onExportConversations,
  onImportConversations,
  onKeyConfigrationChange,
}) => {
  const { t } = useTranslation('sidebar');

  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      <ClearConversations onClearConversations={onClearConversations} />

      <Import onImport={onImportConversations} />

      <SidebarButton
        text={t('Export conversations')}
        icon={<IconFileExport size={18} />}
        onClick={() => onExportConversations()}
      />

      <SidebarButton
        text={lightMode === 'light' ? t('Dark mode') : t('Light mode')}
        icon={
          lightMode === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />
        }
        onClick={() =>
          onToggleLightMode(lightMode === 'light' ? 'dark' : 'light')
        }
      />
      <KeySettings onKeyConfigrationChange={onKeyConfigrationChange}/>
    </div>
  );
};

