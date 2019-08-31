/**
 * @author alexander.slavschik
 */
import {BetsHistory} from "@game/model/BetsHistory";
import {GlobalEventProvider} from "@core/events/GlobalEventProvider";
import {injectable} from "inversify";

@injectable()
export class BetModelBJ extends GlobalEventProvider {
    private _roundBalance: number = 0;
    private realBalance: number = 0;

    private TotalBet: number = 0;

    private _betsHistory: BetsHistory = new BetsHistory();

    get empty(): boolean {
        return this.TotalBet === 0;
    }

    get betsHistory(): BetsHistory {
        return this._betsHistory;
    }

    set totalBet(value: number) {
        this.TotalBet = value;
        this.changeState();
    }

    get totalBet(): number {
        return this.TotalBet;
    }

    save() {
        this.changeState();
    }

    syncBalance(): void {
        this._roundBalance = 0;
        // this.realBalance = this.contextModel.context.api.getBalance();
    }

    get roundBalance(): number {
        return this._roundBalance;
    }

    set roundBalance(value: number) {
        this._roundBalance = value;
    }

    changeState(): void {
        debugger
    }
    clear(): void {
        this.TotalBet = 0;
        this.betsHistory.clear();
        this.syncBalance();
        this.changeState();
    }
}
