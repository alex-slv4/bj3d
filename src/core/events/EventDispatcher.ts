import { injectable } from "inversify";
import "reflect-metadata";
import { EventEmitter } from "eventemitter3";

@injectable()
export class EventDispatcher extends EventEmitter {

}
