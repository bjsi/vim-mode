import { AppEvents, useAPIEventListener, usePlugin, useRunAsync } from '@remnote/plugin-sdk';
import { VimMode } from '../components/modes/types';
import { KeyCommand } from './types';

const allKeys = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '`',
  '~',
  '!',
  '/',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '(',
  ')',
  '-',
  '_',
  '=',
  '+',
  '[',
  '{',
  ']',
  '}',
  '\\',
  '|',
  ',',
  '`',
  "'",
  '"',
  ',',
  '<',
  '.',
  '>',
  'space',
  'backspace',
  'escape',
  'enter',
].reduce((acc, key) => {
  return acc.concat([key, key.toUpperCase(), `mod+${key}`, `shift+${key}`]);
}, [] as string[]);

export const useModalEditorBindings = (
  mode: keyof VimMode,
  currentMode: keyof VimMode,
  previousMode: keyof VimMode | undefined,
  bindingMap: Record<string, KeyCommand>,
  repeat: number
) => {
  const plugin = usePlugin();
  const currentBindings = Object.values(bindingMap) as KeyCommand[];
  useAPIEventListener(AppEvents.StealKeyEvent, 'vim_mode', (args) => {
    if (currentMode === mode) {
      const action = bindingMap[args.key.toLowerCase()]?.action;
      if (action && typeof action === 'function') {
        action(repeat);
      }
    }
  });

  useRunAsync(async () => {
    if (mode === VimMode.Insert && currentMode === VimMode.Insert) {
      await plugin.app.releaseKeys(allKeys);
      await plugin.app.stealKeys(
        currentBindings.reduce((acc, x) => acc.concat(x.keyboardShortcut), [] as string[])
      );
    } else if (currentMode !== VimMode.Insert) {
      await plugin.app.stealKeys(allKeys);
    }
  }, [mode, currentMode]);
};
