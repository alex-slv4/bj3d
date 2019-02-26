import {inject, injectable} from "inversify";
import GameCamera from "@game/GameCamera";
import Scene = BABYLON.Scene;
import MeshBuilder = BABYLON.MeshBuilder;
import HemisphericLight = BABYLON.HemisphericLight;
import Vector3 = BABYLON.Vector3;

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

        const chip = MeshBuilder.CreateCylinder("chip", {diameter: 0.39, height: 0.02}, this.scene);

        // const plane = MeshBuilder.CreatePlane("chip", {size: 10}, this.scene);
        // plane.rotate(Axis.X, Math.PI / 2, Space.LOCAL);
        // plane.position.y = -1;
        // const m = new StandardMaterial("plane-m", this.scene);
        // m.diffuseColor = Color3.Blue();
        // plane.material = m;
    }

    private createChip() {
    }
}