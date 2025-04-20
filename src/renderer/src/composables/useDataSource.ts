import { useDataSourceStore } from '@renderer/stores/datasourceStore'
import { computed, onMounted } from 'vue'

const useDataSource = () => {
  const dataSourceStore = useDataSourceStore()

  onMounted(() => {
    dataSourceStore.loadDataSources()
  })
  function setDefaultDatasource(dsName:string){
    dataSourceStore.defaultDs = dsName;
    window.electron.setDefaultDatasource(dsName)
  }
  const datasources = computed(() => dataSourceStore.dataSources);
  const defaultDs = computed(() => dataSourceStore.defaultDs);
  return { datasources ,setDefaultDatasource,defaultDs }
}
export default useDataSource
