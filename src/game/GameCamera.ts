import FreeCamera = BABYLON.FreeCamera;
import ArcFollowCamera = BABYLON.ArcFollowCamera;
import AbstractMesh = BABYLON.AbstractMesh;
import Nullable = BABYLON.Nullable;
import FollowCamera = BABYLON.FollowCamera;
import Scene = BABYLON.Scene;
import Vector3 = BABYLON.Vector3;
import {inject, injectable} from "inversify";
import Engine = BABYLON.Engine;

@injectable()
export default class GameCamera {

    @inject(Scene)
    private scene: Scene;

    @inject(Engine)
    private engine: Engine;

    public camera: FollowCamera | FreeCamera | ArcFollowCamera;

    private _target: Nullable<AbstractMesh>;

    create() {

        this.camera = new FreeCamera("camera", Vector3.Zero(), this.scene);
        // this.camera.radius = 25;
        // this.camera.rotationOffset = 180;
        // this.camera.heightOffset = 14;

        // this.camera = new FreeCamera("FreeCamera", new Vector3(0, 45, -45), scene);
        // this.camera.attachControl(canvas, true);
        // this.camera.rotation.x += 0.51;

        (window as any).v_camera = this.camera;
    }

    // createAcrFollowCamera(target: AbstractMesh) {
    //     this.camera = new ArcFollowCamera("camera", -Math.PI / 2, Math.PI / 8, 40, target, this.scene);
    //     (window as any).v_camera = this.camera;
    // }
    set target(value: Nullable<AbstractMesh>) {
        this._target = value;
        if (this.camera instanceof FollowCamera) {
            this.camera.lockedTarget = this._target;
        }
        if (this.camera instanceof ArcFollowCamera) {
            this.camera.target = this._target;
        }
    }

}
