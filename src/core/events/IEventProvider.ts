import { ListenerFn } from "eventemitter3";

export interface IEventProvider {
    destroy(): void;

    dispatch(eventName: string, data?: any): void;

    addListener(eventName: string, fn: ListenerFn): void;

    addListenerOnce(eventName: string, fn: ListenerFn): void;

    removeListener(eventName: string, fn: ListenerFn): void;

    removeListeners(eventName: string): void;

    removeAllListeners(): void;

    hasListeners(): boolean;
}
