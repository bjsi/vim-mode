import { MoveUnit } from '@remnote/plugin-sdk';

export const movePoint = (
  text: string,
  point: number,
  delta: number,
  unit: MoveUnit.WORD_START | MoveUnit.WORD_END | 'WORD_END_VIM' | MoveUnit.LINE
) => {
  if (delta == 0 || point >= text.length - 1) return point;
  const direction = Math.sign(delta);
  const wordCharRegex = /[A-Za-zÀ-ÖØ-öø-ÿā-żâ-ž0-9]/g;
  let hasSeenWhitespace = false;
  let seenWordCharacters = 0;
  const recordSeenCharacters = (character: string | null) => {
    if (character?.match(/\s/g)) {
      hasSeenWhitespace = true;
    } else if (character?.match(wordCharRegex)) {
      seenWordCharacters++;
    }
  };

  let i = point;
  let step = 0;
  let currentChar = text[i];

  const moveByUnit = (): boolean => {
    if (unit === MoveUnit.WORD_START) {
      const wordCharacter = currentChar?.match(wordCharRegex);
      return direction === 1
        ? !!(wordCharacter && hasSeenWhitespace)
        : !!(!wordCharacter && seenWordCharacters);
    } else if (unit === MoveUnit.WORD_END) {
      const wordCharacter = currentChar?.match(wordCharRegex);
      return direction == 1
        ? !!(!wordCharacter && seenWordCharacters)
        : !!(wordCharacter && hasSeenWhitespace);
    }
    // TODO: moving backwards not working
    else if (unit === 'WORD_END_VIM') {
      const prevChar = text[i + -1 * direction];
      const prevIsWordCharacter = prevChar?.match(wordCharRegex);
      const nextCharacter = text[i + 1 * direction];
      const nextNextCharacter = text[i + 2 * direction];
      const nextIsWordCharacter = nextCharacter?.match(wordCharRegex);
      const nextNextIsWordCharacter = nextNextCharacter?.match(wordCharRegex);
      return direction == 1
        ? !!((!nextNextIsWordCharacter || (!nextIsWordCharacter && !prevIsWordCharacter) ) && seenWordCharacters)
        : !!(prevIsWordCharacter && hasSeenWhitespace);
    } else if (unit === MoveUnit.LINE) {
      return false;
    }
    return false;
  };

  while ((direction === -1 ? i > 0 : i < text.length) && step < Math.abs(delta)) {
    currentChar = text[i];
    recordSeenCharacters(currentChar);
    const didStep = moveByUnit();
    if (didStep) {
      step++;
      hasSeenWhitespace = false;
      seenWordCharacters = 0;
    }
    i += direction;
  }

  return i;
};
