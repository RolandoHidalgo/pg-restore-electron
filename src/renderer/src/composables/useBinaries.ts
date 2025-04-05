import { computed, onMounted } from 'vue'
import { useBinarieStore } from '@renderer/stores/binariesStore'

const useBinaries = () => {
  const binariesStore = useBinarieStore()

  onMounted(() => {
    binariesStore.loadBinaries()
  })
  const binaries = computed(() => binariesStore.binaries);
  return { binaries }
}
export default useBinaries
