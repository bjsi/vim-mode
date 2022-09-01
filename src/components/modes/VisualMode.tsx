import { AppEvents, useAPIEventListener, usePlugin } from '@remnote/plugin-sdk';
import { useModalEditorBindings } from '../../lib/bindings';
import { ModeProps, VimMode } from './types';
import { KeyCommand } from '../../lib/types';
import { useMakeCommand } from '../../lib/hooks';
import { useMoveBindings } from '../bindings/Move';
import { MutableRefObject } from 'react';

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
        await plugin.editor.cut();
        props.setMode(VimMode.Normal);
      }),
    },
    x: {
      id: 'delete visual',
      name: 'delete vis',
      ...makeCommand('x', async () => {
        await plugin.editor.cut();
        props.setMode(VimMode.Normal);
      }),
    },
    c: {
      id: 'delete visual',
      name: 'delete vis',
      ...makeCommand('c', async () => {
        await plugin.editor.cut();
        props.setMode(VimMode.Insert);
      }),
    },
  };

  useModalEditorBindings(
    VimMode.VisualText,
    props.currentMode,
    props.previousMode,
    bindings,
    props.repeatN.current
  );

  return null;
};
