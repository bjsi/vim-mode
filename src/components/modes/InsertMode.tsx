import { MoveUnit, usePlugin } from '@remnote/plugin-sdk';
import { useModalEditorBindings } from '../../lib/bindings';
import { KeyCommand } from '../../lib/types';
import { ModeProps, VimMode } from './types';

interface InsertModeProps extends ModeProps {}

export const InsertMode = (props: InsertModeProps) => {
  const plugin = usePlugin();
  const bindings: Record<string, KeyCommand> = {
    escape: {
      id: 'escape',
      name: 'Escape',
      keyboardShortcut: 'escape',
      action: () => {
        plugin.editor.moveCaret(-1, MoveUnit.CHARACTER);
        props.setMode(VimMode.Normal);
      },
    },
  };
  useModalEditorBindings(
    VimMode.Insert,
    props.currentMode,
    props.previousMode,
    bindings,
    props.repeatN.current
  );
  return null;
};
