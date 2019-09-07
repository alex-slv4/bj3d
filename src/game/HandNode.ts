import {View3D} from "@game/View3D";
import {injectable} from "inversify";
import {Card3D} from "@game/cards/Card3D";
import {Vector3} from "@babylonjs/core";
import {Metrics} from "@game/Metrics";

@injectable()
export class HandNode extends View3D {

    private _cardsCount: number = 0;
    private nextPosition: Vector3 = Vector3.Zero();

    public addCard(card: Card3D) {
        card.parent = this;
        card.position.copyFrom(this.nextPosition);

        this._cardsCount++;
        this.nextPosition.x = this._cardsCount * (Metrics.CARD_WIDTH / 5);
        this.nextPosition.z = this._cardsCount * (Metrics.CARD_HEIGHT / 5);
        this.nextPosition.y = this._cardsCount * Metrics.CARD_DEPTH;
    }

    init(...params: any): this {

        return this;
    }
}