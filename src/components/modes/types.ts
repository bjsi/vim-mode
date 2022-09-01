import { Rem, RemSelection, RichTextInterface, TextSelection } from '@remnote/plugin-sdk';
import { MutableRefObject } from 'react';
import { StateUpdater } from '../../lib/types';

export interface ModeProps {
  ignoreSelectionEvents: MutableRefObject<boolean>;
  currentMode: keyof VimMode;
  repeatN: MutableRefObject<number>;
  previousMode: keyof VimMode | undefined;
  setMode: StateUpdater<keyof VimMode>;
  selection: RemSelection | TextSelection | undefined;
  focusedText: RichTextInterface | undefined;
  focusedRem: Rem | undefined;
}

export enum YankChangeDelete {
  Yank = 'Yank',
  Change = 'Change',
  Delete = 'Delete',
}

export enum Modes {
  Normal = 'Normal',
  Insert = 'Insert',
  VisualText = 'VisualText',
  VisualLine = 'VisualLine',
}

export const VimMode = { ...YankChangeDelete, ...Modes };
export type VimMode = typeof VimMode;
