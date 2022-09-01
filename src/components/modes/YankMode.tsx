import { TextSelection, usePlugin } from '@remnote/plugin-sdk';
import { useModalEditorBindings } from '../../lib/bindings';
import { ModeProps, VimMode } from './types';
import { KeyCommand } from '../../lib/types';
import { useMakeCommand } from '../../lib/hooks';
import { useMoveBindings } from '../bindings/Move';

interface YankCopyDeleteModesProps extends ModeProps {}

export const YankMode = (props: YankCopyDeleteModesProps) => {
  const plugin = usePlugin();
  const moveBindings = useMoveBindings(props);
  const makeCommand = useMakeCommand();
  const yankBindings: Record<string, KeyCommand> = {
    ...moveBindings,
    y: {
      id: 'yank line',
      name: 'yank line',
      ...makeCommand('y', async () => {
        const sel = (props.selection as TextSelection).range;
        await plugin.editor.selectText({ start: 0, end: Number.MAX_SAFE_INTEGER });
        await plugin.editor.copy();
        await plugin.editor.selectText(sel);
      }),
    },
    i: {
      id: 'yank inner',
      name: 'yank inner',
      ...makeCommand('i', async () => {}),
    },
  };

  useModalEditorBindings(
    VimMode.Yank,
    props.currentMode,
    props.previousMode,
    yankBindings,
    props.repeatN.current
  );
  return null;
};
