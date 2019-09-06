import {Action} from "@core/actions/Action";
import {inject, injectable} from "inversify";
import {CardTextureCache} from "@game/CardTextureCache";
import {Table3D} from "@game/Table3D";
import GameCamera from "@game/camera/GameCamera";

@injectable()
export class GameStartAction extends Action {

    @inject(CardTextureCache)
    private cardsTextureCache: CardTextureCache;

    @inject(Table3D)
    private table: Table3D;

    @inject(GameCamera)
    private gameCamera: GameCamera;

    // @inject(ChipsPanel)
    // private chipsPanel: ChipsPanel;

    async execute(): Promise<any> {

        await this.cardsTextureCache.preload("assets/cards-all-clean.svg");
        await this.cardsTextureCache.generate(2);

        this.table.init();
        // this.chipsPanel.init();
        // this.chipsPanel.scaling.scaleInPlace(0.6);
        // this.chipsPanel.setParent(this.gameCamera.camera);

        this.resolve();
    }
}