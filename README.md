# cards.ts

[![npm version](https://img.shields.io/npm/v/cards.ts.svg)](https://www.npmjs.com/package/cards.ts) [![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue.svg)](https://www.typescriptlang.org/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, type-safe TypeScript library for simulating a standard deck of playing cards. Create, shuffle, and draw from decks with optional jokers support. Perfect for card games, simulations, or educational projects.

## Features

- **Standard Deck Support**: Full 52-card deck (Hearts, Diamonds, Clubs, Spades) with values from Ace to King.
- **Joker Integration**: Optionally include 2 jokers (coded as "1X" and "2X").
- **Custom Decks**: Initialize with a subset of valid cards.
- **Shuffling**: Randomize the entire deck or just remaining cards with customizable randomness.
- **Drawing Modes**: Draw from the top, bottom, or randomly, with support for multiple cards.
- **Deck Info & Listing**: Track creation time, remaining cards, and list cards in a human-readable format.
- **Return cards to deck** : return drawn cards to the deck.
- **Type Safety**: Fully typed with TypeScript, including union types for card codes and detailed card objects.
- **Zero Dependencies**: Lightweight and pure TypeScript—no external libraries required.

## Installation

Install via npm:

```bash
npm install cards.ts
```

Or yarn:

```bash
yarn add cards.ts
```

For development (if cloning the repo):

```bash
npm install
npm run dev
```

## Quick Start

Import the `Deck` class and create a new deck:

```typescript
import Deck from "cards.ts";

const deck = new Deck(); // Standard 52-card deck, no jokers

// Shuffle the deck
deck.shuffle();

// Draw a card from the top
const drawn = deck.drawCard({ count: 1, mode: "top" });
console.log(drawn.cards[0]); // { code: 'AS', suit: 'SPADES', value: 'A', valueLong: 'ACE' }
```

## Usage Examples

### Creating a Deck

Decks can be created with defaults or custom options:

```typescript
import Deck, { type DeckInput } from "cards.ts";

// Standard deck (52 cards, no jokers)
const standardDeck = new Deck();

// With jokers (54 cards)
const jokerDeck = new Deck({ jokerEnable: true });

// Custom deck (e.g., only Hearts and Spades)
const customDeck = new Deck({
  cards: ["AH", "2H", "KH", "AS", "KS"], // Valid card codes only
  shuffled: true, // Start shuffled
});

// Invalid cards will throw an error during validation
// new Deck({ cards: ['INVALID'] }); // Error: Your Cards Are Not Valid
```

### Shuffling

Shuffle the entire deck or just the remaining cards:

```typescript
import { type ShuffleInput } from 'cards.ts';

const deck = new Deck();

// Shuffle everything with default randomness (0.5)
deck.shuffle();

// Shuffle only remaining cards with higher randomness (closer to 1.0 for more uniform distribution)
deck.shuffle({ justRemaining: true, randomChance: 0.8 });

// Returns:
{
  status: 'success',
  cards: [ /* Array of Card objects */ ],
  remaining: 52,
  shuffled: true
}
```

### Drawing Cards

Draw one or more cards in different modes:

```typescript
const deck = new Deck({ shuffled: true });

// Draw 1 card randomly
const randomDraw = deck.drawCard({ count: 1, mode: "random" });

// Draw 3 cards from the top
const topDraw = deck.drawCard({ count: 3, mode: "top" });

// Draw 2 cards from the bottom
const bottomDraw = deck.drawCard({ count: 2, mode: "bottom" });

// Invalid mode or count > remaining returns an error
const errorDraw = deck.drawCard({ count: 100, mode: "invalid" });
// {
//   status: 'error',
//   message: 'pick correct mode , valid choices would be `random` or `top` or `bottom`',
//   cards: []
// }
```

### Listing Cards

View all cards or just the remaining ones:

```typescript
// List all original cards
const allCards = deck.listCards(); // Array of Card objects

// List only remaining cards
const remainingCards = deck.listCards(true);

// Each Card object: { code: 'AS', suit: 'SPADES', value: 'A', valueLong: 'ACE' }
```

### Deck Information

Get metadata about the deck:

```typescript
const info = deck.info();

// Returns:
{
  createdAt: '2025-09-19T12:00:00.000Z', // ISO string
  remaining: 50, // After drawing 2 cards
  drawnCards: 2
}
```

### Return Cards

return drawn cards to the deck

```typescript
const cards = deck.returnCard({cards : ["AD" , "2H"]});


// Returns:
{
  status: "success",
  remaining: 34, // After returning cards
  shuffled : false,
  cards : []
}

const cards = deck.returnCard({cards : ["AD" , "XX" ]});
// {
//   status: 'error',
//   message: 'You cannot return these cards to the deck because they have not yet  been drawn or were not in the initial deck.',
//   cards: []
// }
```

## API Reference

### `Deck` Class

#### Constructor: `new Deck(input?: DeckInput)`

- **Parameters**:

  - `input.jokerEnable?`: `boolean` — Include 2 jokers (default: `false`).
  - `input.cards?`: `Code[]` — Custom array of valid card codes (overrides standard deck).
  - `input.shuffled?`: `boolean` — Start with shuffled cards (default: `false`).

- **Throws**: `Error` if custom cards are invalid.

#### `info(): DeckInfo`

Returns deck metadata:

- `createdAt`: `string` — ISO timestamp.
- `remaining`: `number` — Cards left to draw.
- `drawnCards`: `number` — Cards already drawn.

#### `listCards(justRemaining?: boolean): Card[]`

- **Parameters**:

  - `justRemaining?`: `boolean` — List only undrawn cards (default: `false`).

- **Returns**: `Card[]` — Array of card objects.

#### `shuffle(input?: ShuffleInput): ListCardReturn`

- **Parameters**:

  - `input.justRemaining?`: `boolean` — Shuffle only remaining cards (default: `false`).
  - `input.randomChance?`: `number` — Randomness factor (0-1, default: `0.5`).

- **Returns**: `ListCardReturn` — Success with shuffled cards or error.

#### `drawCard(input?: DrawInput): ListCardReturn`

- **Parameters**:

  - `input.count`: `number` — Number of cards to draw (default: `1`).
  - `input.mode?`: `'random' | 'top' | 'bottom'` (default: `'random'`).

- **Returns**: `ListCardReturn` — Success with drawn cards (removes from deck) or error.

#### `returnCard(input?: ReturnInput): ListCardReturn`

- **Parameters**:

  - `input.cards`: `Code[]` — cards you wants to return to the deck.

- **Returns**: `ListCardReturn` — Success or error with proper messages.

### Types

- **Card**: `{ code: Code | JokerCode; suit: Suit; value: Value; valueLong: string }`
- **Code**: Union of all 52 standard card codes (e.g., `'AS'`, `'KH'`).
- **JokerCode**: `'1X' | '2X'`.
- **Suit**: `'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES' | 'JOKER'`.
- **Value**: `'1' | '2' | ... | '10' | 'A' | 'J' | 'Q' | 'K' | 'X'`.
- **ListCardReturn**: Success `{ status: 'success'; cards: Card[]; remaining: number; shuffled?: boolean }` or Error `{ status: 'error'; message: string; cards: [] }`.

For full types, see `types/index.type.ts`.

## Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Report issues or suggest improvements [here](https://github.com/moeinmac/cards.ts/issues).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

_Built with ❤️ for card game enthusiasts. Questions? Open an issue!_
