import {ChatFolder, Conversation, KeyConfiguration} from '@/types';
import {IconFileExport, IconMoon, IconSun} from '@tabler/icons-react';
import {FC} from 'react';
import {useTranslation} from 'next-i18next';
import {ClearConversations} from './ClearConversations';
import {Import} from './Import';
import {SidebarButton} from './SidebarButton';
import {KeySettings} from './KeySettings';

interface Props {
  lightMode: 'light' | 'dark';
  onToggleLightMode: (mode: 'light' | 'dark') => void;
  onClearConversations: () => void;
  onExportConversations: () => void;
  onImportConversations: (data: {
    conversations: Conversation[];
    folders: ChatFolder[];
  }) => void;
  keyConfiguration: KeyConfiguration;
  onKeyConfigurationChange: (keySettings: KeyConfiguration) => void;
  keyConfigurationButtonRef: React.RefObject<HTMLButtonElement>;
}

export const SidebarSettings: FC<Props> = ({
  lightMode,
  onToggleLightMode,
  onClearConversations,
  onExportConversations,
  onImportConversations,
  keyConfiguration,
  onKeyConfigurationChange,
  keyConfigurationButtonRef,
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
      <KeySettings keyConfiguration={keyConfiguration} onKeyConfigurationChange={onKeyConfigurationChange} keyConfigurationButtonRef={keyConfigurationButtonRef}/>
    </div>
  );
};

