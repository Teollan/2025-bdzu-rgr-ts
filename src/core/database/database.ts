export interface DatabaseConnectionParams {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export interface Database {
  connect(params: DatabaseConnectionParams): Promise<void>;

  disconnect(): Promise<void>;

  query<T extends object>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]>;
}
