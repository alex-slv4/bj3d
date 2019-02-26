import {inject, injectable} from "inversify";
import Scene = BABYLON.Scene;
import GameCamera from "@game/GameCamera";

@injectable()
export class Main {

    @inject(Scene)
    private scene: Scene;

    @inject(GameCamera)
    private camera: GameCamera;

    start() {
        this.camera.create();
    }
}