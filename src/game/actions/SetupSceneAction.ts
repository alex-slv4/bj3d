import {Action} from "@core/actions/Action";
import {inject, injectable} from "inversify";
import GameCamera from "@game/camera/GameCamera";
import {CoreTypes} from "../../CoreTypes";
import Scene = BABYLON.Scene;
import Vector3 = BABYLON.Vector3;
import Color3 = BABYLON.Color3;
import {UISceneInteractionManager} from "../../managers/UISceneInteractionManager";
import {di} from "../../inversify.config";
import {SceneInteractionManager} from "../../managers/SceneInteractionManager";
import {InteractionManager} from "../../managers/InteractionManager";

@injectable()
export class SetupSceneAction extends Action {

    @inject(GameCamera)
    private camera: GameCamera;

    @inject(CoreTypes.uiScene)
    private uiScene: Scene;

    @inject(CoreTypes.mainScene)
    private scene: Scene;

    async execute(): Promise<any> {
        this.camera.create();

        const light = new BABYLON.HemisphericLight("HemisphericLight", new Vector3(-5, 20, -5), this.scene);
        light.intensity = 1;
        light.specular = Color3.White();

        const light2 = new BABYLON.HemisphericLight("HemisphericLight", new Vector3(-5, -20, -5), this.scene);
        light2.intensity = 1;
        light2.specular = Color3.White();

        this.uiScene.addLight(light);
        this.uiScene.addLight(light2);

        di.get(InteractionManager).init();
        // di.get(SceneInteractionManager).init();
        // di.get(UISceneInteractionManager).init();

        this.resolve();
    }
}