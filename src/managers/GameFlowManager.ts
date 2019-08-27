import {inject, injectable} from "inversify";
import {SequenceAction} from "@core/actions/SequenceAction";
import {di} from "../inversify.config";
import {Action} from "@core/actions/Action";
import {tagLog} from "@core/log";
import {GameStartAction} from "@game/actions/GameStartAction";
import {SetupSceneAction} from "@game/actions/SetupSceneAction";
import {SetupUIAction} from "@game/actions/SetupUIAction";

@injectable()
export class GameFlowManager {

    // @inject(SoundManager)
    // protected soundManager: SoundManager;

    // @inject(SettingsModel)
    // protected settingsModel: SettingsModel;

    @inject(SequenceAction)
    protected currentSequence: SequenceAction;

    startGame(): void {
        this.log("start game");
        this.runFlow(this.getStartFlow());
    }

    getStartFlow(): Action[] {
        return [
            di.get(SetupSceneAction),
            di.get(SetupUIAction),
            di.get(GameStartAction),
            // di.get(ShowMainSceneAction),
            // di.get(ShowSoundPopupAction),
            // di.get(WelcomeAction),
            // di.get(ShowSelectBetPopupAction),
            // di.get(InitWrapperAction)
        ];
    }

    terminateCurrentFlow() {
        this.currentSequence.terminate();
    }

    runFlow(actions: Action[]): void {
        this.currentSequence.run(actions);
    }

    protected log(...params: any) {
        tagLog("flow", "#195", params);
    }
}
