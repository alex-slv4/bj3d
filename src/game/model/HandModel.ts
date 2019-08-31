/**
 * @author alexander.slavschik
 */
import {log_trace} from "@core/log";
import {ICard} from "@game/model/ICard";
import {injectable} from "inversify";

@injectable()
export class HandModel {

    protected _cardList: ICard[] = [];
    protected _id: string;

    get cardList(): ICard[] {
        return this._cardList.concat([]);
    }

    get id(): string {
        return this._id;
    }

    // parseResponse(hand: any): void {
    //     this._id = hand.id;
    //     this._cardList = hand.cardList.map((item: any) => Card.fromData(item));
    // }

    dump(title: string = "", msg: string = ""): void {
        const cardsStr: string[] = this.cardList.map((item: ICard) => item.toString());
        const str = cardsStr.join(" ");
        log_trace(title, `(${str}) ${msg}`);
    }
}
