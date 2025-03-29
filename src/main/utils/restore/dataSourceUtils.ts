import {read, write, update} from 'rc9'
import path from "node:path";
import os from "node:os";

export type DataSource = {
  name: string,
  username: string,
  host: string,
  port: number,
  binary: string,
  password: string,
}

const rc = {
  name: 'pgRestoreConf',
  dir: path.join(os.homedir(), "pgRestore")
}

const getDatasources = (): DataSource[] => {
  const config = read(rc)
  return config.datasources ?? [];
}

const getDatasource = (name: string) => {
  return getDatasources().filter(e => e.name === name)[0];
}


const addDatasources = (ds: DataSource): void => {
   const config = read(rc)
  if (!config.datasources) {
    config.datasources = [];
    write(config, rc);
  }
  const index = config.datasources.findIndex(e => e.name === ds.name);
  if (index >= 0) {
    config.datasources[index] = ds;
  }
  else {
    config.datasources.push(ds);
  }
  write(config, rc);
}

export {getDatasources, addDatasources,getDatasource};
