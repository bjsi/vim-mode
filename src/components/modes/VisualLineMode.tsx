import { SelectionType, usePlugin } from '@remnote/plugin-sdk';
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

  const expandLineSelectionRelative = async (amount: number) => {
    const direction = amount < 0 ? -1 : 1;
    const selection = await plugin.editor.getSelection();
    if (selection?.type !== SelectionType.Rem) {
      return;
    }
    const curRem = await plugin.rem.findOne(selection.remIds[0]);
    const visibleSiblings = (await curRem?.visibleSiblingRem()) || [];
    const pos = (await curRem?.positionAmongstVisibleSiblings())!;

    if (direction === -1) {
      // sibling else parent
      if (pos > 0) {
        const target = visibleSiblings[pos];
      }
    } else {
      // child else sibling
    }
  };

  const bindings: Record<string, KeyCommand> = {
    j: {
      id: 'line select down',
      name: 'line select down',
      ...makeCommand('j', async (repeat) => {
        await expandLineSelectionRelative(repeat);
      }),
    },
    k: {
      id: 'line select up',
      name: 'line select up',
      ...makeCommand('k', async (repeat) => {
        await expandLineSelectionRelative(-1 * repeat);
      }),
    },
    escape: {
      id: 'escape',
      name: 'escape',
      ...makeCommand('escape', async () => {
        await plugin.editor.selectText({ start: 0, end: 0 });
        props.setMode(VimMode.Normal);
      }),
    },
    d: {
      id: 'delete VisualLine',
      name: 'delete vis',
      ...makeCommand('d', async () => {
        // TODO: set the focused Rem after cutting
        await plugin.editor.cut();
        props.setMode(VimMode.Normal);
      }),
    },
    x: {
      id: 'delete VisualLine',
      name: 'delete vis',
      ...makeCommand('x', async () => {
        // TODO: set the focused Rem after cutting
        await plugin.editor.cut();
        props.setMode(VimMode.Normal);
      }),
    },
    c: {
      id: 'delete VisualLine',
      name: 'delete vis',
      ...makeCommand('c', async () => {
        // TODO: set the focused Rem after cutting
        await plugin.editor.cut();
        props.setMode(VimMode.Normal);
      }),
    },
  };

  useModalEditorBindings(
    VimMode.VisualLine,
    props.currentMode,
    props.previousMode,
    bindings,
    props.repeatN.current
  );

  // TODO:
  // - store initial selected Rem.

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
