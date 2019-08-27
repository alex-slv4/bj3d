import {di} from "./inversify.config";
import {log_level_set} from "./core/log";
import {CoreTypes} from "./CoreTypes";
import GameCamera from "@game/GameCamera";
import {GameFlowManager} from "./managers/GameFlowManager";
import Scene = BABYLON.Scene;
import Engine = BABYLON.Engine;
import Color4 = BABYLON.Color4;

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
di.bind("canvas").toConstantValue(canvas);
di.bind(Scene).toConstantValue(scene);

engine.runRenderLoop(() => {
    scene.render();
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