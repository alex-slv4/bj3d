import {StakeModel} from "@game/StakeModel";
import {inject} from "inversify";

export class BetUtil {

    @inject(StakeModel)
    protected stakeModel: StakeModel;

    public isTooLow(value: number, showPopup: boolean = true): boolean {
        const result: boolean = value > 0 && value < this.stakeModel.stakeMin;
        if (result && showPopup) {
            // this.popupManager.showMinBet();
        }
        return result;
    }

    public isTooHigh(value: number, showPopup: boolean = true): boolean {
        if (value > this.stakeModel.stakeMax) {
            if (showPopup) {
                // this.popupManager.showMaxBet();
            }
            return true;
        }
        return false;
    }

    public isLowBalance(value: number, showPopup: boolean = true): boolean {

        // if (value > this.contextModel.context.api.getBalance()) {
        //     if (showPopup && !this.contextModel.context.api.isPopupOpened()) {
        //
        //         this.contextModel.context.api.showPopup({
        //             title: this.contentManager.i18n("POPUP_INSUFFICIENT_TITLE"),
        //             message: this.contentManager.i18n("POPUP_INSUFFICIENT_MESSAGE")
        //         });
        //
        //     }
        //     return true;
        // }
        return false;

    }

    public static fixFraction(value: number): number {
        return parseFloat(value.toFixed(10));
    }

}
