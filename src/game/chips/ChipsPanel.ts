import {inject, injectable} from "inversify";
import {View3D} from "@game/View3D";
import {StakeModel} from "@game/StakeModel";
import {ChipFactory} from "@game/chips/ChipFactory";
import {CoreTypes} from "../../CoreTypes";
import {Metrics} from "@game/Metrics";
import {GameFlowManagerBJ} from "../../managers/GameFlowManagerBJ";
import {di} from "../../inversify.config";
import {log_debug, log_trace, log_warn} from "@core/log";
import Scene = BABYLON.Scene;
import Axis = BABYLON.Axis;
import Space = BABYLON.Space;
import Mesh = BABYLON.Mesh;
import UniversalCamera = BABYLON.UniversalCamera;
import Vector2 = BABYLON.Vector2;
import InstancedMesh = BABYLON.InstancedMesh;
import EasingFunction = BABYLON.EasingFunction;
import MeshBuilder = BABYLON.MeshBuilder;
import Vector3 = BABYLON.Vector3;
import TransformNode = BABYLON.TransformNode;
import AbstractMesh = BABYLON.AbstractMesh;
import PickingInfo = BABYLON.PickingInfo;

enum DragState {
    NONE,
    PULL,
    SCROLL
}

@injectable()
export class ChipsPanel extends View3D {

    @inject(CoreTypes.uiScene)
    private uiScene: Scene;

    @inject(CoreTypes.uiCamera)
    private camera: UniversalCamera;

    @inject(StakeModel)
    private stakeModel: StakeModel;

    @inject(ChipFactory)
    private chipFactory: ChipFactory;

    // @inject(CoreTypes.gameFlowManager) FIXME: why?
    private flowManager: GameFlowManagerBJ;

    private appearanceAnimation: BABYLON.Animation;
    private startPoint: Vector2;
    private dragState: DragState = DragState.NONE;
    private snappedChip: Mesh;
    private snappedChipInstance: InstancedMesh;
    private cameraMax: number;
    private chipsNode: TransformNode = new TransformNode("chips-container", this.uiScene);

    private plane: Mesh;
    private startScrollPoint: Vector3;
    private chipMeshes: AbstractMesh[] = [];
    private startScrollPointMouse: Vector2;

    init(...params: any): this {
        const availableChips = this.stakeModel.getAvailableChips();

        this.chipsNode.parent = this;
        this.chipsNode.position.z = -Metrics.CHIP_DIAMETER * 0.5;
        this.chipsNode.position.y = Metrics.CHIP_DEPTH;

        this.flowManager = di.get(CoreTypes.gameFlowManager);
        this.plane = MeshBuilder.CreatePlane("chip-panel-plane", {size: Metrics.CHIP_DIAMETER}, this.uiScene);
        this.plane.rotate(Axis.X, Math.PI / 2);
        this.plane.scaling.x = availableChips.length * 2;
        this.plane.position.z = -Metrics.CHIP_DIAMETER * 0.5;
        this.plane.parent = this;
        this.plane.isVisible = false;

        this.appearanceAnimation = new BABYLON.Animation("chip-appearance", "position.z", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
        let easingFunction = new BABYLON.SineEase();
        easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEOUT);
        this.appearanceAnimation.setEasingFunction(easingFunction);

        const keys = [
            {frame: 0, value: Metrics.CHIP_DIAMETER},
            {frame: 30, value: 0},
        ];
        this.appearanceAnimation.setKeys(keys);

        availableChips.forEach((amount, i) => {
            let iChipView = this.chipFactory.get(amount);
            iChipView.mesh.rotate(Axis.X, Math.PI / 8, Space.LOCAL);
            // Vector3.Right().add(Vector3.One().scale(Metrics.CHIP_DIAMETER))
            iChipView.mesh.position.x = i * (Metrics.CHIP_DIAMETER + Metrics.CHIP_DEPTH);
            iChipView.mesh.parent = this.chipsNode;
            iChipView.mesh.isPickable = false;
            // @ts-ignore FIXME: temporary solution to bind data, again...
            iChipView.mesh["chipValue"] = amount;

            this.chipMeshes.push(iChipView.mesh)
        });
        this.cameraMax = (availableChips.length - 1) * (Metrics.CHIP_DIAMETER + Metrics.CHIP_DEPTH);

        return this;
    }

