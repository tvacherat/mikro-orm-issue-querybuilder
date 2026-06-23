import {
  Entity,
  ManyToOne,
  PrimaryKey,
  ReflectMetadataProvider,
} from "@mikro-orm/decorators/legacy";
import { MikroORM } from "@mikro-orm/sqlite";
import "reflect-metadata";

@Entity()
class Account {
  @PrimaryKey()
  id!: number;
}

@Entity()
class User {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Account, {
    deleteRule: "cascade",
    nullable: true,
  })
  account!: Account | null;

  @ManyToOne(() => Account, {
    deleteRule: "cascade",
    nullable: true,
    mapToPk: true,
  })
  accountMap!: string | null;
}

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: ":memory:",
    entities: [Account, User],
    metadataProvider: ReflectMetadataProvider,
    debug: ["query", "query-params"],
    allowGlobalContext: true, // only for testing
  });
  await orm.schema.refresh();
});

afterAll(async () => {
  await orm.close(true);
});

test("basic CRUD example", async () => {
  // Works fine
  orm.em
    .createQueryBuilder(User, "u")
    .join("u.account", "a")
    .join("accountMap", "a") // ts(2729) No overload matches this call...
    .select("a.id")
    .getResultList();
});
