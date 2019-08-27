import {Action} from "@core/actions/Action";

export class ParallelAction extends Action<Array<Action<any>>> {

    async execute(actions: Array<Action<any>>): Promise<any> {
        const promises: Array<Promise<Action<any>>> = [];
        for (const action of actions) {
            promises.push(action.run());
        }
        await Promise.all(promises);
        this.resolve();
    }

}
