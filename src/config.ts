import * as config from '../config.json';

export interface DatabaseConfig {
  host: string;
  username: string;
  password: string;
}

export interface Config {
  database: DatabaseConfig;
}

export default config as Config;
