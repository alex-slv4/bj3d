import { injectable } from "inversify";
import {Action} from "@core/actions/Action";
// import { TweenLite } from "gsap";

@injectable()
export class WaitAction extends Action<number> {

    async execute(ms: number): Promise<any> {
        // TODO: find smth better then setTimeout and/or external dependencies
        // await new Promise(resolve => {
        //     TweenLite.delayedCall(seconds, resolve);
        // });
        setTimeout(() => {
            super.execute(ms);
        }, ms);

    }
}
