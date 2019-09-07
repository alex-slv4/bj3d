import {inject, injectable} from "inversify";
import {CoreTypes} from "../CoreTypes";
import {ChipsPanel} from "@game/chips/ChipsPanel";
import {Mesh, PickingInfo, PointerEventTypes, Scene} from "@babylonjs/core";
import {di} from "../inversify.config";
import {GameFlowManagerBJ} from "./GameFlowManagerBJ";

@injectable()
export abstract class InteractionManager {

    @inject(CoreTypes.mainScene)
    protected scene: Scene;

    @inject(ChipsPanel)
    protected chipsPanel: ChipsPanel;

    init() {
        this.scene.onPointerObservable.add((p) => {
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
        if (p.hit) {
            const theMesh = p!.pickedMesh!;
            di.get<GameFlowManagerBJ>(CoreTypes.gameFlowManager).bet("0", 10)
        }
    }

    protected onMeshPick(pick: Mesh, p: PickingInfo) {

    }
}