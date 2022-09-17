import { container, Inject } from "../../mod.ts";
import { assertEquals } from "../../deps.ts";

Deno.test("injecting using decorators", () => {
  class UserRepository {
    username() {
      return "@beganovich";
    }
  }

  class UserService {
    constructor(@Inject(UserRepository) public repository: UserRepository) {}
  }

  assertEquals(
    container.get<UserService>(UserService).repository.username(),
    "@beganovich",
  );
});
