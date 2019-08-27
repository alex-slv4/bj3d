import {Action} from "@core/actions/Action";

export class SequenceAction extends Action<Array<Action<any>>> {

    async execute(actions: Array<Action<any>>): Promise<any> {
        for (const action of actions) {
            await action.run();
        }
        this.resolve();
    }
}
