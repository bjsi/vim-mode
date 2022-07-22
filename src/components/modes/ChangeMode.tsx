import { usePlugin } from '@remnote/plugin-sdk';
import { useModalEditorBindings } from '../../lib/bindings';
import { ModeProps, VimMode } from './types';
import { KeyCommand } from '../../lib/types';
import { useMakeCommand } from '../../lib/hooks';
import { useMoveBindings } from '../bindings/Move';

interface ChangeModeProps extends ModeProps {}

export const ChangeMode = (props: ChangeModeProps) => {
  const plugin = usePlugin();
  const moveBindings = useMoveBindings(props);
  const makeCommand = useMakeCommand();
  const changeBindings: Record<string, KeyCommand> = {
    ...moveBindings,
    c: {
      id: 'change',
      name: 'Change',
      ...makeCommand('c', async () => {
        await plugin.editor.moveCaret(-1, 1, 6);
        await plugin.editor.cutSelection();
        props.setMode(VimMode.Insert);
      }),
    },
    i: {
      id: 'Change inner',
      name: 'Change inner',
      ...makeCommand('i', async () => {}),
    },
  };

  useModalEditorBindings(VimMode.Change, props.currentMode, props.previousMode, changeBindings);
  return null;
};
