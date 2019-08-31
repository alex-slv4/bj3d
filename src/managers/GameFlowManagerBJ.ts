import {GameFlowManager} from "./GameFlowManager";
import {Action} from "@core/actions/Action";
import {UpdateUIAction} from "@game/actions/UpdateUIAction";
import {inject} from "inversify";
import {HandsModel} from "@game/model/HandsModel";
import {BetUtilBJ} from "@game/utils/BetUtilBJ";
import {di} from "../inversify.config";
import {PlaceBetAction} from "@game/actions/PlaceBetAction";
import {DealAction} from "@game/actions/DealAction";

export class GameFlowManagerBJ extends GameFlowManager {

    // @inject(BetUtil)
    // private betUtil: BetUtilBJ;
    //
    // @inject(HandsModel)
    // private handsModel: HandsModel;

    @inject(BetUtilBJ)
    private betUtil: BetUtilBJ;

    @inject(HandsModel)
    private handsModel: HandsModel;

    @inject(UpdateUIAction)
    private updateUIAction: UpdateUIAction;

    @inject(PlaceBetAction)
    private placeBetAction: PlaceBetAction;

    getStartFlow(): Action[] {
        return super.getStartFlow().concat([
            this.updateUIAction
            // di.get(ShowMainSceneActionBJ),
            // di.get(LockUIAction),
            // di.get(ShowSoundPopupAction),
            // di.get(WelcomeAction),
            // di.get(RestoreGameActionBJ),
            // di.get(ShowSelectBetPopupAction),
            // di.get(StartFocusAction),
            // di.get(InitWrapperAction),
            // new PlaceYourBetsAction()
        ]);
    }

    anywhereClick() {
        this.log("anywhere click");
        // this.runFlow([
        //     di.get(LockUIAction).setParams(true),
        //     new HideWinningsAction(),
        //     di.get(ShowLastLimitsAction),
        //     new PlaceYourBetsAction(),
        //     di.get(LockUIAction).setParams(false)
        // ]);
    }
    bet(handId: string, bet: number, instantly: boolean = false) {
        this.log(`place ${bet}$ at hand ${handId}`);
        this.runFlow([
        //     di.get(LockUIAction).setParams(true),
        //     new HideWinningsAction(),
            this.placeBetAction.setParams(handId, bet, true, instantly),
        //     di.get(LockUIAction).setParams(false),
            this.updateUIAction
        ]);
    }

    doubleBet(instantly: boolean = false) {
        this.log(`double bet`);
        //
        // this.runFlow([
        //     di.get(LockUIAction).setParams(true),
        //     di.get(DoubleBetAction).setParams(true),
        //
        //     di.get(LockUIAction).setParams(false),
        //     this.updateUIAction
        // ]);
    }

    undo() {
        this.log("undo");
        // this.runFlow([
        //     di.get(LockUIAction).setParams(true),
        //     di.get(UndoActionBJ),
        //     di.get(LockUIAction).setParams(false),
        //     di.get(ShowLastLimitsAction),
        //     this.updateUIAction
        // ]);
    }

    rebet() {
        this.log("rebet");
        // this.runFlow([
        //     di.get(HideUIAction).setParams(false),
        //     new HideWinningsAction(),
        //     di.get(RebetAction),
        //     this.updateUIAction
        // ]);
    }
    rebetAndDeal() {
        this.log("rebetAndDeal");
        // this.runFlow([
        //     di.get(HideUIAction),
        //     new HideWinningsAction(),
        //     di.get(RebetAction),
        //     new LazyAction(() => this.deal())
        // ]);
    }
    doubleAndDeal() {
        this.log('doubleAndDeal');
        // this.runFlow([
        //     di.get(HideUIAction),
        //     new HideWinningsAction(),
        //     new RebetDoubleAction(),
        //     new LazyAction(() => this.deal())
        // ]);
    }

    clear() {
        this.log('clear');
        // this.runFlow([
        //     // di.get(HideUIAction),
        //     di.get(ClearAction),
        //     di.get(ShowLastLimitsAction),
        //     this.updateUIAction,
        //     //new PlaceYourBetsAction()
        // ]);
    }

    deal() {
        this.log("Deal");
        if (this.betUtil.canDeal(this.handsModel)) {
            this.runFlow([
                // di.get(HideUIAction),
                // // new FocusHandAction(null).setParams(true),
                di.get(DealAction),
                // di.get(DealAnimationAction),
                // di.get(CardsDealtAction),
                // di.get(ResultsAction)
            ]);
        } else {
            this.runFlow([
                this.updateUIAction
            ]);
        }
    }

    hit() {
        this.log("hit");
        // this.terminateCurrentFlow();
        // this.runFlow([
        //     di.get(HideUIAction),
        //     new FocusHandAction(null).setParams(true),
        //     di.get(HitAction),
        //     di.get(DealNewCardAnimation),
        //     di.get(ResultsAction)
        // ]);
    }

    stand() {
        this.log("stand");
        this.terminateCurrentFlow();
        // this.runFlow([
        //     di.get(HideUIAction),
        //     di.get(StandAction),
        //     di.get(ResultsAction)
        // ]);
    }

    double() {
        this.log("double");
        this.terminateCurrentFlow();
        // this.runFlow([
        //     di.get(HideUIAction),
        //     new FocusHandAction(null),
        //     di.get(DoubleAction),
        //     di.get(DealNewCardAnimation),
        //     di.get(ResultsAction)
        // ]);
    }

    split() {
        this.log("split");
        // this.terminateCurrentFlow();
        // this.runFlow([
        //     di.get(HideUIAction),
        //     new DisableHandAction(this.handsModel.activeHand),
        //     new FocusHandAction(null),
        //     di.get(SplitAction),
        //     new SplitAnimationAction(this.handsModel.activeHand.id),
        //     di.get(DealSplitCardsAnimation),
        //     di.get(GameEndAction)
        // ]);
    }

    insurance(agree: boolean, toAll: boolean) {
        this.log("insurance");
        // this.runFlow([
        //     di.get(HideUIAction),
        //     di.get(InsureDecideAction).setParams(agree, toAll),
        //     di.get(GameEndAction),
        //     this.updateUIAction
        // ]);
    }
}