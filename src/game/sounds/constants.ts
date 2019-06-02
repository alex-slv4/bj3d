export const GameSoundsModuleConstants = {
    result: {
        WIN: "WIN",
    },
    bet: {
        PLACE: "BET_PLACE",
    },
    cards: {
        REMOVED: "CARD_REMOVED",
        FLIPPING: "CARD_FLIPPING",
        DEALING: "CARD_DEALING",
        CARD_ON_TABLE: "CARD_ON_TABLE",
    },
    chips: {
        RECAST: "CHIP_RECAST",
        REMOVED: "CHIP_REMOVED",
        ON_CHIP: "CHIP_ON_CHIP",
        ON_TABLE: "CHIP_ON_TABLE",
        ON_STACK: "CHIP_ON_STACK",
        ON_BORDER: "CHIP_ON_BORDER",
        ON_BORDER_STACK: "CHIP_ON_BORDER_STACK",
    },
    stack: {
        SELECTION: "STACK_SELECTION",
        SLIDE: "STACK_SLIDE",
    },
    sounds: {
        AMBIENT_SOUND_PATTERN: "AMBIENT_{type}",
        REGULAR_WIN_TURBO: "REGULAR_WIN_TURBO",
    },
    voiceOver: {
        WELCOME: "VO_WELCOME",
    },
};

export const GameSoundsValuemConstants = {
    SELECTION: 0.15,
};

export interface IChipStackSoundConfig {
    onChip: string
    onStack: string
    onFloor: string
}
export const DefaultChipStackSoundConfig: IChipStackSoundConfig = {
    onChip: GameSoundsModuleConstants.chips.ON_CHIP,
    onStack: GameSoundsModuleConstants.chips.ON_STACK,
    onFloor: GameSoundsModuleConstants.chips.ON_TABLE,
};
export const BorderChipStackSoundConfig: IChipStackSoundConfig = {
    onChip: GameSoundsModuleConstants.chips.ON_CHIP,
    onStack: GameSoundsModuleConstants.chips.ON_BORDER_STACK,
    onFloor: GameSoundsModuleConstants.chips.ON_BORDER,
};
