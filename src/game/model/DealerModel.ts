/**
 * @author alexander.slavschik
 */
import {BaseHandModelBJ} from "./BaseHandModelBJ";
import {BlackJackConstants} from "@game/constants";
import {CardRank, ICard} from "@game/model/ICard";

export class DealerModel extends BaseHandModelBJ {

    private _cardsShown: number = 0;
    private _dealerRank: number = 0;

    constructor() {
        super();
        this.dealer = true;
        this.playing = true;
    }

    get cardsShown(): number {
        return this._cardsShown;
    }

    set cardsShown(value: number) {
        this._cardsShown = value;
        const cards: ICard[] = this._cardList.concat().splice(0, this._cardsShown);
        this._dealerRank = this.getHardRank(cards);
    }

    gotCharlie(): boolean {
        return false; // no CHARLIE for dealer
    }

    gotBust() {
        return this._dealerRank > BlackJackConstants.MAX_RANK;
    }
    getRank(): string {
        return this._dealerRank.toString();
    }
    get dealerRank(): number {
        return this._dealerRank;
    }

    isBlackjackProbable(): boolean {
        if (this.cardsShown <= 1) {
            const [firstCard] = this._cardList;
            return this.getCardRankNumber(firstCard.rank) === 10 || (firstCard.rank === CardRank.ACE);
        } else {
            return this.gotBlackjack();
        }
    }

    clear(): any {
        this._cardsShown = 0;
        return super.clear();
    }
}