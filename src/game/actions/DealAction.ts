/**
 * @author alexander.slavschik
 */

import {Action} from "@core/actions/Action";
import {inject, injectable} from "inversify";
import {HandsModel} from "@game/model/HandsModel";
import {DealerModel} from "@game/model/DealerModel";
import {BetModelBJ} from "@game/model/BetModelBJ";
import {GameModel} from "@game/model/GameModelBJ";
import {BlackjackCore} from "@game/model/blackjackcore/BlackjackCore";
import {CoreTypes} from "../../CoreTypes";
import {Table3D} from "@game/Table3D";
import {di} from "../../inversify.config";
import {Card3D} from "@game/cards/Card3D";

@injectable()
export class DealAction extends Action {

    @inject(CoreTypes.coreGame)
    private coreGame: BlackjackCore;

    @inject(HandsModel)
    protected handsModel: HandsModel;
    @inject(DealerModel)
    protected dealerHand: DealerModel;
    @inject(BetModelBJ)
    protected betModel: BetModelBJ;

    @inject(Table3D)
    private table: Table3D;

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


        const DEAL_COUNT: number = 2;

        for (let i: number = 0; i < DEAL_COUNT; i++) {
            let cardModel = this.coreGame.deck.pull();
            let theCard = di.get(Card3D).init(cardModel);
            this.table.dealerCardsNode.addCard(theCard);

            let cardModel2 = this.coreGame.deck.pull();
            let theCard2 = di.get(Card3D).init(cardModel2);
            this.table.handCardsNode.addCard(theCard2);
        }

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