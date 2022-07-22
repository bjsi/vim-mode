import { usePlugin } from '@remnote/plugin-sdk';
import { useModalEditorBindings } from '../../lib/bindings';
import { ModeProps, VimMode } from './types';
import { KeyCommand } from '../../lib/types';
import { useMakeCommand } from '../../lib/hooks';
import { MutableRefObject } from 'react';

interface VisualLineModeProps extends ModeProps {
  ignoreSelectionEvents: MutableRefObject<boolean>;
}

export const VisualLineMode = (props: VisualLineModeProps) => {
  const plugin = usePlugin();
  const makeCommand = useMakeCommand();

  const bindings: Record<string, KeyCommand> = {
    j: {
      id: 'line select down',
      name: 'line select down',
      ...makeCommand('j', async () => {
        await plugin.editor.expandLineSelectionRelative(1);
      }),
    },
    k: {
      id: 'line select up',
      name: 'line select up',
      ...makeCommand('k', async () => {
        await plugin.editor.expandLineSelectionRelative(-1);
      }),
    },
    escape: {
      id: 'escape',
      name: 'escape',
      ...makeCommand('escape', async () => {
        await plugin.editor.collapseSelection('start');
        props.setMode(VimMode.Normal);
      }),
    },
    d: {
      id: 'delete VisualLine',
      name: 'delete vis',
      ...makeCommand('d', async () => {
        await plugin.editor.cutSelectedLines();
        props.setMode(VimMode.Normal);
      }),
    },
    x: {
      id: 'delete VisualLine',
      name: 'delete vis',
      ...makeCommand('x', async () => {
        await plugin.editor.cutSelectedLines();
        props.setMode(VimMode.Normal);
      }),
    },
    c: {
      id: 'delete VisualLine',
      name: 'delete vis',
      ...makeCommand('c', async () => {
        await plugin.editor.cutSelectedLines();
        props.setMode(VimMode.Normal);
      }),
    },
  };

  useModalEditorBindings(VimMode.VisualLine, props.currentMode, props.previousMode, bindings);

  // TODO:

  // const updateVisualLineMode = (selText: any) => {
  //   if (props.ignoreSelectionEvents.current || !selText) {
  //     return;
  //   }
  //   const {start, end} = selText;
  //   if (start.offset !== end.offset) {
  //     if (props.currentMode !== VimMode.VisualLine) {
  //       props.setMode(VimMode.VisualLine)
  //     }
  //   }
  //   else {
  //     if (props.currentMode === VimMode.VisualLine) {
  //       props.setMode(VimMode.Normal)
  //     }
  //   }
  // }

  // useAPIEventListener(
  //   AppEvents.EditorSelectionChanged,
  //   undefined,
  //   updateVisualLineMode,
  // )

  return null;
};
