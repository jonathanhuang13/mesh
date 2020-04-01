import config from '@src/config';

import { NotesDataSource } from '@src/graphql/datasources/notes';

export interface DataSources {
  notes: NotesDataSource;
}

let datasources: DataSources | undefined = undefined;

export function getDataSources(): DataSources {
  if (datasources) return datasources;

  datasources = {
    notes: new NotesDataSource(config.database),
  };

  return datasources;
}
