import {inject, injectable} from "inversify";
import {Metrics} from "../Metrics";
import {CoreTypes} from "../../CoreTypes";
import {
    AbstractMesh,
    ArcFollowCamera,
    ArcRotateCamera,
    Engine,
    FollowCamera,
    FreeCamera,
    Nullable,
    Scene, Vector3
} from "@babylonjs/core";

@injectable()
export default class GameCamera {

    @inject(CoreTypes.mainScene)
    private scene: Scene;

    @inject(Engine)
    private engine: Engine;

    public camera: FollowCamera | FreeCamera | ArcFollowCamera | any;

    private _target: Nullable<AbstractMesh>;

    create() {
        const canvas = this.engine.getRenderingCanvas() as HTMLCanvasElement;

        // this.camera = new FreeCamera("camera", new Vector3(0, 2, -2), this.scene);
        // this.camera.attachControl(canvas, true);
        // this.camera.rotation.x += 0.51;

        this.camera = new ArcRotateCamera("camera", -Math.PI / 2, 0, Metrics.CARD_HEIGHT * 10, new Vector3(0, 0, Metrics.CARD_HEIGHT), this.scene);
        this.camera.attachControl(canvas, true);

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
