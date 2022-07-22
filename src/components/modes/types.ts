import { MutableRefObject } from 'react';
import { StateUpdater } from '../../lib/types';

export interface ModeProps {
  ignoreSelectionEvents: MutableRefObject<boolean>;
  currentMode: keyof VimMode;
  repeatN: MutableRefObject<number>;
  previousMode: keyof VimMode | undefined;
  setMode: StateUpdater<keyof VimMode>;
}

export enum YankChangeDelete {
  Yank = 'Yank',
  Change = 'Change',
  Delete = 'Delete',
}

export enum Modes {
  Normal = 'Normal',
  Insert = 'Insert',
  Visual = 'Visual',
  VisualLine = 'VisualLine',
}

export const VimMode = { ...YankChangeDelete, ...Modes };
export type VimMode = typeof VimMode;
