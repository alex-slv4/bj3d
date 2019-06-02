import {inject, injectable} from "inversify";
import GameCamera from "@game/GameCamera";
import {ChipStackNode} from "@game/chips/ChipStackNode";
import Scene = BABYLON.Scene;
import HemisphericLight = BABYLON.HemisphericLight;
import Vector3 = BABYLON.Vector3;
import {StakeModel} from "@game/StakeModel";
import {ChipsManager} from "@game/chips/ChipsManager";

@injectable()
export class Main {

    @inject(Scene)
    private scene: Scene;

    @inject(GameCamera)
    private camera: GameCamera;

    @inject(ChipStackNode)
    private chipStack: ChipStackNode;

    @inject(ChipsManager)
    private chipsManager: ChipsManager;

    @inject(StakeModel)
    private stakeModel: StakeModel;

    start() {
        this.camera.create();
        const light = new BABYLON.HemisphericLight("HemisphericLight", new Vector3(-5, 20, -5), this.scene);
        light.intensity = 1;

        const light2 = new BABYLON.HemisphericLight("HemisphericLight", new Vector3(-5, -20, -5), this.scene);
        light2.intensity = 1;

        (window as any).v_main = this;

        this.chipStack = this.chipsManager.newStack(5.33);

        window.document.addEventListener("click", this.onStageClick.bind(this));
    }
    private onStageClick() {
        this.chipStack.push(this.stakeModel.recastChips[0]);
        if (this.chipStack.size > 10) {
            this.chipsManager.recast(this.chipStack);
        }
    }

}