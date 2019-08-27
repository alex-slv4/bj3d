import { injectable } from "inversify";
import { GlobalEventProvider } from "../events/GlobalEventProvider";
import {log_trace} from "@core/log";

function invoke(callback: () => void): void {
    if (callback) {
        callback();
    }
}

@injectable()
export abstract class BaseAction<T = never> extends GlobalEventProvider {

    onFinish: () => void;
    onFailed: () => void;

    protected data?: T;
    protected _resolve: () => void;
    protected _reject: () => void;

    abstract async execute(commandData?: T): Promise<any>;

    async run(data?: T): Promise<any> {
        log_trace("data", data);
        this.data = data;
        try {
            await new Promise(async (resolve, reject) => {
                this._resolve = resolve;
                this._reject = reject;
                await this.execute(data);
            });
        } catch (e) {
            await this.failed(e);
        }

        this.finish();
    }

    async failed(reason: any): Promise<any> {
        invoke(this.onFailed);
    }

    destroy(): void {
        delete this.data;
        delete this._resolve;
        delete this._reject;
        delete this.onFinish;
        delete this.onFailed;
    }

    protected resolve() {
        invoke(this._resolve);
    }

    protected reject() {
        invoke(this._reject);
    }

    protected finish() {
        invoke(this.onFinish);
    }
}
