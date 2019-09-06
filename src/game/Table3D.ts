import {View3D} from "@game/View3D";
import {Card3D} from "@game/cards/Card3D";
import {di} from "../inversify.config";
import {Metrics} from "@game/Metrics";
import {inject} from "inversify";
import {ChipStackNode} from "@game/chips/ChipStackNode";
import {ChipsManager} from "@game/chips/ChipsManager";
import {StakeModel} from "@game/StakeModel";
import {Axis, Color3, Mesh, MeshBuilder, StandardMaterial, TransformNode} from "@babylonjs/core";
import {ChipFactory} from "@game/chips/ChipFactory";

export class Table3D extends View3D {

    @inject(ChipStackNode)
    private chipStack: ChipStackNode;

    @inject(ChipsManager)
    private chipsManager: ChipsManager;

    @inject(StakeModel)
    private stakeModel: StakeModel;

    private betSpot: Mesh;

    init(...params: any): this {

        let betSpotSize = Metrics.CHIP_DIAMETER * 1.7;
        this.betSpot = MeshBuilder.CreateCylinder("bet-spot", {diameter: betSpotSize}, this.scene);
        const betSpotMaterial = new StandardMaterial("table-cloth", this.scene);
        betSpotMaterial.diffuseColor = Color3.FromHexString("#20beff");
        betSpotMaterial.alpha = 0.4;
        this.betSpot.material = betSpotMaterial;
        this.betSpot.parent = this;

        const betStack = this.chipsManager.newStack(5.33);
        betStack.parent = this.betSpot;

        const mesh = MeshBuilder.CreatePlane("game-table-plane", {width: 1500, height: 700}, this.scene);
        mesh.rotate(Axis.X, Math.PI / 2);
        mesh.freezeWorldMatrix();

        const clothMaterial = new StandardMaterial("table-cloth", this.scene);
        clothMaterial.diffuseColor = Color3.FromHexString("#053204");
        mesh.material = clothMaterial;
        mesh.parent = this;

        const dealerCardsNode = new TransformNode("dealer-cards", this.scene);
        const userCardsNode = new TransformNode("user-cards", this.scene);

        let siz = (Metrics.CARD_WIDTH * 0.25);
        [0, 0, 0, 0, 0].forEach((_, i) => {
            let cardNode: Card3D = di.get(Card3D);
            cardNode.init();
            cardNode.position.x = i * siz;
            cardNode.position.y = i * Metrics.CARD_DEPTH;
            cardNode.parent = dealerCardsNode;
        });
        dealerCardsNode.position.x = -(siz * 5) / 2;

        [0, 0, 0].forEach((_, i) => {
            let cardNode: Card3D = di.get(Card3D);
            cardNode.init();
            cardNode.parent = userCardsNode;
            cardNode.position.x = i * (Metrics.CARD_WIDTH / 5);
            cardNode.position.z = i * (Metrics.CARD_HEIGHT / 5);
            cardNode.position.y = i * Metrics.CARD_DEPTH;
        });
        userCardsNode.position.z = betSpotSize;
        userCardsNode.parent = this;
        dealerCardsNode.parent = this;
        dealerCardsNode.position.z = Metrics.CARD_HEIGHT * 2.5;
        userCardsNode.position.y = dealerCardsNode.position.y = Metrics.CARD_DEPTH;

        // let cardNode: Card3D = di.get(Card3D);
        // let cardNode2: Card3D = di.get(Card3D);
        //
        // cardNode.parent = cardNode2.parent = this;
        //
        // cardNode.init();
        // cardNode2.init();
        //
        // cardNode.position.y = Metrics.CARD_DEPTH;
        // cardNode2.position.x = Metrics.CARD_WIDTH/5;
        // cardNode2.position.y = Metrics.CARD_DEPTH * 2;

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