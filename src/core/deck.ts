import { CARDS, CARDS_AND_JOKERS, JOKERS, SUITS, VALUES } from "../constants/index.ts";
import type { AllCode, Card, Code, DeckInput } from "../types/index.type.ts";
import { cardValidity } from "../utils/index.ts";

class Deck {
  private jokerEnable: boolean;
  private remaining: number;
  private createdAt: string;
  private cards: Code[] | AllCode[];
  private drawnCards: Set<Code[] | AllCode[]>;
  constructor(input?: DeckInput) {
    this.jokerEnable = input?.jokerEnable ?? false;
    this.remaining = input?.cards && input?.cards.length > 0 ? input?.cards.length + Number(!!this.jokerEnable) : 52 + Number(!!this.jokerEnable);
    this.createdAt = new Date().toISOString();
    this.cards =
      input?.cards && input?.cards.length > 0 && cardValidity(input.cards)
        ? this.jokerEnable
          ? [...input.cards, ...JOKERS]
          : input.cards
        : this.jokerEnable
        ? CARDS_AND_JOKERS
        : CARDS;
    this.drawnCards = new Set<Code[] | AllCode[]>([]);
  }
  info() {
    return {
      createdAt: this.createdAt,
      remainingCards: this.remaining,
      drawnCards: this.drawnCards.size,
    };
  }
  listCards() {
    const remainingCards: Card[] = this.cards.map((c: Code | AllCode) => {
      const cardValue = c[0];
      const cardSuit = c[1];
      return {
        code: c,
        suit: SUITS[cardSuit],
        value: cardValue,
        valueLong: cardValue in VALUES ? VALUES[cardValue] : cardValue,
      } as Card;
    });
    return remainingCards;
  }
}

export default Deck;

const deck1 = new Deck({ cards: ["0C", "0D"], jokerEnable: true });

console.log(deck1.listCards());
