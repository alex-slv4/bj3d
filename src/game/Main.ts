import {inject, injectable} from "inversify";
import GameCamera from "@game/GameCamera";
import Scene = BABYLON.Scene;
import MeshBuilder = BABYLON.MeshBuilder;
import HemisphericLight = BABYLON.HemisphericLight;
import Vector3 = BABYLON.Vector3;
import StandardMaterial = BABYLON.StandardMaterial;
import Color3 = BABYLON.Color3;
import Texture = BABYLON.Texture;
import Vector4 = BABYLON.Vector4;

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

        const sideTextureSize = 16;
        const textureWidth = 512;
        const textureHeight = 512 + sideTextureSize;

        const p = 1 - sideTextureSize / textureHeight;
        const faceUV = [
            new Vector4(0, 0, 1, p),
            new Vector4(0, p, 6, 1),
        ];
        faceUV.push(faceUV[0]);

        const chip = MeshBuilder.CreateCylinder("chip", {
            diameter: 0.39,
            height: 0.025,
            tessellation: 64,
            faceUV,
        }, this.scene);

        const material = new StandardMaterial("chip", this.scene);
        const texture = new Texture("./assets/texture-chip-wb.png", this.scene);
        const bumpTexture = new Texture("./assets/chip-normalmap.png", this.scene);

        material.diffuseColor = Color3.Random();
        material.specularColor = Color3.White();
        material.specularTexture = texture;
        material.emissiveColor = Color3.Black();
        material.emissiveTexture = texture;
        material.bumpTexture = bumpTexture;

        chip.material = material;
    }

}