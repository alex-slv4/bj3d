import {di} from "./inversify.config";
import Scene = BABYLON.Scene;
import Engine = BABYLON.Engine;
import Nullable = BABYLON.Nullable;
import {log_level_set, log_warn} from "./log";
import {CoreTypes} from "./CoreTypes";
import {Main} from "@game/Main";
import GameCamera from "@game/GameCamera";

const canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.setAttribute("touch-action", "none"); // for pepjs support
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

log_level_set(Number.MAX_SAFE_INTEGER);

const engine = new Engine(canvas, true, {}, true);

canvas.style.width = "100%";
canvas.style.height = "100%";﻿﻿
di.bind(Engine).toConstantValue(engine);

const scene = new Scene(engine);
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

di.bind(Main).toSelf();
di.bind(GameCamera).toSelf();

di.get<Main>(Main).start();