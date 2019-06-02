/**
 * @author alexander.slavschik
 */
import {StakeModel} from "@game/StakeModel";
import {inject, injectable} from "inversify";
import {ChipStackNode} from "@game/chips/ChipStackNode";
import {ChipStackConstants} from "@game/chips/constants";
import {DefaultChipStackSoundConfig, IChipStackSoundConfig} from "@game/sounds/constants";
import {di} from "../../inversify.config";
import Scene = BABYLON.Scene;

@injectable()
export abstract class ChipsManager {

    // readonly screenPosition: PositionHelper = inject(ScreenPositionHelper);
    // readonly scenePosition: PositionHelper = inject(ScenePositionHelper);

    @inject(StakeModel)
    protected stakeModel: StakeModel;

    @inject(Scene)
    protected scene: Scene;

    // protected soundManager: SoundManager = inject(SoundManager);
    // protected activeTweens: TweenLite[] = [];

    // flyOutStack(stack: ChipStackNode, endPointGlobal: Point, clear: boolean = true): Promise<any> {
    //     if (stack.size === 0) {
    //         return Promise.resolve();
    //     }
    //     const flyingStack: ChipStackNode = stack.clone();
    //     const flyPosition: Point = this.animContainer.toLocal(stack.position, stack.parent);
    //     flyingStack.position.copy(flyPosition);
    //     if (clear) {
    //         stack.clear();
    //     }
    //     this.playOutSound();
    //     this.animContainer.addChild(flyingStack);
    //     TweenLite.to(flyingStack, ChipsConstant.flyAnimationTime * 0.25, {
    //         alpha: 0,
    //         ease: Power1.easeOut,
    //         delay: ChipsConstant.flyAnimationTime * 0.5,
    //     });
    //     return this.bezier(flyingStack, flyingStack.position as Point, this.animContainer.toLocal(endPointGlobal)).then(() => {
    //         this.animContainer.removeChild(flyingStack);
    //         flyingStack.destroy();
    //     });
    // }
    //
    // flyAmountToStack(fromGlobal: Point, amount: number, stack: ChipStackNode, middleGlobal?: Point): Promise<any> {
    //     if (amount === 0) {
    //         return Promise.resolve();
    //     }
    //     const newStack: ChipStackNode = this.newStack(amount);
    //     newStack.position.copy(this.animContainer.toLocal(fromGlobal));
    //     newStack.alpha = 0;
    //     TweenLite.to(newStack.scale, ChipsConstant.flyAnimationTime, {
    //         x: stack.scale.x,
    //         y: stack.scale.y,
    //         ease: Power1.easeInOut
    //     });
    //     TweenLite.to(newStack, ChipsConstant.flyAnimationTime * 0.25, {alpha: stack.alpha, ease: Power1.easeOut});
    //     return this.flyStackToStack(newStack, stack, middleGlobal);
    // }
    //
    // flyStackToStack(fromStack: ChipStackNode, stack: ChipStackNode, middleGlobal?: Point): Promise<any> {
    //     if (fromStack.size === 0) {
    //         return Promise.resolve();
    //     }
    //     const flyMiddlePoint: Point = middleGlobal ? this.animContainer.toLocal(middleGlobal) : null;
    //     const flyToPoint: Point = stack.getNextLocal(this.animContainer, fromStack);
    //     const flyingStack: ChipStackNode = fromStack.clone();
    //     if (fromStack.parent) {
    //         flyingStack.position = this.animContainer.toLocal(fromStack.position, fromStack.parent);
    //     }
    //     this.animContainer.addChild(flyingStack);
    //     fromStack.clear();
    //     TweenLite.to(flyingStack.scale, ChipsConstant.flyAnimationTime, {
    //         x: stack.scale.x,
    //         y: stack.scale.y,
    //         ease: Power1.easeInOut
    //     });
    //     return this.bezier(flyingStack, flyingStack.position as Point, flyToPoint, flyMiddlePoint)
    //         .then(() => {
    //             this.dropToStack(flyingStack, stack);
    //             this.animContainer.removeChild(flyingStack);
    //             flyingStack.destroy();
    //             return Promise.resolve();
    //         });
    // }
    //
    // dropToStack(flyingStack: ChipStackNode, stack: ChipStackNode): void {
    //     this.playLandingSound(stack);
    //     stack.merge(flyingStack);
    //     flyingStack.clear();
    // }

