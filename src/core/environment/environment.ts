export class Environment {
  static dbHost = process.env.DB_HOST ?? "localhost";

  static dbPort = parseInt(process.env.DB_PORT ?? "5432");

  static dbName = process.env.DB_NAME ?? "postgres";

  static dbUsername = process.env.DB_USERNAME ?? "postgres";

  static dbPassword = process.env.DB_PASSWORD ?? "postgres";
};
