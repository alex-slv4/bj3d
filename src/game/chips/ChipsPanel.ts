import {inject, injectable} from "inversify";
import {View3D} from "@game/View3D";
import {StakeModel} from "@game/StakeModel";
import {ChipFactory} from "@game/chips/ChipFactory";
import {CoreTypes} from "../../CoreTypes";
import {Metrics} from "@game/Metrics";
import {GameFlowManagerBJ} from "../../managers/GameFlowManagerBJ";
import {di} from "../../inversify.config";
import {
    AbstractMesh,
    Axis,
    Color3,
    EasingFunction,
    InstancedMesh,
    Mesh,
    MeshBuilder,
    PointerDragBehavior,
    Scene,
    SineEase,
    Space,
    StandardMaterial,
    TransformNode,
    Animation,
    Vector2, PointerInfo, Nullable
} from "@babylonjs/core";

enum DragState {
    NONE,
    PULL,
    SCROLL
}

@injectable()
export class ChipsPanel extends View3D {

    @inject(CoreTypes.uiScene)
    private uiScene: Scene;

    @inject(StakeModel)
    private stakeModel: StakeModel;

    @inject(ChipFactory)
    private chipFactory: ChipFactory;

    // @inject(CoreTypes.gameFlowManager) FIXME: why?
    private flowManager: GameFlowManagerBJ;

    private appearanceAnimation: Animation;
    private startPoint: Vector2;
    private dragState: DragState = DragState.NONE;
    private snappedChip: Mesh;
    private snappedChipInstance: InstancedMesh;
    private chipsNode: TransformNode = new TransformNode("chips-container", this.uiScene);
    private plane: Mesh;
    private chipMeshes: AbstractMesh[] = [];
    private startPointerID: number;

    private dragPanelBehaviour: PointerDragBehavior = new PointerDragBehavior({dragAxis: Axis.X});

    init(...params: any): this {
        const availableChips = this.stakeModel.getAvailableChips();

        this.chipsNode.parent = this;
        this.chipsNode.position.z = -Metrics.CHIP_DIAMETER * 0.5;
        this.chipsNode.position.y = Metrics.CHIP_DEPTH;

        this.flowManager = di.get(CoreTypes.gameFlowManager);
        this.plane = MeshBuilder.CreatePlane("chip-panel-plane", {size: Metrics.CHIP_DIAMETER}, this.uiScene);
        const planeMat = new StandardMaterial("chip-panel", this.uiScene);
        planeMat.diffuseColor = Color3.Black();
        planeMat.alpha = 0.4;
        this.plane.material = planeMat;
        this.plane.convertToFlatShadedMesh();
        this.plane.rotate(Axis.X, Math.PI / 2);
        this.plane.scaling.x = availableChips.length + 1;
        this.plane.scaling.y = 1.2;
        this.plane.position.z = -Metrics.CHIP_DIAMETER * 0.5;
        this.plane.parent = this;
        // this.plane.isVisible = false;
        this.dragPanelBehaviour.updateDragPlane = false;
        this.dragPanelBehaviour.useObjectOrienationForDragging = false;
        let stp = (Metrics.CHIP_DIAMETER + Metrics.CHIP_DEPTH);
        let minX = -(availableChips.length - 1) * stp;
        this.dragPanelBehaviour.onDragEndObservable.add(() => {
            if (this.chipsNode.position.x > 0) {
                this.chipsNode.position.x = 0
            } else if (this.chipsNode.position.x < minX) {
                this.chipsNode.position.x = minX
            } else {
                this.chipsNode.position.x = Math.round(this.chipsNode.position.x / stp) * stp;
            }
        });
        this.chipsNode.addBehavior(this.dragPanelBehaviour);

        this.appearanceAnimation = new Animation("chip-appearance", "position.z", 60, Animation.ANIMATIONTYPE_FLOAT);
        let easingFunction = new SineEase();
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
            iChipView.mesh.position.x = i * (Metrics.CHIP_DIAMETER + Metrics.CHIP_DEPTH);
            iChipView.mesh.position.y = Metrics.CHIP_DEPTH;
            iChipView.mesh.parent = this.chipsNode;
            iChipView.mesh.isPickable = false;
            // @ts-ignore FIXME: temporary solution to bind data, again...
            iChipView.mesh["chipValue"] = amount;

            this.chipMeshes.push(iChipView.mesh)
        });

        return this;
    }

    public pickChip(mesh: Mesh) {
        // @ts-ignore FIXME: temporary solution to bind data, again...
        this.flowManager.bet(0, mesh["chipValue"])
    }
    public startDrag(p: PointerInfo) {
        let event = p.event;
        this.startPointerID = (event as PointerEvent).pointerId;
        this.startPoint = new Vector2(event.clientX, event.clientY);
    }
    public updateDrag(p: PointerInfo) {
        let event = p.event;
        if (this.startPoint) {

            switch (this.dragState) {
                case DragState.NONE:
                    let dragPoint = new Vector2(event.clientX, event.clientY);
                    let distance = Vector2.Distance(dragPoint, this.startPoint);
                    if (distance > 10) {
                        const vec = this.startPoint.subtract(dragPoint);
                        const angle = Math.atan2(vec.y, vec.x);

                        const angleDither = Math.PI / 4; // TODO: move to constants
                        if (angle > angleDither && angle < Math.PI - angleDither) {
                            const theChip = this.getChipAt(event.clientX, event.clientY);
                            if (theChip) {
                                this._snap(theChip);
                                this.dragState = DragState.PULL;
                            }
                        } else {
                            this.dragState = DragState.SCROLL;
                            this.chipsNode.addBehavior(this.dragPanelBehaviour);

                            this.dragPanelBehaviour.startDrag(this.startPointerID, p.pickInfo!.ray!, p.pickInfo!.pickedPoint!);
                        }
                    }
                    break;
            }
        }
    }
    private _snap(mesh: Mesh) {
        this.snappedChip = mesh;
        // TODO: move to constructor
        var pointerDragBehavior = new PointerDragBehavior({});

        // BABYLON.Vector3.TransformCoordinates(aChip.absolutePosition, mainScene.getTransformMatrix())

        // @ts-ignore
        let amount = mesh["chipValue"];
        this.snappedChipInstance = this.chipFactory.get(amount).mesh as InstancedMesh;
        this.snappedChipInstance.position = mesh.position.clone();
        this.snappedChipInstance.rotationQuaternion = mesh.rotationQuaternion!.clone();
        this.snappedChipInstance.parent = this.chipsNode;

        this.snappedChipInstance.addBehavior(pointerDragBehavior);
        pointerDragBehavior.startDrag(this.startPointerID);
        this.snappedChip.animations = [this.appearanceAnimation];
        this.uiScene.beginAnimation(this.snappedChip, 0, 30);
    }

    public stopDrag(p: PointerInfo) {
        this.dragState = DragState.NONE;

        if (this.snappedChip) {
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
    public getChipAt(screenX: number, screenY: number): Nullable<Mesh> {
        let pickInfo = this.uiScene.pick(screenX, screenY, mesh => mesh === this.plane)!;
        if (pickInfo.pickedPoint) {
            let pickedX = pickInfo.pickedPoint.x - this.chipsNode.position.x;
            let chipIndex = Math.round(pickedX / (Metrics.CHIP_DIAMETER + Metrics.CHIP_DEPTH));
            if (chipIndex >= 0 && chipIndex < this.chipMeshes.length) {
                return this.chipMeshes[chipIndex] as Mesh;
            }
        }
        return null;
    }
}