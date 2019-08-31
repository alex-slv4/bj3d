import {injectable} from "inversify";
import Scene = BABYLON.Scene;
import PickingInfo = BABYLON.PickingInfo;
import PointerEventTypes = BABYLON.PointerEventTypes;
import PointerInfo = BABYLON.PointerInfo;
import Mesh = BABYLON.Mesh;

@injectable()
export abstract class InteractionManager {

    // @inject(CoreTypes.uiScene)
    protected scene: Scene;

    init() {
        this.scene.onPointerObservable.add((p) => {
            switch (p.type) {
                case PointerEventTypes.POINTERDOWN:
                    break;
                case PointerEventTypes.POINTERUP:
                    break;
                case PointerEventTypes.POINTERMOVE:
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
            if (this.scene == theMesh.getScene()) {
                this.onMeshPick(theMesh as Mesh, p)
            }
        }
    }

    protected onMeshPick(pick: Mesh, p: PickingInfo) {

    }
}