    public pickChip(mesh: Mesh) {
        // @ts-ignore FIXME: temporary solution to bind data, again...
        this.flowManager.bet(0, mesh["chipValue"])
    }
    public startDrag(event: PointerEvent) {
        this.startPoint = new Vector2(event.clientX, event.clientY);
        log_debug("startDrag")
    }
    public updateDrag(event: PointerEvent) {
        if (this.startPoint) {

            switch (this.dragState) {
                case DragState.NONE:
                    let dragPoint = new Vector2(event.clientX, event.clientY);
                    let distance = Vector2.Distance(dragPoint, this.startPoint);
                    if (distance > 20) {
                        const vec = this.startPoint.subtract(dragPoint);
                        const angle = Math.atan2(vec.y, vec.x);

                        let asd = Math.PI / 4; // TODO: move to constants
                        if (angle > asd && angle < Math.PI - asd) {
                            let pickInfo = this.pickPlane(this.startPoint.x, this.startPoint.y);
                            let pickedX = pickInfo.pickedPoint!.x - this.chipsNode.position.x;
                            let chipIndex = Math.round(pickedX / (Metrics.CHIP_DIAMETER + Metrics.CHIP_DEPTH));
                            if (chipIndex > 0 && chipIndex < this.chipMeshes.length) {
                                this._snap(this.chipMeshes[chipIndex] as Mesh);
                                this.dragState = DragState.PULL;
                                log_warn("Snap");
                            }
                        } else {
                            this.dragState = DragState.SCROLL;
                            this.startScrollPoint = this.chipsNode.position.clone();
                        }
                    }
                    break;
                case DragState.SCROLL:
                    this._updateScroll(event);
                    break;
            }
        }
    }
    private _updateScroll(evt: PointerEvent) {
        let pickInfo = this.pickPlane(evt.clientX, evt.clientY);
        let movedPoint = pickInfo.pickedPoint!;
        this.chipsNode.position.x = this.startScrollPoint.x + movedPoint.x;
    }
    private _snap(mesh: Mesh) {
        this.snappedChip = mesh;
        var pointerDragBehavior = new BABYLON.PointerDragBehavior({});

        // @ts-ignore
        let amount = mesh["chipValue"];
        this.snappedChipInstance = this.chipFactory.get(amount).mesh as InstancedMesh;
        this.snappedChipInstance.position = mesh.position.clone();
        this.snappedChipInstance.rotationQuaternion = mesh.rotationQuaternion!.clone();
        this.snappedChipInstance.parent = this.chipsNode;

        this.snappedChipInstance.addBehavior(pointerDragBehavior);
        pointerDragBehavior.startDrag();
        this.snappedChip.animations = [this.appearanceAnimation];
        this.uiScene.beginAnimation(this.snappedChip, 0, 30);

        log_debug("we are drag", this.snappedChip)
    }
    public pickPlane(x: number, y: number): PickingInfo {
        let pickInfo = this.uiScene.pick(x, y, mesh => mesh === this.plane)!;
        return pickInfo;
    }
    public stopDrag(event: PointerEvent) {
        log_debug("stopDrag", this.camera.position.x);
        this.dragState = DragState.NONE;

        if (this.snappedChip) {
            // this.snappedChip.isVisible = true;
            this.uiScene.stopAnimation(this.snappedChip);
            this.snappedChip.position.z = 0;
        }
        if (this.snappedChipInstance) {
            this.snappedChipInstance.dispose();
        }

        delete this.snappedChipInstance;
        delete this.startPoint;
        delete this.snappedChip;
    }
}