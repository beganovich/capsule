import { container, InjectSymbol } from "../../mod.ts";
import { assertEquals } from "../../deps.ts";

Deno.test("injecting using @InjectSymbol", () => {
  const databaseSymbol = Symbol("database");

  interface DatabaseInterface {
    type(): string;
  }

  class FakeSqlService implements DatabaseInterface {
    type(): string {
      return "mysql";
    }
  }

  class FakeNoSqlService implements DatabaseInterface {
    type(): string {
      return "mongodb";
    }
  }

  class DatabaseService {
    constructor(
      @InjectSymbol(databaseSymbol) public database: DatabaseInterface,
    ) {}
  }

  container.set(databaseSymbol, DatabaseService, () => new FakeSqlService(), {
    position: 0,
    property: "constructor",
  });

  assertEquals(
    container.get<DatabaseService>(DatabaseService).database.type(),
    "mysql",
  );

  container.set(databaseSymbol, DatabaseService, () => new FakeNoSqlService(), {
    position: 0,
    property: "constructor",
  });

  assertEquals(
    container.get<DatabaseService>(DatabaseService).database.type(),
    "mongodb",
  );
});
