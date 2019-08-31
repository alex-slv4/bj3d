/**
 * @author alexander.slavschik
 */
import {BaseHandModelBJ} from "./BaseHandModelBJ";
import {ICard} from "@game/model/ICard";
import {BetUtil} from "@game/utils/BetUtil";

export enum UserHandActions {
    HIT = "hit",
    STAND = "stand",
    DOUBLE = "double",
    SPLIT = "split",
    INSURANCE = "insurance"
}
export enum HandPlayState {
    DONE = "DONE",
    STAKED = "STAKED"
}

export enum BetResult {
    WIN = 'WIN',
    LOOSE = 'LOSE',
    PUSH = 'PUSH'
}

export class HandModelBJ extends BaseHandModelBJ {

    private _stake: number = 0;
    lastBet: number = 0;
    stakeWin: number;
    doubleBet: number = 0;
    doubleWin: number = 0;
    insuranceBet: number = 0;
    insuranceWin: number = 0;
    stakeBetResult: BetResult;
    doubleBetResult: BetResult;
    playState: HandPlayState;
    actions: UserHandActions[];
    insured: boolean = false;
    payed: boolean = false;

    private _splittedInto: HandModelBJ;

    constructor(id: string) {
        super();
        this._id = id;
    }

    // parseResponse(hand: any): void {
    //     this.actions = [];
    //     if (hand.actions) {
    //         this.actions = hand.actions;
    //     }
    //     this.stake = hand.stake;
    //     this.stakeWin = hand.stakeWin;
    //     this.doubleBet = hand.doubleBet || 0;
    //     this.doubleWin = hand.doubleWin || 0;
    //     this.insuranceBet = hand.insuranceBet || 0;
    //     this.insuranceWin = hand.insuranceWin || 0;
    //     this.stakeBetResult = hand.stakeBetResult;
    //     this.doubleBetResult = hand.doubleBetResult;
    //     this.playState = hand.playState;
    //     super.parseResponse(hand);
    // }

    split(): void {
        const currentCards: ICard[]  = this._cardList.concat([]);
        this._splittedInto = new HandModelBJ(this._id + "s");
        if (currentCards.length === 2) {
            this._cardList = [currentCards[0]];
            this._splittedInto._cardList = [currentCards[1]];
        }
        this._splittedInto.playing = this.playing;
    }

    unSplit(): void {
        if (this._splittedInto) {
            this._cardList = this._cardList.concat(this._splittedInto._cardList);
            delete this._splittedInto;
        }
    }

    gotBlackjack(): boolean {
        const splitOrSplitted: boolean = this.isSplitted || HandModelBJ.isSplitId(this._id);
        return super.gotBlackjack() && !splitOrSplitted;
    }

    get index(): number {
        return parseInt(HandModelBJ.getBareId(this._id), 10);
    }
    get isSplitted(): boolean {
        return !!this._splittedInto;
    }
    get splittedInto(): HandModelBJ {
        return this._splittedInto;
    }

    set splittedInto(splitHandModel: HandModelBJ) {
        this._splittedInto = splitHandModel;
    }

    get stake(): number {
        return this._stake;
    }

    set stake(value: number) {
        this._stake = BetUtil.fixFraction(value);
    }

    static isSplitId(id: string): boolean {
        return HandModelBJ.getBareId(id) !== id;
    }
    static getBareId(id: string): string {
        const match = id.match(/([0-9]+)s/);
        if (match) {
            return match[1];
        }
        return id;
    }
    get hasInsuranceAction(): boolean {
        return this.actions.indexOf(UserHandActions.INSURANCE) !== -1;
    }
    getTotalWin(): number {
        return this.stakeWin + this.doubleWin + this.insuranceWin;
    }

    clear() {
        super.clear();
        this.payed = false;
        this.insured = false;
        this._cardList = [];
        this.stake = this.stakeWin = this.doubleBet = this.doubleWin = this.insuranceBet = this.insuranceWin = 0;
        delete this._splittedInto;
    }
}