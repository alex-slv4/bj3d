/**
 * @author alexander.slavschik
 */
import {BlackJackConstants} from "@game/constants";
import {HandModel} from "@game/model/HandModel";
import {CardRank, ICard} from "@game/model/ICard";
import {injectable} from "inversify";

@injectable()
export class BaseHandModelBJ extends HandModel {

    rank: number;
    minRank: number;
    newCards: ICard[] = [];
    dealer: boolean = false;
    playing: boolean = false;
    standed: boolean = false;

    // parseResponse(hand: any): void {
    //     const cardListLength: number = this._cardList.length;
    //     super.parseResponse(hand);
    //     this.newCards = this.cardList.splice(cardListLength);
    //     this.rank = hand.rank ? hand.rank : 0;
    //     this.minRank = hand.minRank;
    // }
    gotSpecialCombination(): boolean {
        return this.gotBlackjack() || this.gotCharlie();
    }
    gotBlackjack(): boolean {
        return this.rank === BlackJackConstants.MAX_RANK && this._cardList.length === 2;
    }
    gotCharlie() {
        return this.rank <= BlackJackConstants.MAX_RANK && this._cardList.length >= BlackJackConstants.CHARLIE_CARDS_COUNT;
    }
    gotBust() {
        return this.rank > BlackJackConstants.MAX_RANK;
    }

    getCardRankNumber(rank: CardRank, soft?: boolean): number {
        switch (rank) {
            case CardRank.TWO: return 2;
            case CardRank.THREE: return 3;
            case CardRank.FOUR: return 4;
            case CardRank.FIVE: return 5;
            case CardRank.SIX: return 6;
            case CardRank.SEVEN: return 7;
            case CardRank.EIGHT: return 8;
            case CardRank.NINE: return 9;
            case CardRank.TEN:
            case CardRank.JACK:
            case CardRank.QUEEN:
            case CardRank.KING: return 10;
            case CardRank.ACE: return soft ? 1 : 11;
        }
        return 0;
    }
    getRank(): string {
        if (!isNaN(this.minRank)) {
            if (this.rank < BlackJackConstants.MAX_RANK && this.rank !== this.minRank) {
                return `${this.minRank}/${this.rank}`;
            }
        }
        return this.rank.toString();
    }

    getHardRank(cards: ICard[]): number {
        let rank: number = 0;
        cards.forEach((card: ICard) => {
            rank += this.getCardRankNumber(card.rank);
        });
        if (rank > BlackJackConstants.MAX_RANK) {
            for (const card of cards) {
                if (card.rank === CardRank.ACE) {
                    rank -= 10;
                    if (rank <= BlackJackConstants.MAX_RANK) {
                        break;
                    }
                }
            }
        }
        return rank;
    }

    clear() {
        this.standed = false;
        this.playing = false;
    }
}