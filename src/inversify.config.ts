import {Container, decorate, injectable} from "inversify";
import "reflect-metadata";
import "babylonjs";
import TransformNode = BABYLON.TransformNode;

export const di = new Container();

decorate(injectable(), TransformNode);