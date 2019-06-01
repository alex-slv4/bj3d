import {inject, injectable} from "inversify";
import GameCamera from "@game/GameCamera";
import {log_debug} from "../log";
import {di} from "../inversify.config";
import {ChipStackNode} from "@game/chips/ChipStackNode";
import Scene = BABYLON.Scene;
import HemisphericLight = BABYLON.HemisphericLight;
import Vector3 = BABYLON.Vector3;
import {StakeModel} from "@game/StakeModel";

let a = 0;

@injectable()
export class Main {

    @inject(Scene)
    private scene: Scene;

    @inject(GameCamera)
    private camera: GameCamera;

    start() {
        this.camera.create();
        const light = new BABYLON.HemisphericLight("HemisphericLight", new Vector3(-5, 20, -5), this.scene);
        light.intensity = 1;

        const light2 = new BABYLON.HemisphericLight("HemisphericLight", new Vector3(-5, -20, -5), this.scene);
        light2.intensity = 1;

        (window as any).v_main = this;

        const stack = di.get(ChipStackNode);
        const stake = di.get(StakeModel);
        stake.recastChips.forEach(c => {
            stack.push(c);
        });
        log_debug("onStageClick");
    }

}