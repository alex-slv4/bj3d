import "babylonjs";
import {log_level_set} from "./core/log";
import {CoreTypes} from "./CoreTypes";
import GameCamera from "@game/camera/GameCamera";
import {GameFlowManager} from "./managers/GameFlowManager";
import Scene = BABYLON.Scene;
import Engine = BABYLON.Engine;
import Color4 = BABYLON.Color4;
import Vector3 = BABYLON.Vector3;
import MeshBuilder = BABYLON.MeshBuilder;
import UniversalCamera = BABYLON.UniversalCamera;
import Color3 = BABYLON.Color3;

const canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.setAttribute("touch-action", "none"); // for pepjs support
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

log_level_set(Number.MAX_SAFE_INTEGER);

const engine = new Engine(canvas, true, {}, true);

canvas.style.width = "100%";
canvas.style.height = "100%";

const scene = new Scene(engine);
scene.clearColor = new Color4(0, 0, 0, 1);

const uiCamera = new UniversalCamera("ui-camera", new Vector3(0, 200, 0), scene);
uiCamera.setTarget(Vector3.Zero());
uiCamera.viewport.y =- 0.5;

const light = new BABYLON.HemisphericLight("HemisphericLight", new Vector3(-5, 20, -5), scene);
light.intensity = 1;
light.specular = Color3.White();

const light2 = new BABYLON.HemisphericLight("HemisphericLight", new Vector3(-5, -20, -5), scene);
light2.intensity = 1;
light2.specular = Color3.White();

const box = MeshBuilder.CreateSphere("", {diameter: 20}, scene);
const inst = box.createInstance("bx2")

var pointerDragBehavior = new BABYLON.PointerDragBehavior({});
pointerDragBehavior.useObjectOrienationForDragging = false
inst.addBehavior(pointerDragBehavior)

engine.runRenderLoop(() => {
    scene.render();
});
window.addEventListener("resize", () => {
    engine.resize();
});