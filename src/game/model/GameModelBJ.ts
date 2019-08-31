/**
 * @author alexander.slavschik
 */
import {DealerModel} from "./DealerModel";
import {BetModelBJ} from "./BetModelBJ";
import {inject, injectable} from "inversify";

@injectable()
export class GameModel {

    protected _roundEnded: boolean;
    protected _totalBet: number;
    protected _totalWin: number;
    protected _insufficientBalance: boolean = false;

    private roundsEnded: number = 0;
    private roundsPlayed: number = 0;
    private _roundPending: boolean = false;

    @inject(BetModelBJ)
    private betModel: BetModelBJ;
    @inject(DealerModel)
    private dealerHand: DealerModel;

    public winsCollected: boolean = true;

    // writeData(data: IServerResponseVO): void {
    //     super.writeData(data);
    //     if (data.dealer) {
    //         this.dealerHand.parseResponse(data.dealer);
    //     }
    // }
    get roundEnded(): boolean {
        return this._roundEnded;
    }
    get totalWin(): number {
        return this._totalWin;
    }
    get totalBet(): number {
        return this._totalBet;
    }
    get insufficientBalance(): boolean {
        return this._insufficientBalance;
    }
    get newRoundPending(): boolean {
        return this._roundPending;
    }

    startRound() {
        this._roundPending = false;
        this.winsCollected = false;
        this.betModel.syncBalance();
    }

    endRound() {
        this._roundPending = true;
        this.roundsPlayed++;
        // this.betModel.clear();
    }

}