import {Action} from "@core/actions/Action";
import {inject, injectable} from "inversify";
import {CardTextureCache} from "@game/CardTextureCache";
import {Table3D} from "@game/Table3D";
import {ChipsPanel} from "@game/chips/ChipsPanel";

@injectable()
export class GameStartAction extends Action {

    @inject(CardTextureCache)
    private cardsTextureCache: CardTextureCache;

    @inject(Table3D)
    private table: Table3D;

    @inject(ChipsPanel)
    private chipsPanel: ChipsPanel;

    async execute(): Promise<any> {

        await this.cardsTextureCache.preload("assets/cards-all.svg");
        await this.cardsTextureCache.generate(2);

        this.table.init();
        this.chipsPanel.init();

        this.resolve();
    }
}