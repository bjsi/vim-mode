import {Command} from '@remnote/plugin-sdk';
import React from 'react';

export type StateUpdater<T> = React.Dispatch<React.SetStateAction<T>>
export interface KeyCommand extends Omit<Command, 'keyboardShortcut'> {
  keyboardShortcut: string
}
