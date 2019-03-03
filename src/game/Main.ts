import {inject, injectable} from "inversify";
import GameCamera from "@game/GameCamera";
import ChipsPool from "@game/ChipsPool";
import Scene = BABYLON.Scene;
import HemisphericLight = BABYLON.HemisphericLight;
import Vector3 = BABYLON.Vector3;
import Color3 = BABYLON.Color3;

@injectable()
export class Main {

    @inject(Scene)
    private scene: Scene;

    @inject(GameCamera)
    private camera: GameCamera;

    @inject(ChipsPool)
    private chips: ChipsPool;

    start() {
        this.camera.create();
        const light = new BABYLON.HemisphericLight("HemisphericLight", new Vector3(-5, 20, -5), this.scene);
        light.intensity = 1;

        const light2 = new BABYLON.HemisphericLight("HemisphericLight", new Vector3(-5, -20, -5), this.scene);
        light2.intensity = 1;

        this.chips.get(Color3.Random());
    }

}