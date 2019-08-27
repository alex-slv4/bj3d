import {injectable} from "inversify";
import {h, render} from "preact";
import {RootContainer} from "./RootContainer";

@injectable()
export class UILayer {

    public root: RootContainer;

    public init(): void {
        render(h(RootContainer, {
            ref: (ref: RootContainer) => this.root = ref,
        }), document.getElementById("ui") as HTMLElement);
    }
}