import {injectable} from "inversify";
import {Deck} from "@game/model/blackjackcore/Deck";

// TODO: rename to backend
@injectable()
export class BlackjackCore {
    public deck: Deck = new Deck();
}