import { MoveUnit, TextSelection, usePlugin } from '@remnote/plugin-sdk';
import { movePoint } from '../../lib/editor';
import { KeyCommand } from '../../lib/types';
import { isYDC } from '../modes/predicates';
import { ModeProps, VimMode } from '../modes/types';
import { useRepeatBindings } from './Repeat';

interface MoveBindingsProps extends ModeProps {
  moveFinalizer?: () => Promise<void>;
}

export function useMoveBindings(props: MoveBindingsProps) {
  const plugin = usePlugin();
  const repeatBindings = useRepeatBindings(props);

  const makeMoveCommand = (key: string, action: (repeatN: number) => Promise<void>) => {
    return {
      keyboardShortcut: key,
      action: async () => {
        let ignoredEvents = false;
        if (isYDC(props.currentMode)) {
          props.ignoreSelectionEvents.current = true;
          ignoredEvents = true;
        }
        const repeat = Math.max(1, props.repeatN.current);
        await action(repeat);
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

  const move = async (key: string, repeat: number) => {
    const direction = key == 'h' ? -1 : 1;
    // TODO: some kind of key-pair function / class with forward / backward methods.
    if (key === 'h' || key === 'l') {
      if (props.currentMode === VimMode.VisualText || isYDC(props.currentMode)) {
        const sel = props.selection as TextSelection;
        const { start, end } = sel.range;
        let newStart = start;
        let newEnd = end;
        if (sel.isReverse) {
          newStart += direction * repeat;
        } else {
          newEnd += direction * repeat;
        }
        await plugin.editor.selectText({
          start: Math.max(!sel.isReverse ? newStart : newEnd, 0),
          end: Math.max(!sel.isReverse ? newEnd : newStart, 0),
        });
      } else {
        await plugin.editor.moveCaret(direction * repeat, MoveUnit.CHARACTER);
      }
    } else if (key === 'w' || key === 'b') {
      const direction = key == 'b' ? -1 : 1;
      if (props.currentMode === VimMode.VisualText || isYDC(props.currentMode)) {
        const sel = props.selection as TextSelection;
        const { start, end } = sel.range;
        let newStart = start;
        let newEnd = end;
        const text = await plugin.richText.toString(
          (await plugin.editor.getFocusedEditorText()) || []
        );
        if (sel.isReverse) {
          newStart = movePoint(text, newStart, repeat * direction, MoveUnit.WORD_START);
        } else {
          newEnd = movePoint(text, newEnd, repeat * direction, MoveUnit.WORD_START);
        }
        await plugin.editor.selectText({
          start: Math.max(!sel.isReverse ? newStart : newEnd, 0),
          end: Math.max(!sel.isReverse ? newEnd : newStart, 0),
        });
      } else {
        await plugin.editor.moveCaret(direction * repeat, MoveUnit.WORD_START);
      }
    } else if (key === 'e' || key === 'ge') {
      const direction = key == 'ge' ? -1 : 1;
      if (props.currentMode === VimMode.VisualText || isYDC(props.currentMode)) {
        const sel = props.selection as TextSelection;
        const { start, end } = sel.range;
        let newStart = start;
        let newEnd = end;
        const text = await plugin.richText.toString(
          (await plugin.editor.getFocusedEditorText()) || []
        );
        if (sel.isReverse) {
          newStart = movePoint(text, newStart, repeat * direction, MoveUnit.WORD_END);
        } else {
          newEnd = movePoint(text, newEnd, repeat * direction, MoveUnit.WORD_END);
        }
        await plugin.editor.selectText({
          start: Math.max(!sel.isReverse ? newStart : newEnd - 1, 0),
          end: Math.max(!sel.isReverse ? newEnd - 1 : newStart, 0),
        });
      } else {
        const { start } = (props.selection as TextSelection).range;
        const text = await plugin.richText.toString(
          (await plugin.editor.getFocusedEditorText()) || []
        );
        const newStart = movePoint(text, start, repeat * direction, 'WORD_END_VIM');
        await plugin.editor.selectText({ start: newStart, end: newStart });
      }
    } else if (key === '0' || key === '$') {
      const direction = key === '$' ? 1 : -1;
      if (props.currentMode === VimMode.VisualText || isYDC(props.currentMode)) {
        const sel = props.selection as TextSelection;
        const { start, end } = sel.range;
        let newStart = start;
        let newEnd = end;
        const text = await plugin.richText.toString(
          (await plugin.editor.getFocusedEditorText()) || []
        );
        if (sel.isReverse) {
          newStart = movePoint(text, newStart, repeat * direction, MoveUnit.LINE);
        } else {
          newEnd = movePoint(text, newEnd, repeat * direction, MoveUnit.LINE);
        }
        await plugin.editor.selectText({
          start: Math.max(!sel.isReverse ? newStart : newEnd, 0),
          end: Math.max(!sel.isReverse ? newEnd : newStart, 0),
        });
      } else {
        await plugin.editor.moveCaret(direction * repeat, MoveUnit.LINE);
      }
    }
  };

  const bindings: Record<string, KeyCommand> = {
    ...repeatBindings,
    h: {
      id: 'move left',
      name: 'Move Left',
      ...makeMoveCommand('h', (repeat) => move('h', repeat)),
    },
    backspace: {
      id: 'move left 2',
      name: 'Move Left',
      ...makeMoveCommand('backspace', (repeat) => move('h', repeat)),
    },
    j: {
      id: 'move down',
      name: 'Move Down',
      ...makeMoveCommand('j', () => plugin.editor.moveCaretVertical(1)),
    },
    '-': {
      id: 'move up 2',
      name: 'Move up',
      ...makeMoveCommand('-', async () => {
        if (props.currentMode === VimMode.VisualText || isYDC(props.currentMode)) {
          // ?
        } else {
          await plugin.editor.moveCaretVertical(-1);
          await plugin.editor.moveCaret(-1, MoveUnit.LINE);
        }
      }),
    },
    enter: {
      id: 'move down 2',
      name: 'Move Down',
      ...makeMoveCommand('enter', async () => {
        if (props.currentMode === VimMode.VisualText || isYDC(props.currentMode)) {
          // ?
        } else {
          await plugin.editor.moveCaretVertical(1);
          await plugin.editor.moveCaret(-1, MoveUnit.LINE);
        }
      }),
    },
    k: {
      id: 'move up',
      name: 'Move Up',
      ...makeMoveCommand('k', async () => {
        // TODO: visual mode
        plugin.editor.moveCaretVertical(-1);
      }),
    },
    l: {
      id: 'move right',
      name: 'Move Right',
      ...makeMoveCommand('l', (repeat) => move('l', repeat)),
    },
    space: {
      id: 'move right 2',
      name: 'Move Right',
      ...makeMoveCommand('space', (repeat) => move('l', repeat)),
    },
    w: {
      id: 'word',
      name: 'Word',
      ...makeMoveCommand('w', (repeat) => move('w', repeat)),
    },
    // just does the same as w
    'shift+w': {
      id: 'move big word forwards',
      name: 'Move Big Word Forward',
      ...makeMoveCommand('shift+w', (repeat) => move('w', repeat)),
    },
    b: {
      id: 'backwards',
      name: 'Backward Word',
      ...makeMoveCommand('b', (repeat) => move('b', repeat)),
    },
    // just does the same as b
    'shift+b': {
      id: 'move big word backwards',
      name: 'Move Big Word Backward',
      ...makeMoveCommand('shift+b', (repeat) => move('b', repeat)),
    },
    e: {
      id: 'end',
      name: 'End of word',
      ...makeMoveCommand('e', (repeat) => move('e', repeat)),
    },
    // just does the same as e
    'shift+e': {
      id: 'big end of word',
      name: 'End of word',
      ...makeMoveCommand('shift+e', (repeat) => move('ge', repeat)),
    },

    '0': {
      id: 'Beginning of line',
      name: 'Beginning of line',
      ...makeMoveCommand('0', (repeat) => move('0', repeat)),
    },

    'shift+4': {
      id: 'End of line',
      name: 'End of line',
      ...makeMoveCommand('shift+4', (repeat) => move('$', repeat)),
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
