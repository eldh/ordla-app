import { deepStrictEqual } from "node:assert";
import { test } from "node:test";
import { getGuessStates } from "./letterState.ts";

test("marks letters on the right spot as hits", () => {
  deepStrictEqual(getGuessStates("laser", "lasse"), [
    "hit",
    "hit",
    "hit",
    "miss",
    "almost",
  ]);
});

test("marks letters that are in the word as almost", () => {
  deepStrictEqual(getGuessStates("laser", "sedan"), [
    "almost",
    "almost",
    "miss",
    "almost",
    "miss",
  ]);
});

test("marks letters that are not in the word as misses", () => {
  deepStrictEqual(getGuessStates("laser", "picko"), [
    "miss",
    "miss",
    "miss",
    "miss",
    "miss",
  ]);
});

test("marks both copies of a doubled letter as almost", () => {
  deepStrictEqual(getGuessStates("laser", "asgam"), [
    "almost",
    "almost",
    "miss",
    "almost",
    "miss",
  ]);
});

test("does not mark a second copy as almost when the first one is a hit", () => {
  deepStrictEqual(getGuessStates("laser", "packa"), [
    "miss",
    "hit",
    "miss",
    "miss",
    "miss",
  ]);
});

test("keeps one almost when the word has two copies and the guess hits one", () => {
  // "allan" has two l:s: the guess hits one of them, so the other l stays almost.
  deepStrictEqual(getGuessStates("allan", "lilla"), [
    "almost",
    "miss",
    "hit",
    "almost",
    "almost",
  ]);
});

test("marks every copy as miss when the word has no copies left", () => {
  // "tassa" has two s:s and the guess hits both, so the leading s is a miss.
  deepStrictEqual(getGuessStates("tassa", "sassa"), [
    "miss",
    "hit",
    "hit",
    "hit",
    "hit",
  ]);
});
