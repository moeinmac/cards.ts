export type DeckInput = {
  jokerEnable?: true;
  cards?: Code[];
  shuffled?: boolean;
};

export type ShuffleInput = {
  justRemaining?: boolean;
  randomChance?: number;
};

export type DrawInput = {
  count: number;
  mode: "random" | "top" | "bottom";
};

type ListCardSuccess = {
  status: "success";
  cards: Card[];
  remaining: number;
  shuffled: boolean;
};

type ListCardError = {
  cards: [];
  status: "error";
  message: string;
};

export type ListCardReturn = ListCardSuccess | ListCardError;

export type Code =
  | "AS"
  | "2S"
  | "3S"
  | "4S"
  | "5S"
  | "6S"
  | "7S"
  | "8S"
  | "9S"
  | "0S"
  | "JS"
  | "QS"
  | "KS"
  | "AD"
  | "2D"
  | "3D"
  | "4D"
  | "5D"
  | "6D"
  | "7D"
  | "8D"
  | "9D"
  | "0D"
  | "JD"
  | "QD"
  | "KD"
  | "AC"
  | "2C"
  | "3C"
  | "4C"
  | "5C"
  | "6C"
  | "7C"
  | "8C"
  | "9C"
  | "0C"
  | "JC"
  | "QC"
  | "KC"
  | "AH"
  | "2H"
  | "3H"
  | "4H"
  | "5H"
  | "6H"
  | "7H"
  | "8H"
  | "9H"
  | "0H"
  | "JH"
  | "QH"
  | "KH";

export type JokerCode = "1X" | "2X";

export type Suit = "HEARTS" | "DIAMONDS" | "CLUBS" | "SPADES" | "JOKER";

export type Value = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "A" | "J" | "Q" | "K" | "X";

export type Card = {
  code: Code;
  suit: Suit;
  value: Value;
  valueLong: string;
};

export type AllCode = Code | JokerCode;
