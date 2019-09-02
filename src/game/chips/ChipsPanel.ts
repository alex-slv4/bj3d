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

enum DragState {
    NONE,
    DRAGGING,
    SCROLLING
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

    init(...params: any): this {

        this.flowManager = di.get(CoreTypes.gameFlowManager);

        this.appearanceAnimation = new BABYLON.Animation("chip-appearance", "position.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT);
        const keys = [
            {frame: 0, value: Metrics.CHIP_DIAMETER},
            {frame: 30, value: -Metrics.CHIP_DIAMETER * 0.5},
        ];
        this.appearanceAnimation.setKeys(keys);

        this.stakeModel.getAvailableChips().forEach((amount, i) => {
            let iChipView = this.chipFactory.get(amount);
            iChipView.mesh.rotate(Axis.X, Math.PI / 8, Space.LOCAL);
            // Vector3.Right().add(Vector3.One().scale(Metrics.CHIP_DIAMETER))
            iChipView.mesh.position.x = i * (Metrics.CHIP_DIAMETER + Metrics.CHIP_DEPTH);
            iChipView.mesh.position.z = -Metrics.CHIP_DIAMETER * 0.5;
            iChipView.mesh.parent = this;

            // @ts-ignore FIXME: temporary solution to bind data, again...
            iChipView.mesh["chipValue"] = amount;
        });

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
                case DragState.SCROLLING:
                    this._updateScroll(event);
                    break;
                case DragState.DRAGGING:
                    this._dragSnapped(event);
                    break;
                case DragState.NONE:
                    let dragPoint = new Vector2(event.clientX, event.clientY);
                    let distance = Vector2.Distance(dragPoint, this.startPoint);
                    if (distance > 20) {
                        const vec = this.startPoint.subtract(dragPoint);
                        const angle = Math.atan2(vec.y, vec.x);

                        let asd = Math.PI / 4; // TODO: move to constants
                        if (angle > asd && angle < Math.PI - asd) {
                            log_warn("Snap");
                            let pickInfo = this.uiScene.pick(this.startPoint.x, this.startPoint.y, (mesh) => mesh.id.indexOf("chip") !== -1);

                            if (pickInfo!.pickedMesh) {
                                this._snap(pickInfo!.pickedMesh as Mesh, event);
                                this.dragState = DragState.DRAGGING;
                            } else {
                                this.dragState = DragState.SCROLLING;
                            }
                        } else {
                            this.dragState = DragState.SCROLLING;
                        }
                    }
                    break;
            }
        }
    }
    private _updateScroll(evt: PointerEvent) {
        var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;

        this.camera.position.x += offsetX / window.devicePixelRatio;
    }
    private _dragSnapped(event: PointerEvent) {

    }
    private _snap(mesh: Mesh, event?: PointerEvent) {
        this.snappedChip = mesh;
        var pointerDragBehavior = new BABYLON.PointerDragBehavior({});

        this.snappedChipInstance = this.snappedChip.createInstance("chip" + Math.random());
        this.snappedChipInstance.addBehavior(pointerDragBehavior);
        pointerDragBehavior.startDrag();
        // this.snappedChip.isVisible = false;
        // this.snappedChip.position.z = Metrics.CHIP_DIAMETER;
        this.snappedChip.animations = [this.appearanceAnimation];
        this.uiScene.beginAnimation(this.snappedChip, 0, 30);

        log_debug("we are drag", this.snappedChip)
    }
    public stopDrag(event: PointerEvent) {
        log_debug("stopDrag", this.camera.position.x);
        this.dragState = DragState.NONE;

        if (this.snappedChip) {
            // this.snappedChip.isVisible = true;
            this.uiScene.stopAnimation(this.snappedChip);
            this.snappedChip.position.z = -Metrics.CHIP_DIAMETER * 0.5;
        }
        if (this.snappedChipInstance) {
            this.snappedChipInstance.dispose();
        }

        delete this.snappedChipInstance;
        delete this.startPoint;
        delete this.snappedChip;
    }
}