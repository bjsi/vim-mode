import { MoveUnit, TextSelection, usePlugin } from '@remnote/plugin-sdk';
import { useModalEditorBindings } from '../../lib/bindings';
import { ModeProps, VimMode } from './types';
import { KeyCommand } from '../../lib/types';
import { useMakeCommand } from '../../lib/hooks';
import { useMoveBindings } from '../bindings/Move';
import { MutableRefObject } from 'react';

interface NormalModeProps extends ModeProps {
  ignoreSelectionEvents: MutableRefObject<boolean>;
}

export const NormalMode = (props: NormalModeProps) => {
  const plugin = usePlugin();

  const moveBindings = useMoveBindings(props);
  const makeCommand = useMakeCommand();

  const bindings: Record<string, KeyCommand> = {
    ...moveBindings,

    /*
     * Yank, copy, delete, paste
     */

    p: {
      id: 'paste',
      name: 'paste',
      ...makeCommand('p', async () => {}),
    },
    y: {
      id: 'yank',
      name: 'yank',
      ...makeCommand('y', async () => {
        props.setMode(VimMode.Yank);
      }),
    },
    c: {
      id: 'change',
      name: 'change',
      ...makeCommand('c', async () => {
        props.setMode(VimMode.Change);
      }),
    },
    d: {
      id: 'delete',
      name: 'delete',
      ...makeCommand('d', async () => {
        props.setMode(VimMode.Delete);
      }),
    },
    x: {
      id: 'delete single char',
      name: 'delete single char',
      ...makeCommand('x', async () => {
        props.ignoreSelectionEvents.current = true;
        const { start, end } = (props.selection as TextSelection).range;
        await plugin.editor.selectText({ start, end: end + 1 });
        await plugin.editor.cut();
        props.ignoreSelectionEvents.current = false;
      }),
    },
    s: {
      id: 'delete single char',
      name: 'delete single char',
      ...makeCommand('x', async () => {
        props.ignoreSelectionEvents.current = true;
        const start = (props.selection as TextSelection).range.start;
        await plugin.editor.selectText({ start, end: start + 1 });
        await plugin.editor.cut();
        props.setMode(VimMode.Insert);
        props.ignoreSelectionEvents.current = false;
      }),
    },
    'shift+x': {
      id: 'delete single char delete single char backwards',
      name: 'delete single char backwards',
      ...makeCommand('shift+x', async () => {
        props.ignoreSelectionEvents.current = true;
        const start = (props.selection as TextSelection).range.start;
        await plugin.editor.selectText({ start: start - 1, end: start });
        await plugin.editor.cut();
        props.ignoreSelectionEvents.current = false;
      }),
    },
    'shift+y': {
      id: 'Copy to end of line',
      name: 'Copy to end of line',
      ...makeCommand('shift+y', async () => {
        props.ignoreSelectionEvents.current = true;
        const start = (props.selection as TextSelection).range.start;
        await plugin.editor.selectText({ start, end: Number.MAX_SAFE_INTEGER });
        await plugin.editor.copy();
        await plugin.editor.collapseSelection('start');
        props.ignoreSelectionEvents.current = false;
      }),
    },
    'shift+d': {
      id: 'Delete to end of line',
      name: 'Delete to end of line',
      ...makeCommand('shift+d', async () => {
        props.ignoreSelectionEvents.current = true;
        const start = (props.selection as TextSelection).range.start;
        await plugin.editor.selectText({ start, end: Number.MAX_SAFE_INTEGER });
        await plugin.editor.cut();
        await plugin.editor.collapseSelection('start');
        props.ignoreSelectionEvents.current = false;
      }),
    },
    'shift+c': {
      id: 'Change to end of line',
      name: 'Change to end of line',
      ...makeCommand('shift+c', async () => {
        props.ignoreSelectionEvents.current = true;
        const start = (props.selection as TextSelection).range.start;
        await plugin.editor.selectText({ start, end: Number.MAX_SAFE_INTEGER });
        await plugin.editor.cut();
        await plugin.editor.collapseSelection('start');
        props.ignoreSelectionEvents.current = false;
        props.setMode(VimMode.Insert);
      }),
    },

    /*
     * Enter visual mode
     */
    v: {
      id: 'enter visual',
      name: 'enter visual',
      ...makeCommand('v', async () => {
        props.setMode(VimMode.VisualText);
      }),
    },
    'mod+v': {
      id: 'enter visual char',
      name: 'enter visual char',
      ...makeCommand('mod+v', async () => {
        const start = (props.selection as TextSelection).range.start;
        await plugin.editor.selectText({ start, end: start + 1 });
      }),
    },
    'shift+v': {
      id: 'enter visual line',
      name: 'enter visual line',
      ...makeCommand('mod+v', async () => {
        if (props.focusedRem) {
          plugin.editor.selectRem([props.focusedRem._id]);
        }
      }),
    },

    /*
     * Enter insert mode
     */
    i: {
      id: 'insert',
      name: 'Insert',
      ...makeCommand('i', async () => {
        props.setMode(VimMode.Insert);
      }),
    },
    'shift+i': {
      id: 'big insert',
      name: 'Big Insert',
      ...makeCommand('shift+i', async () => {
        plugin.editor.moveCaret(-1, MoveUnit.LINE);
        props.setMode(VimMode.Insert);
      }),
    },
    a: {
      id: 'enter insert after',
      name: 'Enter Insert After',
      ...makeCommand('a', async () => {
        plugin.editor.moveCaret(1, MoveUnit.CHARACTER);
        props.setMode(VimMode.Insert);
      }),
    },
    'shift+a': {
      id: 'enter insert at end',
      name: 'Enter Insert at End',
      ...makeCommand('shift+a', async () => {
        plugin.editor.moveCaret(1, MoveUnit.LINE);
        props.setMode(VimMode.Insert);
      }),
    },
    // TODO
    // o: {
    //   id: 'Insert new Rem after',
    //   name: 'Insert new Rem after',
    //   ...makeCommand('o', async () => {
    //     await plugin.editor.insertRemAfterFocusedRem(false);
    //     props.setMode(VimMode.Insert);
    //   }),
    // },
    // TODO
    // 'shift+o': {
    //   id: "Insert new Rem before",
    //   name: "Insert new Rem before",
    //   ...makeCommand('shift+o', async () => {
    //     await plugin.editor.insertRemAfterFocusedRem(false);
    //     props.setMode(VimMode.Insert);
    //   })
    // },

    /**
     * Undo/Redo
     */
    u: {
      id: 'undo',
      name: 'Undo',
      ...makeCommand('u', async () => {
        plugin.editor.undo();
      }),
    },
    'mod+r': {
      id: 'redo',
      name: 'Redo',
      ...makeCommand('mod+r', async () => {
        plugin.editor.redo();
      }),
    },
    // 'shift+j': {
    //   id: 'join lines',
    //   name: 'Join Lines',
    //   ...makeCommand('shift+j', async () => {
    //     await plugin.editor.tryMergeWithRelative(1);
    //   }),
    // },
    '~': {
      id: 'Capitalize',
      name: 'Capitalize',
      ...makeCommand('~', async () => {
        // TODO:
      }),
    },
    '.': {
      id: 'Period',
      name: 'Period',
      ...makeCommand('.', async () => {
        // TODO:
      }),
    },
  };
  useModalEditorBindings(
    VimMode.Normal,
    props.currentMode,
    props.previousMode,
    bindings,
    props.repeatN.current
  );

  return null;
};
