/**
 * @author alexander.slavschik
 */

import Vector2 = BABYLON.Vector2;

export const BlackJackConstants = {
    I18N: {
        INSURANCE: "INSURANCE",
        BLACKJACK: "BLACKJACK",
        CHARLIE: "CHARLIE",
        BUST: "BUST",
        PUSH: "PUSH"
    },
    MAX_RANK: 21,
    CHARLIE_CARDS_COUNT: 10,
    SPLIT_SCALE: 0.82,
    MAX_IN_ROW: 5,
    CARD_SIZE: new Vector2(272, 388), // card texture size
    CARDS_BETWEEN: new Vector2(46, 66),

    WARN_HIT_RANK: 17,
    WARN_STAND_RANK: 11,
    DEFAULT_PAYOUT_RATIO: 2,
    INSURANCE_BET_RATIO: 0.5,
    BJ_PAYOUT_RATIO: 2.5,
};