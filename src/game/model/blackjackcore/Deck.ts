import {CardRank, CardSuit, ICard} from "@game/model/ICard";

export class Deck {

    private primaryStack: ICard[] = [];
    private secondaryStack: ICard[] = [];

    constructor() {

        const ALL_CARDS: ICard[] = [];
        [
            CardRank.TWO, CardRank.THREE, CardRank.FOUR,
            CardRank.FIVE, CardRank.SIX, CardRank.SEVEN,
            CardRank.EIGHT, CardRank.NINE, CardRank.TEN,
            CardRank.JACK, CardRank.QUEEN, CardRank.KING,
            CardRank.ACE
        ].forEach(rank => {
            [CardSuit.CLUBS, CardSuit.DIAMONDS, CardSuit.HEARTS, CardSuit.SPADES].forEach(suit => {
                ALL_CARDS.push({rank, suit} as ICard)
            })
        });

        this.primaryStack = [];
        this.primaryStack.push(...ALL_CARDS);
        this.primaryStack.push(...ALL_CARDS);
        this.primaryStack.push(...ALL_CARDS);
        this.primaryStack.push(...ALL_CARDS);
        this.primaryStack = this.primaryStack.sort(() => 0.5 - Math.random());
    }
    pull(): ICard {
        let lastCard = this.primaryStack.pop();
        if (!lastCard) {
            throw new Error("No more cards");
        }
        return lastCard;
    }
    putOff(card: ICard) {
        this.secondaryStack.push(card);
    }
}