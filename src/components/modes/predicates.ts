import { VimMode, YankChangeDelete } from './types';

export const isYDC = (mode: keyof VimMode): mode is YankChangeDelete => {
  return mode in YankChangeDelete;
};
