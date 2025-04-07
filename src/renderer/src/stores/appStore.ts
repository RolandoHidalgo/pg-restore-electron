import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('appStore', () => {
  const isConsoleOpen = ref(false)
  const currentConexionValues = ref({dsName:'',dbName:'',schema:''})
  // const isRestoreOpen = ref(false)
  const isBackupOpen = ref(false)

  function showConsole() {
    isConsoleOpen.value = true
  }
  function closeConsole() {
    isConsoleOpen.value = true
  }

  function openBackup(dsName:string,dbName:string,schema:string=''):void {
    currentConexionValues.value.dbName = dbName
    currentConexionValues.value.dsName = dsName
    currentConexionValues.value.schema = schema
    isBackupOpen.value = true

  }

  return {closeConsole, showConsole,isConsoleOpen,isBackupOpen,openBackup,currentConexionValues}
})
