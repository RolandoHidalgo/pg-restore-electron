import { computed, onMounted } from 'vue'
import { useDrivesStore } from '@renderer/stores/drivesStore'

const useDrives = () => {
  const drivesStore = useDrivesStore()

  onMounted(() => {
    drivesStore.loadDrives()
  })
  const drives = computed(() => drivesStore.drives)
  return { drives }
}
export default useDrives
