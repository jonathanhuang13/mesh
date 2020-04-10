import * as config from '../config.json';

export enum Env {
  Local = 'local',
  Test = 'test',
  Dev = 'dev',
  Prod = 'prod',
}

export interface DatabaseConfig {
  host: string;
  username: string;
  password: string;
}

export interface Config {
  env: Env;
  database: DatabaseConfig;
}

export default config as Config;
