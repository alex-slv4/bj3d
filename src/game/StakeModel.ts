/**
 * @author alexander.slavschik
 */
import {injectable} from "inversify";
import {fixfraction} from "@game/utils";

@injectable()
export class StakeModel {

    // protected _stakeCurrent: number;
    protected _stakeDefault: number;
    protected _stakeMax: number;
    protected _stakeMin: number;
    protected _chips: number[] = [1, 2, 3, 4, 5, 6];
    public recastChips: number[];

    private _selectedStakeIndex: number;
    private _initialized: boolean = false;

    constructor() {
        this.updateRecastChips();
    }

    private setChips(chips: number[]): void {
        if (chips) {
            this._chips = chips;
            this.updateRecastChips();
        }
    }

    public get chips(): number[] {
        return this.recastChips;
    }

    getAvailableChips(): number[] {
        const availableChips: number[] = this._chips.concat([]);
        availableChips.sort((a, b) => a - b);
        return availableChips;
    }

    get stakeDefault(): number {
        return this._stakeDefault;
    }

    get stakeMax(): number {
        return this._stakeMax;
    }

    get stakeMin(): number {
        return this._stakeMin;
    }

    get initialized(): boolean {
        return this._initialized;
    }

    getValuesFromAmount(amount: number): number[] {
        const values: number[] = [];
        const stakeChips: number[] = this.recastChips;
        for (let i: number = stakeChips.length - 1; i >= 0 && amount > 0; i--) {
            const value: number = stakeChips[i];
            while (value <= amount) {
                values.push(value);
                amount = fixfraction(amount - value);
            }
        }
        return values;
    }

    get selectedStake(): number {
        return this._chips[this.selectedStakeIndex];
    }

    getSelectedStake(index: number): number {
        return this._chips[index];
    }

    get selectedStakeIndex(): number {
        return this._selectedStakeIndex;
    }

    selectStake(index: number): void {
        this._selectedStakeIndex = index;
    }

    private updateRecastChips() {
        this.recastChips = this._chips.concat([]);
        let startValue: number;
        const max: number = this._chips[this._chips.length - 1] * 2;
        for (startValue = 1; startValue < max; startValue *= 10) {
            if (startValue * 2.5 > max) {
                this.recastChips.push(startValue * 2);
            }
            if (startValue * 5 > max) {
                this.recastChips.push(startValue * 5);
            }
        }

        for (let i: number = startValue; i < startValue * 100; i *= 10) {
            this.recastChips.push(i);
            this.recastChips.push(i * 2);
            this.recastChips.push(i * 5);
        }

        // Small stakes
        startValue = this._chips[0];
        const minValue: number = 0.01;
        const minStakes: number[] = [];
        const dividers: number[] = [2, 2.5, 5];

        while (startValue > minValue) {
            let res: number;
            for (const divider of dividers) {
                res = Math.round((startValue / divider) * 100) / 100;
                if (res >= minValue) {
                    if (!(minStakes.indexOf(res) + 1)) {
                        minStakes.push(res);
                    }
                } else {
                    break;
                }
            }
            // @ts-ignore
            startValue = res;
        }
        minStakes.sort((a, b) => a - b);

        this.recastChips = minStakes.concat(this.recastChips);

    }
    // parseResponse(response: IServerResponseVO): void {
    //     this.writeData(response);
    //
    //     if (response.previousResult) {
    //         this._previousResult = response.previousResult;
    //         this.writePreviousResult(response);
    //     } else {
    //         this._previousResult = null;
    //     }
    // }
    //
    // private writePreviousResult(response: IServerResponseVO): void {
    //     const settings: IGameSettings = response.settings;
    //     const selectedLimits: IBetLimit = settings[response.previousResult.room];
    //     this.writeSettings(selectedLimits);
    // }
    //
    // private writeSettings(settings: IBetLimit): void {
    //     if (settings) {
    //         this._stakeMin = settings.stakeMin;
    //         this._stakeMax = settings.stakeMax;
    //         this._stakeDefault = settings.stakeDef;
    //
    //         this.setChips(settings.stakeAll);
    //         this._stakeCurrent = this.stakeDefault;
    //         if (!!this._chips) {
    //             this._selectedStakeIndex = Math.max(0, this._chips.indexOf(this._stakeDefault));
    //             this._initialized = true;
    //             this.dispatcher.dispatch(StakeModelEvent.INIT);
    //         }
    //     }
    // }
    //
    // private writeData(response: IServerResponseVO): void {
    //     const settings: IGameSettings = response.settings;
    //     this.writeSettings(settings);
    // }
}
