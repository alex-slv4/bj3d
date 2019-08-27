import * as preact from "preact";
import {ClassAttributes, h} from "preact";
import {GameFlowManagerBJ} from "../managers/GameFlowManagerBJ";
import {di} from "../inversify.config";
import {CoreTypes} from "../CoreTypes";

interface IRootContainerProps extends ClassAttributes<RootContainer> {
    ref?: any,
}

export class RootContainer extends preact.Component<IRootContainerProps, {}> {

    private gameFlow: GameFlowManagerBJ;

    componentWillMount(): void {
        this.gameFlow = di.get(CoreTypes.gameFlowManager);
    }

    render(props?: preact.RenderableProps<{}>, state?: Readonly<{}>, context?: any): preact.ComponentChild {
        return (<div style="font-size: x-large">
            <a href="#" onClick={() => this.gameFlow.undo()}>Undo</a><br/>
            <a href="#" onClick={() => this.gameFlow.rebetAndDeal()}>Rebet And Deal</a><br/>
            <a href="#" onClick={() => this.gameFlow.doubleAndDeal()}>Double And Deal</a><br/>
            <a href="#" onClick={() => this.gameFlow.clear()}>Clear</a><br/>
            <a href="#" onClick={() => this.gameFlow.hit()}>Hit</a><br/>
            <a href="#" onClick={() => this.gameFlow.stand()}>Stand</a><br/>
            <a href="#" onClick={() => this.gameFlow.double()}>Double</a><br/>
            <a href="#" onClick={() => this.gameFlow.split()}>Split</a><br/>
            <a href="#" onClick={() => this.gameFlow.rebet()}>Rebet</a><br/>
            <a href="#" onClick={() => this.gameFlow.deal()}>Deal</a><br/>

            <a href="#" onClick={() => this.gameFlow.insurance(true, false)}>Yes</a><br/>
            <a href="#" onClick={() => this.gameFlow.insurance(false, false)}>No</a><br/>
        </div>);
    }
}