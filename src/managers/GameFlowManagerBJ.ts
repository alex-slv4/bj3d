import {inject} from "inversify";
import {GameFlowManager} from "./GameFlowManager";

export class GameFlowManagerBJ extends GameFlowManager {

    @inject(BetUtil)
    private betUtil: BetUtilBJ;

    @inject(HandsModel)
    private handsModel: HandsModel;

    getStartFlow(): Action[] {
        // return super.getStartFlow().concat([
        //     new PlaceYourBetsAction()
        //     ]);
        return [
            inject(GameStartAction),
            inject(ShowMainSceneActionBJ),
            inject(LockUIAction),
            inject(ShowSoundPopupAction),
            inject(WelcomeAction),
            inject(RestoreGameActionBJ),
            inject(ShowSelectBetPopupAction),
            inject(StartFocusAction),
            inject(InitWrapperAction),
            new PlaceYourBetsAction()
        ];
    }

    anywhereClick() {
        this.log("anywhere click");
        this.runFlow([
            inject(LockUIAction).setParams(true),
            new HideWinningsAction(),
            inject(ShowLastLimitsAction),
            new PlaceYourBetsAction(),
            inject(LockUIAction).setParams(false)
        ]);
    }
    bet(handId: string, bet: number, instantly: boolean = false) {
        this.log(`place ${bet}$ at hand ${handId}`);
        this.runFlow([
            inject(LockUIAction).setParams(true),
            new HideWinningsAction(),
            inject(PlaceBetAction).setParams(handId, bet, true, instantly),
            inject(LockUIAction).setParams(false),
            inject(UpdateUIAction)
        ]);
    }

    doubleBet(instantly: boolean = false) {
        this.log(`double bet`);

        this.runFlow([
            inject(LockUIAction).setParams(true),
            inject(DoubleBetAction).setParams(true),

            inject(LockUIAction).setParams(false),
            inject(UpdateUIAction)
        ]);
    }

    undo() {
        this.log("undo");
        this.runFlow([
            inject(LockUIAction).setParams(true),
            inject(UndoActionBJ),
            inject(LockUIAction).setParams(false),
            inject(ShowLastLimitsAction),
            inject(UpdateUIAction)
        ]);
    }

    rebet() {
        this.log("rebet");
        this.runFlow([
            inject(HideUIAction).setParams(false),
            new HideWinningsAction(),
            inject(RebetAction),
            inject(UpdateUIAction)
        ]);
    }
    rebetAndDeal() {
        this.log("rebet");
        this.runFlow([
            inject(HideUIAction),
            new HideWinningsAction(),
            inject(RebetAction),
            new LazyAction(() => this.deal())
        ]);
    }
    doubleAndDeal() {
        this.runFlow([
            inject(HideUIAction),
            new HideWinningsAction(),
            new RebetDoubleAction(),
            new LazyAction(() => this.deal())
        ]);
    }

    clear() {
        this.log('clear');
        this.runFlow([
            // inject(HideUIAction),
            inject(ClearAction),
            inject(ShowLastLimitsAction),
            inject(UpdateUIAction),
            //new PlaceYourBetsAction()
        ]);
    }

    deal() {
        if (this.betUtil.canDeal(this.handsModel)) {
            this.runFlow([
                inject(HideUIAction),
                // new FocusHandAction(null).setParams(true),
                inject(DealAction),
                inject(DealAnimationAction),
                inject(CardsDealtAction),
                inject(ResultsAction)
            ]);
        } else {
            this.runFlow([
                inject(UpdateUIAction)
            ]);
        }
    }

    hit() {
        this.log("hit");
        this.terminateCurrentFlow();
        this.runFlow([
            inject(HideUIAction),
            new FocusHandAction(null).setParams(true),
            inject(HitAction),
            inject(DealNewCardAnimation),
            inject(ResultsAction)
        ]);
    }

    stand() {
        this.log("stand");
        this.terminateCurrentFlow();
        this.runFlow([
            inject(HideUIAction),
            inject(StandAction),
            inject(ResultsAction)
        ]);
    }

    double() {
        this.log("double");
        this.terminateCurrentFlow();
        this.runFlow([
            inject(HideUIAction),
            new FocusHandAction(null),
            inject(DoubleAction),
            inject(DealNewCardAnimation),
            inject(ResultsAction)
        ]);
    }

    split() {
        this.log("split");
        this.terminateCurrentFlow();
        this.runFlow([
            inject(HideUIAction),
            new DisableHandAction(this.handsModel.activeHand),
            new FocusHandAction(null),
            inject(SplitAction),
            new SplitAnimationAction(this.handsModel.activeHand.id),
            inject(DealSplitCardsAnimation),
            inject(GameEndAction)
        ]);
    }

    insurance(agree: boolean, toAll: boolean) {
        this.log("insurance");
        this.runFlow([
            inject(HideUIAction),
            inject(InsureDecideAction).setParams(agree, toAll),
            inject(GameEndAction),
            inject(UpdateUIAction)
        ]);
    }
}