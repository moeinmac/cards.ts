class Deck {
  private jokerEnable: boolean;
  private remaining: number;
  private createAt: string;
  constructor(jokerEnable?: boolean) {
    this.jokerEnable = jokerEnable ?? false;
    this.remaining = this.jokerEnable ? 53 : 52;
    this.createAt = new Date().toISOString();
  }
  info() {
    return {
      createdAt: this.createAt,
      remainingCards: this.remaining,
    };
  }
}

export default Deck;

const deck1 = new Deck();

console.log(deck1.info());
