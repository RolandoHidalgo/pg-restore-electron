import { useDataSourceStore } from '@renderer/stores/datasourceStore'
import { computed, onMounted } from 'vue'

const useDataSource = () => {
  const dataSourceStore = useDataSourceStore()

  onMounted(() => {
    dataSourceStore.loadDataSources()
  })
  function setDefaultDatasource(dsName:string){
    window.electron.setDefaultDatasource(dsName)
  }
  const datasources = computed(() => dataSourceStore.dataSources);
  return { datasources ,setDefaultDatasource}
}
export default useDataSource
