/**
 * @author alexander.slavschik
 */
import {Action} from "@core/actions/Action";
import {inject, injectable} from "inversify";
import {ActionButtonState} from "../../ui/constants";
import {HandsModel} from "@game/model/HandsModel";
import {BetModelBJ} from "@game/model/BetModelBJ";
import {UserHandActions} from "@game/model/HandModelBJ";
import {UILayer} from "../../ui/UILayer";
import {GameModel} from "@game/model/GameModelBJ";

@injectable()
export class UpdateUIAction extends Action {

    @inject(GameModel)
    protected gameModel: GameModel;
    @inject(HandsModel)
    protected handsModel: HandsModel;

    @inject(BetModelBJ)
    private betModel: BetModelBJ;

    private uiLayer: UILayer;

    public async execute() {
        let mask: number = ActionButtonState.NONE;
        // this.dispatch(SideMenuEvent.ENABLE);
        if (this.gameModel.roundEnded) {
            if (this.handsModel.totalStake > 0) {
                mask = ActionButtonState.DEAL | ActionButtonState.CLEAR | ActionButtonState.DOUBLE;
                // this.dispatch(TableEvent.ENABLE_BETS_GLOW, false);
            } else {
                if (this.handsModel.hasLastBets) {
                    mask |= ActionButtonState.REBET_GROUP;
                }
                // this.dispatch(TableEvent.ENABLE_BETS_GLOW, true);
            }

            if (this.betModel.betsHistory.enabled) {
                mask |= ActionButtonState.UNDO;
            }
            // this.dispatch(TableEvent.ENABLE_BETS, true);
            // this.dispatch(StakeChipEvent.SHOW);

        } else {
            // this.dispatch(TableEvent.ENABLE_BETS, false);
            if (this.handsModel.insuranceRequired) {
                mask = this.getMaskForInsurance();
            } else {
                this.handsModel.activeHand.actions.forEach((action: UserHandActions) => {
                    switch (action) {
                        case UserHandActions.HIT:
                            mask |= ActionButtonState.HIT;
                            break;
                        case UserHandActions.STAND:
                            mask |= ActionButtonState.STAND;
                            break;
                        case UserHandActions.DOUBLE:
                            mask |= ActionButtonState.DOUBLE;
                            break;
                        case UserHandActions.SPLIT:
                            mask |= ActionButtonState.SPLIT;
                            break;
                    }
                });
            }
        }
        this.uiLayer.applyState(mask);
        this.resolve();
    }

    private getMaskForInsurance(): number {
        // TODO: check for max hands property (backend configured)

        const isLastHand: boolean = (this.handsModel.activeHand === this.handsModel.getLastPlayingHand());
        if (isLastHand || this.handsModel.insuranceForAll === false) {
            return ActionButtonState.YES_NO_GROUP;
        }
        return ActionButtonState.YES_NO_ALL_GROUP | ActionButtonState.YES_NO_GROUP;
    }
}