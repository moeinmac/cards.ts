import { CARDS, CARDS_AND_JOKERS, JOKERS, SUITS, VALUES } from "../constants/index.ts";
import type { AllCode, Card, Code, DeckInput, DrawInput, ListCardReturn, ReturnInput, ShuffleInput } from "../types/index.type.ts";
import { cardValidity, randomChoice } from "../utils/index.ts";

class Deck {
  private jokerEnable: boolean;
  private remaining: number;
  private createdAt: string;
  private cards: Code[] | AllCode[];
  private remainingCards: Code[] | AllCode[];
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
    this.cards = input && input?.shuffled ? this.shuffleCardsHelper({ justRemaining: false, randomChance: 0.5 }) : this.cards;
    this.remainingCards = this.cards;
  }
  info() {
    return {
      createdAt: this.createdAt,
      remaining: this.remaining,
      drawnCards: this.cards.length - this.remaining,
    };
  }
  private listCardHelper(cards: Code[] | AllCode[]) {
    const remainingCards: Card[] = cards.map((c: Code | AllCode) => {
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

  private shuffleCardsHelper(input: Required<ShuffleInput>) {
    const shuffledDeck = input.justRemaining
      ? this.remainingCards.sort(() => input.randomChance - Math.random())
      : this.cards.sort(() => input.randomChance - Math.random());
    return shuffledDeck;
  }

  listCards(justRemaining?: boolean) {
    return this.listCardHelper(justRemaining ? this.remainingCards : this.cards);
  }

  shuffle(input?: ShuffleInput): ListCardReturn {
    const justRemaining = input && input?.justRemaining ? input.justRemaining : false;
    const randomChance = input && input?.randomChance ? input.randomChance : 0.5;
    this.cards = this.shuffleCardsHelper({ justRemaining, randomChance });
    this.remaining = this.cards.length;
    return {
      cards: this.listCards(justRemaining),
      remaining: this.remaining,
      shuffled: true,
      status: "success",
    };
  }

  drawCard(input?: DrawInput): ListCardReturn {
    const count = input && input?.count ? input.count : 1;
    const mode: DrawInput["mode"] = input && input?.mode ? input.mode : "random";
    if (count > this.remainingCards.length)
      return {
        status: "error",
        message: `you can't draw cards more than remaining card in deck , remaining card in deck is ${this.remaining}`,
        cards: [],
      };
    if (mode !== "bottom" && mode !== "random" && mode !== "top")
      return {
        cards: [],
        status: "error",
        message: "pick correct mode , valid choices would be `random` or `top` or `bottom`",
      };
    const drawnCards = [];
    for (let i = 0; i < count; i++) {
      let theCard: Code | AllCode;
      if (mode === "random") theCard = this.remainingCards.splice(randomChoice(this.remaining), 1)[0];
      if (mode === "top") theCard = this.remainingCards.shift();
      if (mode === "bottom") theCard = this.remainingCards.pop();
      drawnCards.push(theCard);
      this.remaining--;
    }
    return {
      status: "success",
      cards: this.listCardHelper(drawnCards),
      remaining: this.remaining,
      shuffled: false,
    };
  }
  returnCard({ cards }: ReturnInput): ListCardReturn {
    if (!cards || cards.length === 0)
      return {
        cards: [],
        status: "error",
        message: "pass some cards for returning to the deck.",
      };

    cardValidity(cards);
    const remainingCardsSet = new Set(this.remainingCards);
    const cardsSet = new Set(this.cards);
    const errorCards: string[] = [];
    cards.forEach((c) => {
      if (!remainingCardsSet.has(c) && cardsSet.has(c)) remainingCardsSet.add(c);
      else return errorCards.push(c);
    });
    if (errorCards.length > 0)
      return {
        status: "error",
        message: "You cannot return these cards to the deck because they have not yet been drawn or were not in the initial deck.",
        cards: errorCards,
      };
    this.remainingCards = Array.from(remainingCardsSet);
    this.remaining = remainingCardsSet.size;
    return {
      status: "success",
      remaining: this.remaining,
      cards: [],
      shuffled: false,
    };
  }
}

export { Deck };
export default Deck;
