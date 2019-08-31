import * as preact from "preact";
import {ClassAttributes, h} from "preact";
import {GameFlowManagerBJ} from "../managers/GameFlowManagerBJ";
import {di} from "../inversify.config";
import {CoreTypes} from "../CoreTypes";
import {ActionButtonState} from "./constants";

interface IRootContainerProps extends ClassAttributes<RootContainer> {
    ref?: any,
}

function hasFlag(flag: number, mask: number): boolean {
    return !!(mask & flag);
}

export class RootContainer extends preact.Component<IRootContainerProps, {}> {

    public buttonsMask: number = ActionButtonState.NONE;
    private gameFlow: GameFlowManagerBJ;

    componentWillMount(): void {
        this.gameFlow = di.get(CoreTypes.gameFlowManager);
    }

    render(props?: preact.RenderableProps<{}>, state?: Readonly<{}>, context?: any): preact.ComponentChild {
        return (<div style="font-size: x-large">
            <a href="#" class={this.getStylesWhen(ActionButtonState.UNDO)} onClick={() => this.gameFlow.undo()}>Undo</a><br/>
            <a href="#" class={this.getStylesWhen(ActionButtonState.REBET_DEAL)} onClick={() => this.gameFlow.rebetAndDeal()}>Rebet And Deal</a><br/>
            <a href="#" class={this.getStylesWhen(ActionButtonState.DOUBLE_DEAL)} onClick={() => this.gameFlow.doubleAndDeal()}>Double And Deal</a><br/>
            <a href="#" class={this.getStylesWhen(ActionButtonState.CLEAR)} onClick={() => this.gameFlow.clear()}>Clear</a><br/>
            <a href="#" class={this.getStylesWhen(ActionButtonState.HIT)} onClick={() => this.gameFlow.hit()}>Hit</a><br/>
            <a href="#" class={this.getStylesWhen(ActionButtonState.STAND)} onClick={() => this.gameFlow.stand()}>Stand</a><br/>
            <a href="#" class={this.getStylesWhen(ActionButtonState.DOUBLE)} onClick={() => this.gameFlow.double()}>Double</a><br/>
            <a href="#" class={this.getStylesWhen(ActionButtonState.SPLIT)} onClick={() => this.gameFlow.split()}>Split</a><br/>
            <a href="#" class={this.getStylesWhen(ActionButtonState.REBET)} onClick={() => this.gameFlow.rebet()}>Rebet</a><br/>
            <a href="#" class={this.getStylesWhen(ActionButtonState.DEAL)} onClick={() => this.gameFlow.deal()}>Deal</a><br/>

            <a href="#" class={this.getStylesWhen(ActionButtonState.YES)} onClick={() => this.gameFlow.insurance(true, false)}>Yes</a><br/>
            <a href="#" class={this.getStylesWhen(ActionButtonState.NO)} onClick={() => this.gameFlow.insurance(false, false)}>No</a><br/>
        </div>);
    }
    private getStylesWhen(flag: number): string {
        if (hasFlag(flag, this.buttonsMask)) {
            return ""
        }
        return "hidden"
    }
}