import {BaseAction} from "@core/actions/BaseAction";

export class Action<T = never> extends BaseAction<T> {

    async execute(commandData?: T): Promise<any> {
        this.resolve();
    }

    async terminate(): Promise<any> {
        this.reject();
    }
}
