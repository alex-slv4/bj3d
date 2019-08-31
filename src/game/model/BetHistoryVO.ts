export class BetHistoryVO {

    static readonly TYPE_BET: number = 1;
    static readonly TYPE_CLEAR: number = 2;

    bets: number[] = [];
    hands: string[] = [];

    constructor(public type: number) {

    }

}