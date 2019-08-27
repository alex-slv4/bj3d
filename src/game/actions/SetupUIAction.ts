import {Action} from "@core/actions/Action";
import {inject, injectable} from "inversify";
import {UILayer} from "../../ui/UILayer";

@injectable()
export class SetupUIAction extends Action {

    @inject(UILayer)
    protected uiLayer: UILayer;

    async execute(): Promise<any> {

        this.uiLayer.init();

        this.resolve();
    }
}