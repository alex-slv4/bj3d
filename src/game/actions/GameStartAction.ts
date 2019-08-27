import {Action} from "@core/actions/Action";
import {inject, injectable} from "inversify";
import {CardTextureCache} from "@game/CardTextureCache";
import {Table3D} from "@game/Table3D";

@injectable()
export class GameStartAction extends Action {

    @inject(CardTextureCache)
    private cardsTextureCache: CardTextureCache;

    @inject(Table3D)
    private table: Table3D;

    async execute(): Promise<any> {

        await this.cardsTextureCache.preload("assets/cards-all.svg");
        await this.cardsTextureCache.generate(5);

        this.table.init();

        this.resolve();
    }
}