import {BetUtil} from "@game/utils/BetUtil";
import {inject} from "inversify";
import {HandsModel} from "@game/model/HandsModel";
import {HandModelBJ} from "@game/model/HandModelBJ";
import {ChipStackNode} from "@game/chips/ChipStackNode";

export class BetUtilBJ extends BetUtil {

    @inject(HandsModel)
    private handsModel: HandsModel;

    private checkBetLimits(value: number, add: number, showPopup: boolean = true): boolean {
        const currentStakeSum: number = this.handsModel.totalStake;
        if (this.isLowBalance(currentStakeSum + add, showPopup)) {
            return false;
        } else if (this.isTooHigh(value + add, showPopup)) {
            return false;
        }
        return true;
    }

    public checkStackValid(handModel: HandModelBJ, handStack: ChipStackNode, checkBetValid: boolean): void {
        // if (checkBetValid) {
        //     handStack.tint = !this.isValidHand(handModel);
        // } else {
        //     handStack.tint = false;
        // }
    }

    isValidHand(handModel: HandModelBJ, showPopup: boolean = true): boolean {
        const value: number = handModel.stake;
        if (this.isTooLow(value, false)) {
            return false;
        } else {
            return this.checkBetLimits(value, 0, true);
        }
    }

    isValidAdd(handModel: HandModelBJ, add: number, showPopup: boolean = true): boolean {
        let currentStake: number = 0;
        if (handModel) {
            currentStake = handModel.stake;
        }
        return this.checkBetLimits(currentStake, add, showPopup);
    }

    canDoubleBet(handsModel: HandsModel): boolean {
        let canDouble: boolean = true;
        handsModel.getAllHands().forEach((hand: HandModelBJ) => {
            canDouble = canDouble && this.isValidAdd(hand, hand.stake, true);
        });
        return canDouble;
    }

    canDoubleAndDeal(handsModel: HandsModel): boolean {
        let canDouble: boolean = true;
        handsModel.getAllHands().forEach((hand: HandModelBJ) => {
            canDouble = canDouble && this.checkBetLimits(0, hand.lastBet * 2, true);
        });
        return canDouble && this.canDeal(handsModel);
    }

    canRebet(handsModel: HandsModel): boolean {
        let canRebet: boolean = true;
        handsModel.forEachPlayingHand((hand: HandModelBJ) => {
            if (canRebet) {
                canRebet = canRebet && this.isValidHand(hand, true);
            }
        });
        return canRebet;
    }

    canDeal(handsModel: HandsModel): boolean {
        let canDeal: boolean = true;
        handsModel.hands.forEach((hand: HandModelBJ) => {
            if (canDeal && hand.stake > 0) {
                canDeal = canDeal && this.checkBetLimits(hand.stake, 0);
                canDeal = canDeal && !this.isTooLow(hand.stake);
            }
        });
        return canDeal;
    }

}