import { container } from "../container.ts";

export const Inject = (target: Function) => {
  return (
    service: Object | Function,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) => {
    const callable = typeof service === "object"
      ? service.constructor
      : service;

    container.set(callable, callable, (self) => self.get(target), {
      position: parameterIndex,
      property: propertyKey || "constructor",
    });
  };
};
