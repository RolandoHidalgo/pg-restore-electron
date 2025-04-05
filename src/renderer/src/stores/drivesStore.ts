import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'

export const useDrivesStore = defineStore('drivesStore', () => {
  const drivesLoading = ref(false)

  const drives: Ref<{ name: string; mount: string }[]> = ref([])

  async function loadDrives() {
    drivesLoading.value = true
    drives.value = await window.electron.getDrives()
    drivesLoading.value = false
  }

  return { loadDrives, drives, drivesLoading }
})
