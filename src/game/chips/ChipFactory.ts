/**
 * @author alexander.slavschik
 */

import {di} from "../../inversify.config";
import {IChipView} from "@game/chips/IChipView";
import {inject, injectable} from "inversify";
import {StakeModel} from "@game/StakeModel";
import ChipsMeshPool from "@game/chips/ChipsMeshPool";
import Color3 = BABYLON.Color3;

export const enum ChipColor {
    BLUE,
    RED,
    GREEN,
    LIGHT_BLUE,
    PURPLE,
    ORANGE,
    BLACK,
    length,
}

@injectable()
export class ChipFactory {

    @inject(ChipsMeshPool)
    protected meshPool: ChipsMeshPool;

    dispose(chip: IChipView) {
        chip.mesh.dispose();
    }

    public get(value: number): IChipView {
        const view = this.meshPool.get(Color3.FromHexString(this.getColorHex(value)));
        return {
            amount: value,
            mesh: view,
        };
    }

    private getColorHex(value: number): string {
        const stakeModel: StakeModel = di.get(StakeModel);
        const valueIndex = stakeModel.recastChips.indexOf(value);
        const stakeDefIndex = stakeModel.recastChips.indexOf(stakeModel.chips[0]);
        let colorCode: number = valueIndex;
        if (valueIndex === -1) {
            colorCode = ChipColor.BLUE;
        } else {
            colorCode = this.getColorCodeByIndex(valueIndex, stakeDefIndex);
        }
        switch (colorCode) {
            case ChipColor.BLUE: return "#00143f";
            case ChipColor.RED: return "#ff0000";
            case ChipColor.GREEN: return "#42b336";
            case ChipColor.LIGHT_BLUE: return "#20beff";
            case ChipColor.PURPLE: return "#ff00ff";
            case ChipColor.ORANGE: return "#ff9900";
        }
        return "#000";
    }

    private getColorCodeByIndex(valueIndex: number, defIndex: number): number {
        const colorsLength: number = ChipColor.length;
        const offsetIndex: number = (valueIndex - defIndex) % colorsLength;
        if (offsetIndex >= 0) {
            return offsetIndex;
        } else {
            return offsetIndex + colorsLength;
        }

    }
    // private getValueString(value: number): string {
    //     let valueStr: string = "0";
    //
    //     const cm: ContentManager = inject(ContentManager);
    //     if (value < 1000) {
    //         valueStr = `${value}`;
    //     } else if (value < 1000000) {
    //         valueStr = `${value / 1000}${cm.i18n("TOOLTIP_K")}`;
    //     } else if (value < 1000000000) {
    //         valueStr = `${value / 1000000}${cm.i18n("TOOLTIP_M")}`;
    //     } else  {
    //         valueStr = `${value / 1000000000}${cm.i18n("TOOLTIP_B")}`;
    //     }
    //     return valueStr;
    // }
}
