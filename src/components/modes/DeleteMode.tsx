import { usePlugin } from '@remnote/plugin-sdk';
import { useModalEditorBindings } from '../../lib/bindings';
import { ModeProps, VimMode } from './types';
import { KeyCommand } from '../../lib/types';
import { useMakeCommand } from '../../lib/hooks';
import { useMoveBindings } from '../bindings/Move';

interface DeleteModeProps extends ModeProps {}

export const DeleteMode = (props: DeleteModeProps) => {
  const plugin = usePlugin();
  const moveBindings = useMoveBindings({
    ...props,
    moveFinalizer: async () => {
      await cutSelection(plugin);
    },
  });
  const makeCommand = useMakeCommand();
  const deleteBindings: Record<string, KeyCommand> = {
    ...moveBindings,
    d: {
      id: 'delete',
      name: 'Delete',
      ...makeCommand('d', async () => {
        await plugin.editor.moveCaret(-1, 1, 6);
        await cutSelection(plugin);
      }),
    },
    i: {
      id: 'Delete inner',
      name: 'Delete inner',
      ...makeCommand('i', async () => {}),
    },
  };

  useModalEditorBindings(VimMode.Delete, props.currentMode, props.previousMode, deleteBindings);
  return null;
};
