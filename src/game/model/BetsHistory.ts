import {BetHistoryVO} from "./BetHistoryVO";

export class BetsHistory {

    private _arr: BetHistoryVO[] = [];

    constructor() {

    }

    public push(vo: BetHistoryVO): BetHistoryVO {
        this._arr.push(vo);
        return vo;
    }

    public pop(): BetHistoryVO {
        return this._arr.pop()!;
    }

    public get length(): number {
        return this._arr.length;
    }

    public clear(): void {
        this._arr = [];
    }

    get enabled(): boolean {
        return this._arr.length > 0;
    }

}