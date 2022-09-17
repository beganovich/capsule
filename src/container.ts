type ProviderIdentifier = Symbol | Function;

interface Provider {
  identifier: ProviderIdentifier;
  target: Function;
  property: string | Symbol;
  position: number;
  callback: (container: Container) => unknown;
}

interface ProviderOptions {
  property: string | Symbol;
  position: number;
}

export class Container {
  #arguments: Provider[] = [];

  set(
    identifier: ProviderIdentifier,
    target: Function,
    callback: (container: Container) => unknown,
    options: ProviderOptions,
  ): Container {
    if (options.position < 0) {
      throw new Error(
        `Argument index can only be positive number. Trying to set [${options.position}].`,
      );
    }

    this.#arguments.push({ identifier, target, callback, ...options });

    return this;
  }

  get<T = unknown>(identifier: ProviderIdentifier, property = "constructor") {
    const constructorArgs = this.#arguments.filter((provider) =>
      provider.identifier === identifier || provider.target === identifier
    );

    const target = constructorArgs.length === 0
      ? identifier
      : constructorArgs[0].target;

    const classArgs: unknown[] = [];

    constructorArgs
      .filter((arg) => arg.property === "constructor")
      .sort((a, b) => a.position > b.position ? 1 : -1)
      .filter((arg, index, self) =>
        index === self.findIndex((prop) => (
          prop.position === arg.position
        ))
      )
      .map((arg) => classArgs.push(arg.callback(this)));

    const object = Reflect.construct(target as Function, classArgs);

    if (property === "constructor") {
      return object as T;
    }

    const args: unknown[] = [];

    constructorArgs
      .filter((arg) => arg.property === property)
      .sort((a, b) => a.position > b.position ? 1 : -1)
      .filter((arg, index, self) =>
        index === self.findIndex((prop) => (
          prop.position === arg.position
        ))
      )
      .map((arg) => args.push(arg.callback(this)));

    return object[property](...args) as T;
  }

  flush(): Container {
    this.#arguments = [];

    return this;
  }
}

export const container = new Container();
