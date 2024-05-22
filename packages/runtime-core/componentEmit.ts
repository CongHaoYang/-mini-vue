import { toHandlerKey } from "shared";

export function emit(instance, event, ...args) {
    console.log("event", event);

    // instance.props -> event
    const { props } = instance;

    const handlerName = toHandlerKey(event);
    const handler = props[handlerName];
    handler && handler(...args);
    // TPP
    // 先写一个特定的行为 -》重构成通用的行为 
}