    async shuffle(stack: ChipStackNode, values: number[]): Promise<any> {
        const origStackTop: number = stack.top;
        stack.clear(false);

        const totalFrames = 60;
        const framesPerItem = totalFrames / (values.length + 1);

        values.forEach(async (amount: number, i: number) => {
            const itemShiftDown = ChipStackConstants.ITEM_HEIGHT * (values.length - i - 1);
            const flyFromY: number = origStackTop + itemShiftDown;
            const chip = stack.push(amount);
            const delay = i * ChipStackConstants.recast.DELAY;

            const anim = new BABYLON.Animation(`shuffle-item-${i}`, "position.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT);

            const firstFrame = {
                frame: framesPerItem * (i + 1),
                value: flyFromY,
            };
            const lastFrame = {
                frame: firstFrame.frame + (values.length - i) * framesPerItem,
                value: stack.top,
            };
            anim.setKeys([firstFrame, lastFrame]);
            chip.mesh.animations = [anim];

            if (i !== values.length - 1) {
                this.scene.beginAnimation(chip.mesh, 0, lastFrame.frame);
            } else {
                // the last one animation, wait for its completion
                await new Promise(resolve => {
                    this.scene.beginAnimation(chip.mesh, 0, lastFrame.frame, false, 1, () => resolve());
                });
            }
        });
        // const totalTime: number = ChipStackConstants.recast.DELAY * values.length + ChipStackConstants.recast.FALL;
        stack.updateToolTip();
    }

    async recast(stack: ChipStackNode, silent: boolean = false): Promise<any> {
        if (stack.total > 0) {
            const recasted: number[] = this.stakeModel.getValuesFromAmount(stack.total);
            if (recasted.length !== stack.size) {
                this.playRecastSound(recasted.length, stack, silent);
                await this.shuffle(stack, recasted);
            }
        }
    }

    newStack(total: number): ChipStackNode {
        const stackView: ChipStackNode = di.get(ChipStackNode);
        const values: number[] = this.stakeModel.getValuesFromAmount(total);
        values.forEach(amount => stackView.push(amount));
        return stackView;
    }

    // protected bezier(object: DisplayObject, from: Point, to: Point, middle?: Point): Promise<any> {
    //     return new Promise((resolve) => {
    //         middle = middle || new Point((from.x + to.x) * 0.5, from.y);
    //         const tween = TweenLite.fromTo(object.position, ChipsConstant.flyAnimationTime, {x: from.x, y: from.y}, {
    //             bezier: {
    //                 type: "soft",
    //                 values: [{x: middle.x, y: middle.y}, {x: to.x, y: to.y}]
    //             }, ease: Power1.easeInOut,
    //             onComplete: () => onCompleteFn()
    //         });
    //         const onCompleteFn = () => {
    //             const index: number = this.activeTweens.indexOf(tween);
    //             if (index !== -1) {
    //                 this.activeTweens.splice(index, 1);
    //             }
    //             resolve();
    //         };
    //         this.activeTweens.push(tween);
    //     });
    // }
    // clearAnimations() {
    //     while (this.activeTweens.length) {
    //         const tween: TweenLite = this.activeTweens.pop();
    //         tween.kill();
    //     }
    //     this.animContainer.removeChildren();
    // }
    protected playOutSound(): void {
        //
    }

    protected playRecastSound(size: number, stack?: ChipStackNode, silent: boolean = false): void {
    //     const config: IChipStackSoundConfig = stack ? stack.soundConfig : DefaultChipStackSoundConfig;
    //
    //     const playSoundFn: Function = this.soundManager.playSound.bind(this.soundManager);
    //
    //     let soundName: string;
    //     let seconds: number;
    //     let tid: number;
    //
    //     for (let i: number = 0; i < size; i++) {
    //         if (i === 0) {
    //             if (silent) {
    //                 soundName = size === 1 ? config.onStack : null;
    //             } else {
    //                 soundName = config.onFloor;
    //             }
    //         } else {
    //             soundName = config.onStack;
    //         }
    //
    //         if (soundName) {
    //             seconds = ChipStackConstants.recast.DELAY * i + ChipStackConstants.recast.FALL;
    //             tid = setTimeout(playSoundFn, seconds * 1000, soundName);
    //         }
    //     }
    }
    //
    // /**
    //  * deprecated
    //  */
    // protected playRecastSoundWithConfig(count: number, config: IChipStackSoundConfig): void {
    //     const playSoundFn: Function = this.soundManager.playSound.bind(this.soundManager);
    //     for (let i: number = 0; i < count; i++) {
    //         const soundName: string = i > 0 ? config.onStack : config.onFloor;
    //         const seconds: number = ChipStackConstants.recast.DELAY * i + ChipStackConstants.recast.FALL;
    //         const tid: number = setTimeout(playSoundFn, seconds * 1000, soundName);
    //     }
    // }
    //
    // playLandingSound(stack: ChipStackNode): void {
    //     let soundName: string = stack.soundConfig.onStack;
    //     if (stack.size === 0) {
    //         soundName = stack.soundConfig.onFloor;
    //     }
    //     this.soundManager.playSound(soundName);
    // }
    //
    // protected abstract get animContainer(): Container;

}
