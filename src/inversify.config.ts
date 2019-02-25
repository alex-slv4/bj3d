import {Container, decorate, injectable} from "inversify";
import "reflect-metadata";
import "babylonjs";

export const di = new Container();

decorate(injectable(), BABYLON.TransformNode);