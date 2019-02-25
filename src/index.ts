import Scene = BABYLON.Scene;
import Engine = BABYLON.Engine;
import Nullable = BABYLON.Nullable;
import {di} from "./inversify.config";
import {log_warn} from "./log";
import {CoreTypes} from "./CoreTypes";

let engine: Engine;
let scene: Scene;

const canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.setAttribute("touch-action", "none"); // for pepjs support
canvas.width = window.innerWidth; // * window.devicePixelRatio;
canvas.height = window.innerHeight; // * window.devicePixelRatio;
document.body.appendChild(canvas);

engine = new Engine(canvas, true, {}, true);

canvas.style.width = "100%";
canvas.style.height = "100%";﻿﻿

scene = new Scene(engine);
di.bind("canvas").toConstantValue(canvas);
di.bind(Scene).toConstantValue(scene);

engine.runRenderLoop(() => {
    scene.render();
});
window.addEventListener("resize", () => {
    engine.resize();
});

if (__DEV__) {
    let fpsmeter: Nullable<FPSMeter> = null;
    try {
        fpsmeter = di.get(CoreTypes.debug.fpsMeter);
    } catch (error) {
        log_warn("Failed to add FPS meter");
    }
    if (fpsmeter) {
        fpsmeter.show();
        engine.onEndFrameObservable.add(() => {
            (fpsmeter as FPSMeter).tick();
        });
    }
}