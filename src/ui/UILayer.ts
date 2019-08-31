import {injectable} from "inversify";
import {h, render} from "preact";
import {RootContainer} from "./RootContainer";
import {GlobalEventProvider} from "@core/events/GlobalEventProvider";

@injectable()
export class UILayer extends GlobalEventProvider {

    public root: RootContainer;

    public init(): void {
        render(h(RootContainer, {
            ref: (ref: RootContainer) => this.root = ref,
        }), document.getElementById("ui") as HTMLElement);
    }

    applyState(mask: number) {
        this.root.buttonsMask = mask;
        this.root.forceUpdate()
    }
}