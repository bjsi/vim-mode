import { AppEvents, useAPIEventListener, usePlugin } from '@remnote/plugin-sdk';
import { useModalEditorBindings } from '../../lib/bindings';
import { ModeProps, VimMode } from './types';
import { KeyCommand } from '../../lib/types';
import { useMakeCommand } from '../../lib/hooks';
import { useMoveBindings } from '../bindings/Move';
import { MutableRefObject } from 'react';
import { cutSelection } from '../../lib/editor';

interface VisualModeProps extends ModeProps {
  ignoreSelectionEvents: MutableRefObject<boolean>;
}

export const VisualMode = (props: VisualModeProps) => {
  const plugin = usePlugin();
  const moveBindings = useMoveBindings(props);
  const makeCommand = useMakeCommand();

  const bindings: Record<string, KeyCommand> = {
    ...moveBindings,
    escape: {
      id: 'escape',
      name: 'escape',
      ...makeCommand('escape', async () => {
        await plugin.editor.collapseSelection('start');
        props.setMode(VimMode.Normal);
      }),
    },
    d: {
      id: 'delete visual',
      name: 'delete vis',
      ...makeCommand('d', async () => {
        await cutSelection(plugin);
        props.setMode(VimMode.Normal);
      }),
    },
    x: {
      id: 'delete visual',
      name: 'delete vis',
      ...makeCommand('x', async () => {
        await cutSelection(plugin);
        props.setMode(VimMode.Normal);
      }),
    },
    c: {
      id: 'delete visual',
      name: 'delete vis',
      ...makeCommand('c', async () => {
        await cutSelection(plugin);
        props.setMode(VimMode.Insert);
      }),
    },
  };

  useModalEditorBindings(VimMode.Visual, props.currentMode, props.previousMode, bindings);

  const updateVisualMode = (selText: any) => {
    if (props.ignoreSelectionEvents.current || !selText) {
      return;
    }
    const { start, end } = selText;
    if (start.offset !== end.offset) {
      if (props.currentMode !== VimMode.Visual) {
        props.setMode(VimMode.Visual);
      }
    } else {
      if (props.currentMode === VimMode.Visual) {
        props.setMode(VimMode.Normal);
      }
    }
  };

  useAPIEventListener(AppEvents.EditorSelectionChanged, undefined, updateVisualMode);

  return null;
};
