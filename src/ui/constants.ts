/**
 * @author alexander.slavschik
 */
export const UIModuleConstants = {
    layout: {
        actionButtons: "buttons",
        table: "table",
        card_place: "card_place",
        place: "cardStack",
        place1: "place_1",
        place2: "place_2"
    }
};

export const ActionButtonEvent = {
    NO: "Action.NO_CLICK",
    NO_TO_ALL: "Action.NO_TO_ALL_CLICK",
    YES: "Action.YES_CLICK",
    YES_TO_ALL: "Action.YES_TO_ALL_CLICK",
    REBET_DEAL: "Action.REBET_DEAL_CLICK",
    DOUBLE_AND_DEAL: "Action.DOUBLE_AND_DEAL_CLICK",
    DEAL: "Action.DEAL_CLICK",
    CLEAR: "Action.CLEAR_CLICK",
    UNDO: "Action.UNDO_CLICK",
    REBET: "Action.REBET_CLICK",
    DOUBLE: "Action.DOUBLE_CLICK",
    HIT: "Action.HIT_CLICK",
    STAND: "Action.STAND_CLICK",
    SPLIT: "Action.SPLIT_CLICK"
};

export enum ActionButtonState {
    NONE = 0,                // 000000000000000
    YES = 1 << 0,            // 000000000000001
    YES_TO_ALL = 1 << 1,     // 000000000000010
    NO = 1 << 2,             // 000000000000100
    NO_TO_ALL = 1 << 3,      // 000000000001000
    DEAL = 1 << 4,           // 000000000010000
    DOUBLE = 1 << 5,         // 000000000100000
    SPLIT = 1 << 6,          // 000000001000000
    REBET = 1 << 7,          // 000000010000000
    REBET_DEAL = 1 << 8,     // 000000100000000
    CLEAR = 1 << 9,          // 000001000000000
    UNDO = 1 << 10,          // 000010000000000
    HIT = 1 << 11,           // 000100000000000
    STAND = 1 << 12,         // 001000000000000
    ANYWHERE = 1 << 13,      // 010000000000000
    DOUBLE_DEAL = 1 << 14,    // 100000000000000

    REBET_GROUP = ActionButtonState.DOUBLE_DEAL | ActionButtonState.REBET_DEAL | ActionButtonState.REBET,
    YES_NO_GROUP = ActionButtonState.YES | ActionButtonState.NO,
    YES_NO_ALL_GROUP = ActionButtonState.YES_TO_ALL | ActionButtonState.NO_TO_ALL,
}
