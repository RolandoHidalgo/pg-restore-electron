import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConexionStore = defineStore('conexionStore', () => {
  const loadDbsFunction = ref(() => {})

  async function getDbsOfDataSource(dsName: string): Promise<string[]> {
    return window.electron.getDbs(dsName)
  }

  async function getSchemasOfDbInDataSource(dsName: string, dbName: string): Promise<string[]> {
    return window.electron.getSchemmas(dsName, dbName)
  }

  function setLoadDbFunction(ldf) {
    loadDbsFunction.value = ldf
  }

  function loadDbs() {
    loadDbsFunction.value()
  }

  return { getDbsOfDataSource, getSchemasOfDbInDataSource,setLoadDbFunction,loadDbs }
})
