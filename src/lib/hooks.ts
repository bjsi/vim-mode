import { usePlugin } from '@remnote/plugin-sdk';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export function usePrevious<T>(value: T) {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  }, [value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
}

export const useMakeCommand = () => {
  const plugin = usePlugin();
  const makeCommand = (shortcut: string, action: () => Promise<void>) => {
    return {
      keyboardShortcut: shortcut,
      action: async () => {
        await action();
      },
    };
  };
  return makeCommand;
};
