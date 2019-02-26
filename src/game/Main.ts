import {inject, injectable} from "inversify";
import GameCamera from "@game/GameCamera";
import Scene = BABYLON.Scene;
import MeshBuilder = BABYLON.MeshBuilder;
import HemisphericLight = BABYLON.HemisphericLight;
import Vector3 = BABYLON.Vector3;
import StandardMaterial = BABYLON.StandardMaterial;
import Color3 = BABYLON.Color3;
import Texture = BABYLON.Texture;
import MultiMaterial = BABYLON.MultiMaterial;

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

        const chip = MeshBuilder.CreateCylinder("chip", {diameter: 0.39, height: 0.025, tessellation: 32}, this.scene);

        const chipMaterial = new MultiMaterial("chipMulti", this.scene);

        const chipMaterial1 = new StandardMaterial("chip", this.scene);
        const texture = new Texture("./assets/texture-chip-bw.png", this.scene);
        chipMaterial1.diffuseColor = Color3.Random();
        chipMaterial1.diffuseTexture = texture;
        chipMaterial1.diffuseTexture.hasAlpha = true;

        chipMaterial.subMaterials.push(chipMaterial1);
        chip.material = chipMaterial1;

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