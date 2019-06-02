/**
 * @author alexander.slavschik
 */
import TransformNode = BABYLON.TransformNode;
import Vector3 = BABYLON.Vector3;
import Axis = BABYLON.Axis;
import Space = BABYLON.Space;
import {ChipStackConstants} from "@game/chips/constants";
import {IChipView} from "@game/chips/IChipView";
import {inject, injectable} from "inversify";
import {ChipFactory} from "@game/chips/ChipFactory";
import {fixfraction} from "@game/utils";
import {di} from "../../inversify.config";
import {View3D} from "@game/View3D";
import {DefaultChipStackSoundConfig, IChipStackSoundConfig} from "@game/sounds/constants";

function getShiftXZ(): number {
    const randDither = Math.random() * ChipStackConstants.ditherXZ * 2;
    return Math.round(randDither * 100) / 100;
}

@injectable()
export class ChipStackNode extends View3D {

    public soundConfig: IChipStackSoundConfig = DefaultChipStackSoundConfig;
    // public toolTip: TooltipBet;
    public chipsCont: TransformNode = new TransformNode("chips-stack-node");
    // private moneyUtils: MoneyFormatterUtils = inject(MoneyFormatterUtils);
    private positions: Vector3[] = [];
    protected chips: IChipView[] = [];
    protected _next: Vector3 = Vector3.Zero();
    protected _top: Vector3;

    @inject(ChipFactory)
    private chipFactory: ChipFactory;

    public create(...params: any): this {
        this.chipsCont.parent = this;
        // if (this.hasToolTip) {
        //     this.toolTip = PoolManager.pop("TooltipBet", TooltipBet);
        //     this.addChild(this.toolTip);
        //     this.toolTip.position.set(0, 60);
        //     this.updateToolTip();
        // }
        return this;
    }

    clear(updateToolTip: boolean = true): void {

        this.chipsCont.dispose();
        while (this.chips.length > 0) {
            this.chipFactory.dispose(this.chips.pop()!);
        }
        delete this._top;
        this._next = Vector3.Zero();
        this.positions = [];

        // if (updateToolTip) {
        //     this.updateToolTip();
        // }
        // this.destroy();
    }

    get top(): number {
        if (this._top) {
            return this._top.y;
        }
        return 0;
    }

    get next(): Vector3 {
        return this._next.clone();
    }

    get size(): number {
        return this.chips.length;
    }

    get total(): number {
        let total = 0;
        this.chips.forEach((item: IChipView) => {
            total += item.amount;
        });
        return fixfraction(total);
    }

    merge(stack: ChipStackNode): void {
        stack.chips.forEach((item: IChipView) => {
            // keep ditherXZ of merging stack
            this._next.x = item.mesh.position.x;
            this._next.z = item.mesh.position.z;
            this.push(item.amount);
        });
        // this.updateToolTip();
    }

    updateToolTip(): void {
        // if (this.hasToolTip) {
        //     this.toolTip.setText(this.moneyUtils.formatNumber(this.total, ChipStackConstants.tooltipTextConfig));
        //     this.toolTip.show(this.total > 0);
        // }
    }

    cloneStack(): ChipStackNode {
        const view: ChipStackNode = di.get(ChipStackNode);
        this.chips.forEach((item: IChipView, i: number) => {
            view.push(item.amount);
            const chipMesh = view.chips[i].mesh;
            chipMesh.position.copyFrom(item.mesh.position);
            if (item.mesh.rotationQuaternion && chipMesh.rotationQuaternion) {
                chipMesh.rotationQuaternion!.copyFrom(item.mesh.rotationQuaternion);
            }
        });
        view.position.copyFrom(this.position);
        view.scaling = this.scaling.clone();
        return view;
    }

    push(amount: number): IChipView {
        const chip: IChipView = this.chipFactory.get(amount);
        chip.mesh.position = this.next;
        chip.mesh.rotate(Axis.Y, Math.random() * Math.PI, Space.LOCAL);
        this.putUp();
        this.chips.push(chip);
        chip.mesh.parent = this.chipsCont;
        return chip;
    }

    shift(): IChipView {
        this.positions.shift();
        const chip: IChipView = this.chips.shift()!;
        this.removeChip(chip);
        return chip;
    }

    pop(): IChipView {
        this._next = this.positions.pop()!;
        this._top = this.positions[this.positions.length - 1];
        const chip: IChipView = this.chips.pop()!;
        this.removeChip(chip);
        return chip;
    }

    private removeChip(chip: IChipView): void {
        this._scene!.removeMesh(chip.mesh);
        // this.chipsCont.removeChild(chip.mesh);
    }

    putUp(): void {
        this.positions.push(this._next);
        this._top = this._next;
        this._next = this._top.clone();
        this._next.x = getShiftXZ();
        this._next.z = getShiftXZ();
        this._next.y += ChipStackConstants.ITEM_HEIGHT;
    }

    // getNextLocal(at: DisplayObject, stack?: ChipStackView): Point {
    //     const nextPoint: Point = (stack && stack.chips.length > 0) ? new Point(stack.chips[0].view.position.x, this._next.y) : this._next;
    //     const globalPoint: Point = this.toGlobal(nextPoint);
    //     if (at) {
    //         return at.toLocal(globalPoint);
    //     }
    //     return globalPoint;
    // }

    // public dispose(): void {
    //     // if (this.toolTip) {
    //     //     PoolManager.push("TooltipBet", this.toolTip);
    //     //     this.toolTip = null;
    //     // }
    //     super.dispose();
    // }

}
