import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { CreateDebOptions, DbOptions } from '../../../main/utils/restore/restore-db'
import { DataSource } from '../../../main/utils/restore/dataSourceUtils'

export const useAppStore = defineStore('appStore', () => {
  const isConsoleOpen = ref(false)
  const currentConexionValues = ref({ dsName: '', dbName: '', schema: '', backupPath: null })
  const isRestoreOpen = ref(false)
  const isBackupOpen = ref(false)
  const isAboutOpen = ref(false)
  const isDataSourceFormOpen = ref(false)
  const isSyncOpen = ref(false)
  const currentUsbDrive = ref('')
  function showConsole() {
    isConsoleOpen.value = true
  }

  function closeConsole() {
    isConsoleOpen.value = true
  }

  function openBackup(dsName: string, dbName: string, schema: string = ''): void {
    currentConexionValues.value.dbName = dbName
    currentConexionValues.value.dsName = dsName
    currentConexionValues.value.schema = schema
    isBackupOpen.value = true
  }

  function openRestore(dsName: string, dbName: string = ''): void {
    currentConexionValues.value.dbName = dbName
    currentConexionValues.value.dsName = dsName
    isRestoreOpen.value = true
  }

  function createBackup() {
    const formValues = {
      ...currentConexionValues.value,
      backupPath: '',
      schemma: currentConexionValues.value.schema
    }
    window.electron.backupDb(formValues)
  }

  function restoreDb(
    options: Pick<DbOptions, 'backupPath' | 'dbName' | 'dsName'> & Omit<CreateDebOptions, 'name'>,
    newDb: Boolean,
    file: File
  ) {
    const formValues = {
      ...options,
      dsName: currentConexionValues.value.dsName,
      backupPath: currentConexionValues.value?.backupPath ?? window.electron.showFilePath(file)
    }
    console.log(formValues,'values')
    console.log(options,'op')
    console.log(file,'aa')
    // if (newDb) {
    //   window.electron.createDb(formValues, formValues)
    // } else {
    //   window.electron.restoreDb(formValues)
    // }
    console.log(formValues)
    //limpiar este valor que solo se setea cuando se obtiene por arg del prog (cuando se abre un archivo.backup)
    if (currentConexionValues.value?.backupPath) {
      currentConexionValues.value.backupPath = null
    }
  }

  function closeBackup() {
    isBackupOpen.value = false
  }

  function openDataSourceForm(ds: DataSource=null) {
    isDataSourceFormOpen.value = true
  }
  function openAbout() {
    isAboutOpen.value = true
  }

  const openSync = (usbDrive) => {
    currentUsbDrive.value = usbDrive
    isSyncOpen.value = true
  }

  const handleBakupOnStart = async () => {
   await window.electron.getFileArg().then((data) => {
      console.log(data, 'la data')
      if (data !== null) {
        currentConexionValues.value.dbName = ''
        currentConexionValues.value.dsName = 'local'
        currentConexionValues.value.backupPath = data
        isRestoreOpen.value = true
        //setFieldValue('backupPath', { path: data })
      }
    })
  }
  return {
    closeConsole,
    showConsole,
    isConsoleOpen,
    isBackupOpen,
    openBackup,
    currentConexionValues,
    createBackup,
    restoreDb,
    openRestore,
    isRestoreOpen,
    openDataSourceForm,
    isDataSourceFormOpen,
    openAbout,
    isAboutOpen,
    isSyncOpen,
    currentUsbDrive,
    openSync,
    handleBakupOnStart
  }
})
