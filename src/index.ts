import {di} from "./inversify.config";
import {log_level_set} from "./core/log";
import {CoreTypes} from "./CoreTypes";
import GameCamera from "@game/camera/GameCamera";
import {GameFlowManager} from "./managers/GameFlowManager";
import Scene = BABYLON.Scene;
import Engine = BABYLON.Engine;
import Color4 = BABYLON.Color4;
import Camera = BABYLON.Camera;
import Vector3 = BABYLON.Vector3;
import MeshBuilder = BABYLON.MeshBuilder;
import Color3 = BABYLON.Color3;
import UniversalCamera = BABYLON.UniversalCamera;

const canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.setAttribute("touch-action", "none"); // for pepjs support
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

log_level_set(Number.MAX_SAFE_INTEGER);

const engine = new Engine(canvas, true, {}, true);

canvas.style.width = "100%";
canvas.style.height = "100%";
di.bind(Engine).toConstantValue(engine);

const scene = new Scene(engine);
scene.clearColor = new Color4(0, 0, 0, 1);

const uiScene = new Scene(engine);
uiScene.clearColor = new Color4(0, 0, 0, 1);
uiScene.autoClear = false;

di.bind("canvas").toConstantValue(canvas);
di.bind(Scene).toConstantValue(scene); // TODO: remove Scene binding
di.bind(CoreTypes.mainScene).toConstantValue(scene);
di.bind(CoreTypes.uiScene).toConstantValue(uiScene);

const uiCamera = new UniversalCamera("ui-camera", new Vector3(0, 200, 0), uiScene);
uiCamera.setTarget(Vector3.Zero());
uiCamera.viewport.y =- 0.5;

let box = MeshBuilder.CreateSphere("box", {diameter: 1}, uiScene);
uiScene.addMesh(box);

engine.runRenderLoop(() => {
    scene.render();
    uiScene.render();
});
window.addEventListener("resize", () => {
    engine.resize();
});

if (__DEV__) {
    let fpsmeter: FPSMeter = di.get(CoreTypes.debug.fpsMeter);
    fpsmeter.show();
    engine.onEndFrameObservable.add(() => {
        (fpsmeter as FPSMeter).tick();
    });
}

di.bind(GameCamera).toSelf();
di.get<GameFlowManager>(CoreTypes.gameFlowManager).startGame();