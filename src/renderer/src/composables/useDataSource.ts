import { useDataSourceStore } from '@renderer/stores/datasourceStore'
import { computed, onMounted } from 'vue'

const useDataSource = () => {
  const dataSourceStore = useDataSourceStore()

  onMounted(() => {
    dataSourceStore.loadDataSources()
  })
  const datasources = computed(() => dataSourceStore.dataSources);
  return { datasources }
}
export default useDataSource
