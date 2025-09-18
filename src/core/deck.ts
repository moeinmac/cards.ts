import { CARDS, CARDS_AND_JOKERS, JOKERS, SUITS, VALUES } from "../constants/index.ts";
import type { AllCode, Card, Code, DeckInput, DrawInput, ListCardReturn, ShuffleInput } from "../types/index.type.ts";
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

  listCards(justRemaining?: boolean) {
    return this.listCardHelper(justRemaining ? this.remainingCards : this.cards);
  }

  shuffle(input?: ShuffleInput): ListCardReturn {
    const justRemaining = input && input?.justRemaining ? input.justRemaining : false;
    const randomChance = input && input?.randomChance ? input.randomChance : 0.5;
    const shuffledDeck = justRemaining
      ? this.remainingCards.sort(() => randomChance - Math.random())
      : this.cards.sort(() => randomChance - Math.random());

    this.cards = shuffledDeck;
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
  }
}

export default Deck;

const deck1 = new Deck({ cards: ["0C", "0D"], jokerEnable: true });

// console.log(deck1.listCards());

// deck1.shuffle();

// console.log(deck1.listCards());
