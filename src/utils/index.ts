import { CARDS_AND_JOKERS } from "../constants/index.ts";
import type { Code } from "../types/index.type.ts";

export const cardValidity = (cards: Code[]) => {
  const cardsSet = new Set(CARDS_AND_JOKERS);
  const allCardsValid = cards.every((c) => cardsSet.has(c));
  if (!allCardsValid) throw new Error("Your Cards Are Not Valid (valid choices are in type `Code`)");
  return allCardsValid;
};
