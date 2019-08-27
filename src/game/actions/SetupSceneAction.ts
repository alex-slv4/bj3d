import {Action} from "@core/actions/Action";
import {inject, injectable} from "inversify";
import GameCamera from "@game/GameCamera";
import {Table3D} from "@game/Table3D";
import Scene = BABYLON.Scene;
import Vector3 = BABYLON.Vector3;
import Color3 = BABYLON.Color3;

@injectable()
export class SetupSceneAction extends Action {

    @inject(GameCamera)
    private camera: GameCamera;

    @inject(Scene)
    private scene: Scene;

    @inject(Table3D)
    private table: Table3D;

    async execute(): Promise<any> {
        this.camera.create();

        const light = new BABYLON.HemisphericLight("HemisphericLight", new Vector3(-5, 20, -5), this.scene);
        light.intensity = 1;
        light.specular = Color3.White();

        const light2 = new BABYLON.HemisphericLight("HemisphericLight", new Vector3(-5, -20, -5), this.scene);
        light2.intensity = 1;
        light2.specular = Color3.White();

        this.resolve();
    }
}