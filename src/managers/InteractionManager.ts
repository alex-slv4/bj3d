import {inject, injectable} from "inversify";
import Scene = BABYLON.Scene;
import PickingInfo = BABYLON.PickingInfo;
import PointerEventTypes = BABYLON.PointerEventTypes;
import Mesh = BABYLON.Mesh;
import {CoreTypes} from "../CoreTypes";
import {ChipsPanel} from "@game/chips/ChipsPanel";

@injectable()
export abstract class InteractionManager {

    @inject(CoreTypes.mainScene)
    protected mainScene: Scene;

    @inject(CoreTypes.uiScene)
    protected uiScene: Scene;

    @inject(ChipsPanel)
    protected chipsPanel: ChipsPanel;

    init() {
        this.uiScene.onPointerObservable.add((p) => {
            let pointerEvent = p.event as PointerEvent;
            switch (p.type) {
                case PointerEventTypes.POINTERDOWN:
                    this.chipsPanel.startDrag(pointerEvent);
                    break;
                case PointerEventTypes.POINTERUP:
                    this.chipsPanel.stopDrag(pointerEvent);
                    break;
                case PointerEventTypes.POINTERMOVE:
                    this.chipsPanel.updateDrag(pointerEvent);
                    break;
                case PointerEventTypes.POINTERPICK:
                    this.pointerPick(p.pickInfo!);
                    break;
                case PointerEventTypes.POINTERTAP:
                    break;
                case PointerEventTypes.POINTERDOUBLETAP:
                    break;

            }


        })
    }

    protected pointerPick(p: PickingInfo) {
        // if (p.hit) {
        //     const theMesh = p!.pickedMesh!;
        //     if (this.scene == theMesh.getScene()) {
        //         this.onMeshPick(theMesh as Mesh, p)
        //     }
        // }
    }

    protected onMeshPick(pick: Mesh, p: PickingInfo) {

    }
}