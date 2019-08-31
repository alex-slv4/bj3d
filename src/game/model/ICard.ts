export const enum CardRank {
    TWO = "2",
    THREE = "3",
    FOUR = "4",
    FIVE = "5",
    SIX = "6",
    SEVEN = "7",
    EIGHT = "8",
    NINE = "9",
    TEN = "10",
    JACK = "J",
    QUEEN = "Q",
    KING = "K",
    ACE = "A"
}

export const enum CardSuit {
    CLUBS = "C",
    DIAMONDS = "D",
    HEARTS = "H",
    SPADES = "S"
}

export interface ICard {
    rank: CardRank,
    suit: CardSuit,
    toString(): string;
}
