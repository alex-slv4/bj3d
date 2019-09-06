import {inject, injectable} from "inversify";
import {CoreTypes} from "../CoreTypes";
import {ChipsPanel} from "@game/chips/ChipsPanel";
import {Mesh, PickingInfo, PointerEventTypes, Scene} from "@babylonjs/core";

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
            switch (p.type) {
                case PointerEventTypes.POINTERDOWN:
                    this.chipsPanel.startDrag(p);
                    break;
                case PointerEventTypes.POINTERUP:
                    this.chipsPanel.stopDrag(p);
                    break;
                case PointerEventTypes.POINTERMOVE:
                    this.chipsPanel.updateDrag(p);
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