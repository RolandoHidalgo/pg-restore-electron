import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { DataSource } from '../../../main/utils/restore/dataSourceUtils'

export const useDataSourceStore = defineStore('dataSourceStore', () => {
  const dataSourceLoading = ref(false)

  const dataSources: Ref<(DataSource & { text: string })[]> = ref([])

  function loadDataSources() {
    dataSourceLoading.value = true
    window.electron.getDatasource().then((ds:DataSource[]) => {


      dataSources.value = ds.map((e: DataSource) => {
        return { ...e, text: `${e.name}-${e.host}` }
      })

    })


    dataSourceLoading.value = false
  }

  return { loadDataSources, dataSources, dataSourceLoading }
})
