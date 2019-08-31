/**
 * @author alexander.slavschik
 */
import {inject, injectable} from "inversify";
import {Action} from "@core/actions/Action";
import {StakeModel} from "@game/StakeModel";
import {HandsModel} from "@game/model/HandsModel";
import {BetModelBJ} from "@game/model/BetModelBJ";
import {BetUtilBJ} from "@game/utils/BetUtilBJ";
import {log_debug} from "@core/log";
import {ChipsManager} from "@game/chips/ChipsManager";
import {Table3D} from "@game/Table3D";

@injectable()
export class PlaceBetAction extends Action {

    @inject(StakeModel)
    private stakeModel: StakeModel;
    @inject(HandsModel)
    private handsModel: HandsModel;
    @inject(BetModelBJ)
    private betModel: BetModelBJ;

    @inject(BetUtilBJ)
    protected betUtil: BetUtilBJ;

    @inject(ChipsManager)
    private chipsManager: ChipsManager;

    @inject(Table3D)
    private tableView: Table3D;

    private handId: string;
    private amount: number;
    private checkBetValid: boolean;
    private instantly: boolean = false;

    // private contextModel: ContextModel = inject(ContextModel);
    // private stakePanel: StakePanelView = inject(StakePanelView);

    public setParams(handId: string, amount: number, checkBetValid: boolean = false, instantly: boolean = false): PlaceBetAction {
        this.handId = handId;
        this.amount = amount;
        this.checkBetValid = checkBetValid;
        this.instantly = instantly;
        return this;
    }

    public async execute() {
        // this.tableView.hideLastBets();
        log_debug("handId", this.handId);

        this.handsModel.bet(this.handId, this.amount);
        this.betModel.totalBet = this.handsModel.totalStake;

        // const handStack: ChipStackView = this.tableView.getChips(payload.handId);
        //
        // const betHistoryVO: BetHistoryVO = this.betModel.betsHistory.push(new BetHistoryVO(BetHistoryVO.TYPE_BET));
        // betHistoryVO.bets.push(payload.amount);
        // betHistoryVO.hands.push(payload.handId);
        //
        // this.dispatch(TableEvent.ENABLE_BETS_GLOW, false);
        // let promise: Promise<any> = Promise.resolve();
        // const hand: HandModelBJ = this.handsModel.getHand(payload.handId);
        // if (payload.instantly) {
        //     this.chipsManager.playLandingSound(handStack);
        //     handStack.push(payload.amount);
        //     promise = promise.then(() => {
        //         this.betUtil.checkStackValid(hand, handStack, payload.checkBetValid!);
        //         handStack.updateToolTip();
        //     });
        // } else {
        //     if (this.contextModel.context.api.device.isSimplifiedAnimation) {
        //         this.chipsManager.addAmountToStack(handStack, payload.amount);
        //         this.betUtil.checkStackValid(hand, handStack, payload.checkBetValid!);
        //     } else {
        //         const point: Point = this.stakePanel.getChipPosition(this.stakeModel.selectedStakeIndex);
        //         promise = this.chipsManager.flyAmountToStack(point, payload.amount, handStack).then(() => {
        //             this.betUtil.checkStackValid(hand, handStack, payload.checkBetValid!);
        //         });
        //     }
        // }
        //
        // await Promise.all([
        //     this.chipsManager.flyOutWinningStack(),
        //     promise
        // ]);

        this.resolve();
    }
}