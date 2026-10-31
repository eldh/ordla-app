export type LetterState = "hit" | "almost" | "miss";

/**
 * The state of one letter of a guess.
 *
 * A letter is a "hit" when it is on the correct spot. It is "almost" when the
 * word contains more copies of the letter than the guess has hits of it. Thus,
 * two copies of the same letter can both be "almost", but a copy that the
 * guess already found on its correct spot does not make a second copy "almost".
 */
export function getLetterState({
  word,
  guess,
  letter,
  index,
}: {
  word: string;
  guess?: string;
  letter?: string;
  index: number;
}): LetterState {
  if (letter === undefined) {
    return "miss";
  }
  if (word[index] === letter) {
    return "hit";
  }

  const occurrencesInWord = word.split("").filter((l) => l === letter).length;
  const hitsInGuess =
    guess?.split("").filter((l, i) => l === letter && word[i] === l).length ??
    0;

  return occurrencesInWord > hitsInGuess ? "almost" : "miss";
}

/** The state of every letter of a guess. */
export function getGuessStates(word: string, guess: string): LetterState[] {
  return guess
    .split("")
    .map((letter, index) => getLetterState({ word, guess, letter, index }));
}
