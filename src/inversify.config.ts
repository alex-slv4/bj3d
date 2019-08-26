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

export const di = new Container();

decorate(injectable(), BABYLON.TransformNode);

di.bind(ChipsMeshPool).toSelf();
di.bind(ChipFactory).toSelf();
di.bind(ChipStackNode).toSelf();
di.bind(ChipsManager).toSelf().inSingletonScope();
di.bind(StakeModel).toSelf().inSingletonScope();
di.bind(CardTextureCache).toSelf().inSingletonScope();