import {View3D} from "@game/View3D";
import MeshBuilder = BABYLON.MeshBuilder;
import StandardMaterial = BABYLON.StandardMaterial;
import Color3 = BABYLON.Color3;
import {Card3D} from "@game/cards/Card3D";
import {di} from "../inversify.config";
import {Metrics} from "@game/Metrics";
import Axis = BABYLON.Axis;
import {inject} from "inversify";
import {ChipStackNode} from "@game/chips/ChipStackNode";
import {ChipsManager} from "@game/chips/ChipsManager";
import {StakeModel} from "@game/StakeModel";

export class Table3D extends View3D {

    @inject(ChipStackNode)
    private chipStack: ChipStackNode;

    @inject(ChipsManager)
    private chipsManager: ChipsManager;

    @inject(StakeModel)
    private stakeModel: StakeModel;

    init(...params: any): this {

        const mesh = MeshBuilder.CreatePlane("game-table-plane", {width: 1500, height: 700});
        mesh.rotate(Axis.X, Math.PI / 2);
        const clothMaterial = new StandardMaterial("table-cloth", this.scene);
        clothMaterial.diffuseColor = Color3.FromHexString("#053204");
        mesh.material = clothMaterial;
        mesh.parent = this;

        let cardNode: Card3D = di.get(Card3D);
        let cardNode2: Card3D = di.get(Card3D);

        cardNode.parent = cardNode2.parent = this;

        cardNode.init();
        cardNode2.init();

        cardNode2.position.x = Metrics.CARD_WIDTH/5;
        cardNode2.position.y = Metrics.CARD_DEPTH;

        return this;
    }

    private onStageClick() {

        const stack2 = this.chipsManager.newStack(5.33);

        this.chipStack.merge(stack2);
        this.chipsManager.recast(this.chipStack);

        // this.chipStack.push(this.stakeModel.recastChips[0]);
        // if (this.chipStack.size > 10) {
        //     this.chipsManager.recast(this.chipStack);
        // }
    }

}