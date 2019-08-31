/**
 * @author alexander.slavschik
 */

import {Action} from "@core/actions/Action";
import {inject, injectable} from "inversify";
import {HandsModel} from "@game/model/HandsModel";
import {DealerModel} from "@game/model/DealerModel";
import {BetModelBJ} from "@game/model/BetModelBJ";
import {GameModel} from "@game/model/GameModelBJ";

@injectable()
export class DealAction extends Action {

    @inject(HandsModel)
    protected handsModel: HandsModel;
    @inject(DealerModel)
    protected dealerHand: DealerModel;
    @inject(BetModelBJ)
    protected betModel: BetModelBJ;

    // @inject(TableView)
    // private tableView: TableView;
    // @inject(ChipsManagerBJ)
    // private chipsManager: ChipsManagerBJ;
    @inject(GameModel)
    private gameModel: GameModel;

    private amount: number = 0;

    public async execute() {
        // this.dispatch(TableEvent.CANCEL_AUTORECAST);
        // this.dispatch(InfolineEvent.SHOW_MESSAGE, InfoLineMessage.GOOD_LUCK);
        this.gameModel.startRound();
        this.amount = this.betModel.totalBet;
        this.updateValues(this.amount);
        this.resolve();
    }

    // protected performRequest(): Promise<any> {
    //     const bets: IBet[] = [];
    //     this.handsModel.hands.forEach((hand: HandModelBJ) => {
    //         if (hand.stake > 0) {
    //             bets.push({id: hand.id, amount: hand.stake});
    //             hand.playing = true;
    //         }
    //         hand.lastBet = hand.stake;
    //     });
    //
    //     return this.serverServiceBJ.deal(bets);
    // }

    // protected syncBalanceAfterRequest(): Promise<any> {
    //     // skip update (bj payouts case)
    //     return Promise.resolve();
    // }
    //
    // protected updateUIAction(): Promise<any> {
    //     this.gameModel.endRound();
    //     this.updateValues(-this.amount);
    //     return super.updateUIAction();
    // }
    //
    // protected postActionAnimations(): Promise<any> {
    //     if (this.isTerminated) {
    //         return Promise.resolve();
    //     }
    //     return Promise.all([this.flyOutBorderStack(), this.chipsManager.recastAll()]);
    // }
    //
    // protected flyOutBorderStack(): Promise<any> {
    //     return this.chipsManager.flyOutStack(this.tableView.borderStack, this.chipsManager.scenePosition.bottomRight);
    // }

    private updateValues(value: number) {
        this.betModel.roundBalance -= value;
    }
}