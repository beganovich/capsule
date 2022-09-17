import { Container } from "../mod.ts";
import { assertEquals } from "../deps.ts";

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
