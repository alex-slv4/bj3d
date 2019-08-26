import {Container, decorate, injectable} from "inversify";
import "reflect-metadata";
import "babylonjs";
import "babylonjs-inspector";
import ChipsMeshPool from "@game/chips/ChipsMeshPool";
import {ChipFactory} from "@game/chips/ChipFactory";
import {ChipStackNode} from "@game/chips/ChipStackNode";
import {StakeModel} from "@game/StakeModel";
import {ChipsManager} from "@game/chips/ChipsManager";
import {CardTextureCache} from "@game/CardTextureCache";
import {Card3D} from "@game/cards/Card3D";
import {CoreTypes} from "./CoreTypes";

export const di = new Container();

decorate(injectable(), BABYLON.TransformNode);

di.bind(ChipsMeshPool).toSelf();
di.bind(ChipFactory).toSelf();
di.bind(ChipStackNode).toSelf();
di.bind(Card3D).toSelf();

di.bind(ChipsManager).toSelf().inSingletonScope();
di.bind(StakeModel).toSelf().inSingletonScope();
di.bind(CardTextureCache).toSelf().inSingletonScope();

di.bind(CoreTypes.debug.fpsMeter).toDynamicValue(() => {
    return new FPSMeter(document.getElementById("fps-meter") as HTMLElement, {
        theme: "transparent",
        heat: 20,
        graph: 1,
        history: 20,
        zIndex: 100,
        top: "60px",
    });
}).inSingletonScope();