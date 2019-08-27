import {Action} from "@core/actions/Action";

export class LazyAction extends Action {

    constructor(protected callback: () => any) {
        super();
    }

    async execute(): Promise<any> {
        const callbackResult: any = this.callback();
        if (callbackResult instanceof Promise) {
            await callbackResult;
        }
        this.resolve();
    }
}
