import { usePlugin } from '@remnote/plugin-sdk';
import { KeyCommand } from '../../lib/types';
import { isYDC } from '../modes/predicates';
import { ModeProps, VimMode } from '../modes/types';
import { useRepeatBindings } from './Repeat';

interface MoveBindingsProps extends ModeProps {
  moveFinalizer?: () => Promise<void>;
}

export function useMoveBindings(props: MoveBindingsProps) {
  const plugin = usePlugin();
  const isVisualOrYCD = props.currentMode === VimMode.Visual || isYDC(props.currentMode);

  const repeatBindings = useRepeatBindings(props);

  const makeMoveCommand = (key: string, action: () => Promise<void>) => {
    return {
      keyboardShortcut: key,
      action: async () => {
        let ignoredEvents = false;
        if (isYDC(props.currentMode)) {
          props.ignoreSelectionEvents.current = true;
          ignoredEvents = true;
        }
        // TODO: optimize by passing repeatN to action
        const repeat = Math.max(1, props.repeatN.current);
        for (let i = 0; i < repeat; i++) {
          await action();
        }
        const finalizer = props.moveFinalizer;
        if (typeof finalizer === 'function') {
          await finalizer();
        }
        if (ignoredEvents) {
          props.ignoreSelectionEvents.current = false;
          props.setMode(VimMode.Normal);
        }
        props.repeatN.current = 0;
      },
    };
  };

  const bindings: Record<string, KeyCommand> = {
    ...repeatBindings,
    h: {
      id: 'move left',
      name: 'Move Left',
      ...makeMoveCommand('h', async () => {
        await plugin.editor.moveCaret(-1, isVisualOrYCD ? 0 : -1, 2);
      }),
    },
    backspace: {
      id: 'move left 2',
      name: 'Move Left',
      ...makeMoveCommand('backspace', () => plugin.editor.moveCaret(-1, isVisualOrYCD ? 0 : -1, 2)),
    },
    j: {
      id: 'move down',
      name: 'Move Down',
      ...makeMoveCommand('j', () => plugin.editor.moveFocusedRemSelectionVertical(1)),
    },
    enter: {
      id: 'move down 2',
      name: 'Move Down',
      ...makeMoveCommand('enter', async () => {
        // TODO: visual mode
        await plugin.editor.moveCaret(-1, -1, 6);
        await plugin.editor.moveFocusedRemSelectionVertical(1);
      }),
    },
    k: {
      id: 'move up',
      name: 'Move Up',
      ...makeMoveCommand('k', async () => {
        // TODO: visual mode
        plugin.editor.moveFocusedRemSelectionVertical(-1);
      }),
    },
    l: {
      id: 'move right',
      name: 'Move Right',
      ...makeMoveCommand('l', () => plugin.editor.moveCaret(isVisualOrYCD ? 0 : 1, 1, 2)),
    },
    space: {
      id: 'move right 2',
      name: 'Move Right',
      ...makeMoveCommand('space', () => plugin.editor.moveCaret(isVisualOrYCD ? 0 : 1, 1, 2)),
    },
    w: {
      id: 'word',
      name: 'Word',
      ...makeMoveCommand('w', () => plugin.editor.moveCaret(isVisualOrYCD ? 0 : 1, 1, 4)),
    },
    // just does the same as w
    'shift+w': {
      id: 'move big word forwards',
      name: 'Move Big Word Forward',
      ...makeMoveCommand('shift+w', () => plugin.editor.moveCaret(isVisualOrYCD ? 0 : 1, 1, 4)),
    },
    b: {
      id: 'backwards',
      name: 'Backward Word',
      ...makeMoveCommand('b', () => plugin.editor.moveCaret(-1, isVisualOrYCD ? 0 : -1, 4)),
    },
    // just does the same as b
    'shift+b': {
      id: 'move big word backwards',
      name: 'Move Big Word Backward',
      ...makeMoveCommand('shift+b', () => plugin.editor.moveCaret(-1, isVisualOrYCD ? 0 : -1, 4)),
    },
    e: {
      id: 'end',
      name: 'End of word',
      ...makeMoveCommand('e', async () => {
        // needs to move to the actual end of the word in visual or YCD mode
        await plugin.editor.moveCaret(isVisualOrYCD ? 0 : 1, 1, isVisualOrYCD ? 5 : 7);
      }),
    },
    // just does the same as e
    'shift+e': {
      id: 'big end of word',
      name: 'End of word',
      ...makeMoveCommand('shift+e', () => plugin.editor.moveCaret(isVisualOrYCD ? 0 : 1, 1, 7)),
    },

    '0': {
      id: 'Beginning of line',
      name: 'Beginning of line',
      ...makeMoveCommand('0', async () => {
        plugin.editor.moveCaret(isVisualOrYCD ? 0 : -1, -1, 6);
      }),
    },

    'shift+4': {
      id: 'End of line',
      name: 'End of line',
      ...makeMoveCommand('shift+4', async () => {
        plugin.editor.moveCaret(isVisualOrYCD ? 0 : 1, 1, 6);
      }),
    },

    // 'shift+g': {
    //   id: 'Bottom',
    //   name: "Bottom",
    //   ...makeCommand('shift+g', async () => {
    //     plugin.editor.moveCaret(1, 6)
    //   })
    // },
  };
  return bindings;
}
