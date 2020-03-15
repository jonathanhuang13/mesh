import * as config from '../config.json';

export interface Config {
  database: {
    host: string;
    username: string;
    password: string;
  };
}

export default config as Config;
