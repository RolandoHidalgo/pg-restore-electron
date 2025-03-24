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


const addDatasources = (ds: DataSource): void => {
  const config = read(rc)
  if(!config.datasources) {
    config.datasources = [];
    write(config, rc);
  }
 // update({ 'config.datasources[]': ds },rc)
  config.datasources.push(ds);
  console.log(config.datasources,'asdasd')
  write(config, rc);
}

export {getDatasources, addDatasources};
