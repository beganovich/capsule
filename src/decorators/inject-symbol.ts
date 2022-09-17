import { Container, container as defaultContainer } from "../container.ts";

export const InjectSymbol = (target: Symbol, container?: Container) => {
  return (
    service: Object | Function,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) => {
    const callable = typeof service === "object"
      ? service.constructor
      : service;

    const c = container ?? defaultContainer;

    c.set(target, callable, (self) => self.get(target), {
      position: parameterIndex,
      property: propertyKey || "constructor",
    });
  };
};
