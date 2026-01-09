export class Environment {
  static dbHost = process.env.DB_HOST ?? "localhost";
  static dbPort = parseInt(process.env.DB_PORT ?? "5432");
  static dbName = process.env.DB_NAME ?? "postgres";
  static dbUsername = process.env.DB_USERNAME ?? "postgres";
  static dbPassword = process.env.DB_PASSWORD ?? "";

  static isDebugMode = (process.env.DEBUG_MODE ?? "false").toLowerCase() === "true";
  static pageSize = parseInt(process.env.PAGE_SIZE ?? "20");
};
