import { Sql } from "postgres";
import { getDatabase } from "@/core/database";

export abstract class Repository {
  protected get db(): Sql {
    return getDatabase();
  }
}
