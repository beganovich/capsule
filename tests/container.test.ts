import { Container } from "../mod.ts";
import { assertEquals } from "../deps.ts";

const container = new Container();

Deno.test("example test", () => {
  assertEquals(container instanceof Container, true);
});
