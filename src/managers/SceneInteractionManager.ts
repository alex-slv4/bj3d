import {inject, injectable} from "inversify";
import {CoreTypes} from "../CoreTypes";
import {ChipStackNode} from "@game/chips/ChipStackNode";
import {InteractionManager} from "./InteractionManager";
import Scene = BABYLON.Scene;

@injectable()
export class SceneInteractionManager extends InteractionManager {

    @inject(CoreTypes.uiScene)
    protected scene: Scene;
    private pickedChip: ChipStackNode;
}