import {inject, injectable} from "inversify";
import GameCamera from "@game/GameCamera";
import ChipsMeshPool from "@game/chips/ChipsMeshPool";
import Scene = BABYLON.Scene;
import HemisphericLight = BABYLON.HemisphericLight;
import Vector3 = BABYLON.Vector3;
import Color3 = BABYLON.Color3;
import Axis = BABYLON.Axis;
import Space = BABYLON.Space;
import {log_debug} from "../log";
import {di} from "../inversify.config";
import {ChipStackNode} from "@game/chips/ChipStackNode";

let a = 0;

@injectable()
export class Main {

    @inject(Scene)
    private scene: Scene;

    @inject(GameCamera)
    private camera: GameCamera;

    @inject(ChipsMeshPool)
    private chips: ChipsMeshPool;

    start() {
        this.camera.create();
        const light = new BABYLON.HemisphericLight("HemisphericLight", new Vector3(-5, 20, -5), this.scene);
        light.intensity = 1;

        const light2 = new BABYLON.HemisphericLight("HemisphericLight", new Vector3(-5, -20, -5), this.scene);
        light2.intensity = 1;

        // for (let i = 0; i < 15; i++) {
        //     this.pop();
        // }

        (window as any).v_main = this;

        window.document.addEventListener("click", this.onStageClick.bind(this));
    }

    private onStageClick() {
        const stack = di.get(ChipStackNode);
        stack.push(1);
        stack.push(2);
        stack.push(3);
        log_debug("onStageClick");
    }
    pop() {
        const colors = [
            Color3.FromHexString("#ad0401"),
            Color3.FromHexString("#056004"),
            Color3.Blue(),
            Color3.FromHexString("#272929"),
            Color3.Purple(),
        ];
        const mesh = this.chips.get(colors[Math.floor(colors.length * Math.random())]);
        mesh.position.x = (1 - Math.random()) * 0.04;
        mesh.position.z = (1 - Math.random()) * 0.04;
        mesh.position.y = 0.025 * (a * 1.1);
        mesh.rotate(Axis.Y, Math.random() * Math.PI, Space.LOCAL);
        a++;
    }

}