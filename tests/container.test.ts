import { Container } from "../mod.ts";
import { assertEquals } from "../deps.ts";
import { assertIsError } from "https://deno.land/std@0.156.0/testing/asserts.ts";

const container = new Container();

Deno.test("providing arguments manually", () => {
  class UserRepository {
    get() {
      return [
        { id: 1, username: "foo" },
        { id: 2, username: "bar" },
      ];
    }
  }

  class UserService {
    constructor(public repoistory: UserRepository) {}
  }

  container.set(UserService, UserService, () => new UserRepository(), {
    position: 0,
    property: "constructor",
  });

  const userService = container.get<UserService>(UserService);

  assertEquals(userService.repoistory instanceof UserRepository, true);
  assertEquals(userService.repoistory.get()[0].username, "foo");
  assertEquals(userService.repoistory.get()[1].username, "bar");
});

Deno.test("providing primitive types", () => {
  class UserService {
    constructor(public id: string) {}
  }

  container.set(UserService, UserService, () => "@id", {
    position: 0,
    property: "constructor",
  });

  const userService = container.get<UserService>(UserService);

  assertEquals(userService.id, "@id");
});

Deno.test("circular dependency resolution", () => {
  class UserRepository {
    constructor(public databaseConnection: string) {}

    username() {
      return "foo";
    }
  }

  class UserService {
    constructor(public repo: UserRepository) {}
  }

  container.set(UserRepository, UserRepository, () => "mysql", {
    position: 0,
    property: "constructor",
  });

  container.set(
    UserService,
    UserService,
    (self) => self.get(UserRepository),
    { position: 0, property: "constructor" },
  );

  const userService = container.get<UserService>(UserService);

  assertEquals(userService.repo.username(), "foo");
  assertEquals(userService.repo.databaseConnection, "mysql");
});

Deno.test("correct order", () => {
  class UserService {
    constructor(public id: string, public username: string) {}
  }

  container.set(UserService, UserService, () => "@beganovich", {
    position: 1,
    property: "constructor",
  });

  container.set(UserService, UserService, () => "10", {
    position: 0,
    property: "constructor",
  });

  const userService = container.get<UserService>(UserService);

  assertEquals(userService.username, "@beganovich");
  assertEquals(userService.id, "10");
});

Deno.test("flushing the container", () => {
  class UserService {
    constructor(public username: string) {}
  }

  container.set(UserService, UserService, () => "@beganovich", {
    position: 0,
    property: "constructor",
  });

  assertEquals(container.get<UserService>(UserService).username, "@beganovich");

  container.flush();

  assertEquals(container.get<UserService>(UserService).username, undefined);
});
