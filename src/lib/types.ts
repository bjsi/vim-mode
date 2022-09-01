import { Command } from '@remnote/plugin-sdk';
import React from 'react';

export type StateUpdater<T> = React.Dispatch<React.SetStateAction<T>>;
export interface VimCommand {
  keyboardShortcut: string;
  action: (repeatN: number) => Promise<void> | void;
}
export interface KeyCommand extends Omit<Command, 'action' | 'keyboardShortcut'>, VimCommand {}
