import {inject, injectable} from "inversify";
import GameCamera from "@game/GameCamera";
import {ChipStackNode} from "@game/chips/ChipStackNode";
import {StakeModel} from "@game/StakeModel";
import {ChipsManager} from "@game/chips/ChipsManager";
import Scene = BABYLON.Scene;
import HemisphericLight = BABYLON.HemisphericLight;
import Vector3 = BABYLON.Vector3;
import MeshBuilder = BABYLON.MeshBuilder;
import {CardTextureCache} from "@game/CardTextureCache";
import StandardMaterial = BABYLON.StandardMaterial;
import Color3 = BABYLON.Color3;

@injectable()
export class Main {

    @inject(Scene)
    private scene: Scene;

    @inject(GameCamera)
    private camera: GameCamera;

    @inject(ChipStackNode)
    private chipStack: ChipStackNode;

    @inject(ChipsManager)
    private chipsManager: ChipsManager;

    @inject(StakeModel)
    private stakeModel: StakeModel;

    @inject(CardTextureCache)
    private cardsTextureCache: CardTextureCache;

    start() {
        this.camera.create();
        const light = new BABYLON.HemisphericLight("HemisphericLight", new Vector3(-5, 20, -5), this.scene);
        light.intensity = 1;

        const light2 = new BABYLON.HemisphericLight("HemisphericLight", new Vector3(-5, -20, -5), this.scene);
        light2.intensity = 1;

        (window as any).v_main = this;

        // this.chipStack = this.chipsManager.newStack(5.33);

        // window.document.addEventListener("click", this.onStageClick.bind(this));

        (async () => {
            await this.cardsTextureCache.preload("assets/cards-all.svg");
            await this.cardsTextureCache.generate(2);
            let dynamicTexture = this.cardsTextureCache.getRandom();

            const cube = MeshBuilder.CreateBox("box", {size: 0.5});

            const myMaterial = new StandardMaterial("Mat", this.scene);
            myMaterial.diffuseColor = Color3.White();
            myMaterial.diffuseTexture = dynamicTexture;
            myMaterial.opacityTexture = dynamicTexture;

            cube.material = myMaterial;
            this.scene.addMesh(cube);
        })();
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