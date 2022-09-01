import { renderWidget, SelectionType, useTracker } from '@remnote/plugin-sdk';
import { useRef, useState } from 'react';
import { ChangeMode } from '../components/modes/ChangeMode';
import { DeleteMode } from '../components/modes/DeleteMode';
import { InsertMode } from '../components/modes/InsertMode';
import { NormalMode } from '../components/modes/NormalMode';
import { ModeProps, VimMode } from '../components/modes/types';
import { VisualLineMode } from '../components/modes/VisualLineMode';
import { VisualMode } from '../components/modes/VisualMode';
import { YankMode } from '../components/modes/YankMode';
import { usePrevious } from '../lib/hooks';
import React from 'react';

export const Vim = () => {
  const [mode, setMode] = useState<keyof VimMode>(VimMode.Normal);
  const previousMode = usePrevious(mode);
  const repeatN = useRef<number>(0);
  const ignoreSelectionEvents = useRef<boolean>(false);
  const selection = useTracker((rp) => rp.editor.getSelection());
  // const focusedText = useTracker((rp) => rp.editor.getFocusedEditorText());
  const focusedRem = useTracker((rp) => rp.focus.getFocusedRem());

  const commonProps: ModeProps = {
    repeatN,
    currentMode: mode,
    previousMode: previousMode,
    setMode: setMode,
    ignoreSelectionEvents: ignoreSelectionEvents,
    selection,
    focusedText: [],
    focusedRem,
  };

  React.useEffect(() => {
    if (ignoreSelectionEvents.current) {
      return;
    }
    if (!selection) {
      return;
    }
    if (selection.type === SelectionType.Rem) {
      setMode(VimMode.VisualLine);
    } else {
      const { start, end } = selection.range;
      if (start !== end) {
        if (mode !== VimMode.VisualText) {
          setMode(VimMode.VisualText);
        }
      } else {
        if (mode === VimMode.VisualText) {
          setMode(VimMode.Normal);
        }
      }
    }
  }, [selection]);

  return (
    <div>
      Mode: {mode}
      <button
        onClick={() => {
          setMode(VimMode.Normal);
        }}
      >
        Normal
      </button>
      <button
        onClick={() => {
          setMode(VimMode.Insert);
        }}
      >
        Insert
      </button>
      <button
        onClick={() => {
          setMode(VimMode.VisualText);
        }}
      >
        Visual
      </button>
      <button
        onClick={() => {
          setMode(VimMode.Delete);
        }}
      >
        Delete
        <button
          onClick={() => {
            setMode(VimMode.VisualLine);
          }}
        >
          Visual Line
        </button>
      </button>
      <InsertMode {...commonProps} />
      <NormalMode {...commonProps} />
      <ChangeMode {...commonProps} />
      <DeleteMode {...commonProps} />
      <YankMode {...commonProps} />
      <VisualMode {...commonProps} />
      <VisualLineMode {...commonProps} />
    </div>
  );
};

renderWidget(Vim);
