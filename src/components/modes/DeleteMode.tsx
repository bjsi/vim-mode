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
      await plugin.editor.cut();
    },
  });
  const makeCommand = useMakeCommand();
  const deleteBindings: Record<string, KeyCommand> = {
    ...moveBindings,
    d: {
      id: 'delete',
      name: 'Delete',
      ...makeCommand('d', async () => {
        if (props.focusedRem) {
          await plugin.editor.selectRem([props.focusedRem._id]);
          await plugin.editor.cut();
        }
      }),
    },
    i: {
      id: 'Delete inner',
      name: 'Delete inner',
      ...makeCommand('i', async () => {}),
    },
  };

  useModalEditorBindings(
    VimMode.Delete,
    props.currentMode,
    props.previousMode,
    deleteBindings,
    props.repeatN.current
  );
  return null;
};
