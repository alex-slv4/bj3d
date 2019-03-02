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
import ShaderMaterial = BABYLON.ShaderMaterial;

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

        const chip = MeshBuilder.CreateCylinder("chip", {diameter: 0.39, height: 0.025, tessellation: 64}, this.scene);

        const chipMaterial = new MultiMaterial("chipMulti", this.scene);

        const chipMaterial1 = new StandardMaterial("chip", this.scene);
        const texture = new Texture("./assets/texture-chip-wb.png", this.scene);
        const bumpTexture = new Texture("./assets/chip-normalmap.png", this.scene);
        chipMaterial1.diffuseColor = Color3.Random();
        chipMaterial1.specularColor = Color3.White();
        chipMaterial1.specularTexture = texture;

        chipMaterial1.emissiveColor = Color3.Black();
        chipMaterial1.emissiveTexture = texture;

        chipMaterial1.bumpTexture = bumpTexture;

        chipMaterial.subMaterials.push(chipMaterial1);
        chip.material = chipMaterial1;
    }

    private createChip() {
    }
}