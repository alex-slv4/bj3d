/**
 * @author alexander.slavschik
 */
import {HandModelBJ} from "./HandModelBJ";
import {injectable} from "inversify";

function arrayClear(arr: any[]): void {
    arr.splice(0, arr.length);
}

function arrayReplace(arr1: any[], arr2: any[]): void {
    arr1.splice.apply(arr1, [0, arr1.length].concat(arr2));
}

@injectable()
export class HandsModel {

    // @ts-ignore
    insuranceForAll: boolean = undefined; // !has to be explicitly set to undefined
    insuranceRequired: boolean = false;

    readonly hands: HandModelBJ[] = [];
    private handsDict: { [id: string]: HandModelBJ } = {};
    private ActiveHand: HandModelBJ;

    // private _previousResult: IServerResponseVO;
    // parseResponse(response: IServerResponseVO): void {
    //
    //     if (response.msg && response.msg === "Insufficient balance") {
    //         return;
    //     }
    //
    //     this.writeData(response);
    //
    //     if (response.previousResult) {
    //         this._previousResult = response.previousResult;
    //         if (!response.previousResult.roundEnded) {
    //             this.writeData(this._previousResult);
    //
    //             if (this.ActiveHand) {
    //                 this.insuranceRequired = this.ActiveHand.hasInsuranceAction;
    //                 if (this.activeHand !== this.hands[0]) {
    //                     this.insuranceForAll = false;
    //                 }
    //             }
    //         }
    //     } else {
    //         this._previousResult = null;
    //     }
    // }

    // writeData(data: IServerResponseVO): void {
    //     if (data.hands) {
    //         data.hands.forEach((hand: any) => {
    //
    //             let handModel: HandModelBJ = this.getHand(hand.id);
    //             if (!handModel) {
    //                 handModel = new HandModelBJ(hand.id);
    //             }
    //             this.handsDict[handModel.id] = handModel;
    //             handModel.parseResponse(hand);
    //         });
    //     }
    //
    //     this.resetHandsArray();
    //
    //     this.ActiveHand = this.getHand(data.activeHand);
    //     if (this.ActiveHand) {
    //         this.insuranceRequired = this.ActiveHand.hasInsuranceAction;
    //     } else {
    //         this.insuranceRequired = false;
    //     }
    // }

    get totalInsuranceWin(): number {
        let totalInsuranceWin: number  = 0;
        this.hands.forEach((hand: HandModelBJ) => totalInsuranceWin += (hand.insuranceWin - hand.insuranceBet));
        return totalInsuranceWin;
    }
    get totalInsuranceBet(): number {
        let totalInsuranceBet: number  = 0;
        this.hands.forEach((hand: HandModelBJ) => totalInsuranceBet += hand.insuranceBet);
        return totalInsuranceBet;
    }
    get totalStake(): number {
        let totalStake: number = 0;
        this.getAllHands().forEach((hand: HandModelBJ) => totalStake += (hand.stake + hand.doubleBet));
        return totalStake;
    }

    get hasLastBets(): boolean {
        let hasLastBets: boolean = false;
        this.getAllHands().forEach((hand: HandModelBJ) => {
            if (hand.lastBet > 0) {
                hasLastBets = true;
            }
        });
        return hasLastBets;
    }

    get activeHand(): HandModelBJ {
        return this.ActiveHand;
    }

    bet(handId: string, amount: number): void {
        let handModel: HandModelBJ = this.getHand(handId);
        if (!handModel) {
            handModel = new HandModelBJ(handId);
            this.handsDict[handId] = handModel;
        }
        handModel.stake += amount;
        this.resetHandsArray();
    }

    split(handId: string): void {
        const handModel: HandModelBJ = this.getHand(handId);
        handModel.split();
        this.handsDict[handModel.splittedInto.id] = handModel.splittedInto;
        this.resetHandsArray();
    }

    unSplit(handId: string): void {
        const handModel: HandModelBJ = this.getHand(handId);
        delete this.handsDict[handModel.splittedInto.id];
        handModel.unSplit();
        this.resetHandsArray();
    }

    get hasPlayingHands(): boolean {
        for (const hand of this.hands) {
            if (hand.playing) {
                return true;
            }
        }
        return false;
    }

    clear() {
        delete this.ActiveHand;
        this.hands.forEach((hand: HandModelBJ) => hand.clear());
        arrayClear(this.hands);
        delete this.insuranceForAll; // !has to be explicitly set to undefined
    }

    clearHand(handId: string) {
        const hand: HandModelBJ = this.getHand(handId);
        if (hand) {
            hand.clear();
        }
    }

    forEachPlayingHand(callBack: Function): void {
        this.hands.forEach((hand: HandModelBJ) => {
            if (hand.playing) {
                callBack.call(this, hand);
            }
        });
    }

    hasStake(handId: string): boolean {
        let result = false;
        this.hands.forEach((hand: HandModelBJ) => {
            if (hand.stake > 0 && hand.id === handId ) {
              result = true;
            }
        });
        return result;
    }

    getAllHands(): HandModelBJ[] {
        const allHands: HandModelBJ[] = [];
        Object.keys(this.handsDict).forEach(id => {
            if (this.handsDict[id]) {
                allHands.push(this.handsDict[id]);
            }
        });
        return allHands;
    }
    getHand(handId: string): HandModelBJ {
        return this.handsDict[handId];
    }
    getLastPlayingHand(): HandModelBJ {
        // assuming that hands are sorted by index
        const playingHands: HandModelBJ[] = this.hands.filter((hand: HandModelBJ) => hand.playing);
        return playingHands[playingHands.length - 1];
    }

    private resetHandsArray() {

        arrayReplace(this.hands, this.getAllHands());

        this.hands.sort((hand1: HandModelBJ, hand2: HandModelBJ) => {
            let diff: number = hand1.index - hand2.index;
            if (diff === 0) {
                diff = hand1.isSplitted ? 1 : -1;
            }
            return diff;
        });
    }

}