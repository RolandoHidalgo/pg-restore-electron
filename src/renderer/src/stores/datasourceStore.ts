import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { DataSource } from '../../../main/utils/restore/dataSourceUtils'

export const useDataSourceStore = defineStore('dataSourceStore', () => {
  const dataSourceLoading = ref(false)

  const dataSources: Ref<(DataSource & { text: string })[]> = ref([])
  const defaultDs = ref('')

  async function loadDataSources() {
    dataSourceLoading.value = true
    const info = await window.electron.getDatasourcesInfo()

    dataSources.value = info.datasources.map((e: DataSource) => {
      return { ...e, text: `${e.name}-${e.host}` }
    })
    defaultDs.value = info.defaultDs

    dataSourceLoading.value = false
  }

  async function deleteDataSource(dsName: string) {
    await window.electron.deleteDatasource(dsName)
    loadDataSources()
  }

  return { loadDataSources, dataSources, dataSourceLoading, deleteDataSource, defaultDs }
})
