import { usePlugin } from '@remnote/plugin-sdk';
import React from 'react';
import { VimCommand } from './types';

export function usePrevious<T>(value: T) {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  }, [value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
}

export const useMakeCommand = () => {
  const plugin = usePlugin();
  const makeCommand = (
    keyboardShortcut: string,
    action: (repeatN: number) => Promise<void> | void
  ): VimCommand => {
    return {
      keyboardShortcut,
      action,
    };
  };
  return makeCommand;
};
