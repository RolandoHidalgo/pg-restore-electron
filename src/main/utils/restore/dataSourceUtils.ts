import { read, write } from 'rc9'
import path from 'node:path'
import os from 'node:os'

export type DataSource = {
  name: string
  username: string
  host: string
  port: number
  binary: string
  password: string
  isDefault: boolean
}

const rc = {
  name: 'pgRestoreConf',
  dir: path.join(os.homedir(), 'pgRestore')
}

const getDatasources = (): DataSource[] => {
  const config = read(rc)
  return config.datasources ?? []
}

const getDatasource = (name: string) => {
  return getDatasources().filter((e) => e.name === name)[0]
}

const addDatasources = (ds: DataSource): void => {
  const config = read(rc)
  if (!config.datasources) {
    config.datasources = []
    write(config, rc)
  }
  const index = config.datasources.findIndex((e) => e.name === ds.name)
  if (index >= 0) {
    config.datasources[index] = ds
  } else {
    ds.isDefault = false
    config.datasources.push(ds)
  }
  write(config, rc)
}

const setDafaultDatasource = (dsName: string): void => {
  const config = read(rc)
  config.datasources.forEach((e) => {
    e.isDefault = e.name === dsName
  })
  write(config, rc)
}

const deleteDatasource = (dsName: string): void => {
  const config = read(rc)
  const index = config.datasources.findIndex((e) => e.name === dsName)
  if (index >= 0) {
    config.datasources.splice(index, 1)
  }
  write(config, rc)
}

export { getDatasources, addDatasources, getDatasource, setDafaultDatasource,deleteDatasource }
