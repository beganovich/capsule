# Capsule
Lightweight TypeScript service container.

> Note: This is just quick preview of the documentation, not even alpha quality. For more detailed stuff, please check the tests as they contain more examples.

## Installation

### Deno
Capsule is built and tested for Deno. You can install it simply by importing:

```ts
import { container } from 'https://deno.land/x/capsule_sc/mod.ts';
```

## Usage
The idea behind Capsule is to have super declarative and explicit service container. Thanks to this approach we managed to create Capsule **without any reflection libraries.**

```ts
class UserRepository {
  username() {
    return "@capsule";
  }
}

class UserService {
  constructor(
    @Inject(UserRepository) public repo: UserRepository,
  ) {}
}
```

Now we can construct the `UserService` using `get`.

```ts
container.get<UserService>(UserService).repo.username();

// "@capsule"
```

### Binding to interfaces

In TypeScript interfaces are wiped during the compilation, so we can't use them as a values. As replacement, Capsule lets you bind using symbols. This is quite effective replacement for binds to interface. Let's see how it works.

The first part is as you would expect. Having a class that implements a interface.

```ts
interface Repository {
  username(): string;
}

class UserRepository implements Repository {
  username() {
    return "@capsule";
  }
}
```

Now, as identifier we use [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol).

```ts
const repositoryInterface = Symbol();
```

Let's bind a property and as identifier use `repositoryInterface`.

```ts
container.set(repository, UserService, () => new UserRepository(), {
  position: 0,
  property: "constructor",
});
```

... and instead of `@Inject` we make use of `@InjectSymbol`:

```ts
class UserService {
  constructor(
    @InjectSymbol(repository) public repo: Repository
  ) {}
}
```

Notice how type is interface, not specific class.

```ts
container.get<UserService>(UserService).repo.username();

// "@capsule"
```

## Licence
The MIT License (MIT). Please see [licence file](LICENSE) for more information.