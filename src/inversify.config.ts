import {Container, decorate, injectable} from "inversify";
import "reflect-metadata";
import "babylonjs";
import ChipsPool from "@game/ChipsPool";

export const di = new Container();

decorate(injectable(), BABYLON.TransformNode);

di.bind(ChipsPool).toSelf();