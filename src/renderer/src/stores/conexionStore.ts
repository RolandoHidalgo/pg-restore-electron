import { defineStore } from 'pinia'

export const useConexionStore = defineStore('conexionStore', () => {
  async function getDbsOfDataSource(dsName:string):Promise<string[]> {
    return window.electron.getDbs(dsName)
  }

  async function getSchemasOfDbInDataSource(dsName:string,dbName:string):Promise<string[]> {
    return window.electron.getSchemmas(dsName,dbName)
  }

  return { getDbsOfDataSource,getSchemasOfDbInDataSource }
})
