import {inject, injectable} from "inversify";
import {CoreTypes} from "../CoreTypes";
import {InteractionManager} from "./InteractionManager";
import Scene = BABYLON.Scene;
import PickingInfo = BABYLON.PickingInfo;
import Mesh = BABYLON.Mesh;
import {ChipsPanel} from "@game/chips/ChipsPanel";

@injectable()
export class UISceneInteractionManager extends InteractionManager {

    @inject(CoreTypes.uiScene)
    protected scene: Scene;

    @inject(ChipsPanel)
    private chipPanel: ChipsPanel;

    protected onMeshPick(mesh: Mesh, p: PickingInfo) {
        // super.onMeshPick(mesh);
        this.chipPanel.pickChip(mesh)
    }
}