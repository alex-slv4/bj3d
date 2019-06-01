/**
 * @author alexander.slavschik
 */
import TransformNode = BABYLON.TransformNode;
import Vector2 = BABYLON.Vector2;
import Vector3 = BABYLON.Vector3;
import {ChipStackConstants} from "@game/chips/constants";
import {IChipView} from "@game/chips/IChipView";
import {inject, injectable} from "inversify";
import {ChipFactory} from "@game/chips/ChipFactory";
import {fixfraction} from "@game/utils";
import {di} from "../../inversify.config";
import {View3D} from "@game/View3D";
import Axis = BABYLON.Axis;
import Space = BABYLON.Space;

function getShiftX(): number {
    return Math.round(Math.random() * ChipStackConstants.ditherXZ * 2) - ChipStackConstants.ditherXZ;
}

@injectable()
export class ChipStackNode extends View3D {

    // public soundConfig: ChipStackSoundConfig = DefaultChipStackSoundConfig;
    // public toolTip: TooltipBet;
    public chipsCont: TransformNode = new TransformNode("chips-stack-node");
    // private moneyUtils: MoneyFormatterUtils = inject(MoneyFormatterUtils);
    private positions: Vector2[] = [];
    protected chips: IChipView[] = [];
    protected _next: Vector2 = Vector2.Zero();
    protected _top: Vector2;

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
        this._next = Vector2.Zero();
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

    get next(): Vector2 {
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
            this.push(item.amount);
        });
        // this.updateToolTip();
    }

    // updateToolTip(): void {
    //     if (this.hasToolTip) {
    //         this.toolTip.setText(this.moneyUtils.formatNumber(this.total, ChipStackConstants.tooltipTextConfig));
    //         this.toolTip.show(this.total > 0);
    //     }
    // }

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
        chip.mesh.position = new Vector3(this.next.x, this.next.y, 0);
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
        this._next = this.positions.pop() as Vector2;
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
        this._next.x = getShiftX();
        this._next.y -= ChipStackConstants.ITEM_HEIGHT;
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
