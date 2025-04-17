import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { CreateDebOptions, DbOptions } from '../../../main/utils/restore/restore-db'
import { DataSource } from '../../../main/utils/restore/dataSourceUtils'

export const useAppStore = defineStore('appStore', () => {
  const isConsoleOpen = ref(false)
  const currentConexionValues = ref({
    dsName: '',
    dbName: '',
    schema: '',
    backupPath: null,
    isClone: false
  })
  const isRestoreOpen = ref(false)
  const isBackupOpen = ref(false)
  const isAboutOpen = ref(false)
  const isDataSourceFormOpen = ref(false)
  const isDataSourceDeleteFormOpen = ref(false)
  const isSyncOpen = ref(false)
  const currentUsbDrive = ref('')
  const currentDsForm = ref<DataSource|null>(null)

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

  function openDeleteDsForm(ds:DataSource) {
    currentDsForm.value = ds
    isDataSourceDeleteFormOpen.value = true
  }

  function openRestore(dsName: string, dbName: string = ''): void {
    currentConexionValues.value.dbName = dbName
    currentConexionValues.value.dsName = dsName
    isRestoreOpen.value = true
  }

  function openClone(dsName: string, dbName: string = ''): void {
    currentConexionValues.value.dbName = dbName
    currentConexionValues.value.dsName = dsName
    currentConexionValues.value.isClone = true
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
      dsName: options.dsName ?? currentConexionValues.value.dsName,
      backupPath: file
        ? window.electron.showFilePath(file)
        : currentConexionValues.value?.backupPath
    }

    if (currentConexionValues.value.isClone) {
      window.electron.cloneDb(formValues, formValues)
    } else if (newDb) {
      window.electron.createDb(formValues, formValues)
    } else {
      window.electron.restoreDb(formValues)
    }

    //limpiar este valor que solo se setea cuando se obtiene por arg del prog (cuando se abre un archivo.backup)
    if (currentConexionValues.value?.backupPath) {
      currentConexionValues.value.backupPath = null
    }
  }

  function cloneDb(
    options: Pick<DbOptions, 'dbName' | 'dsName' | 'targetCloneDbName'> &
      Omit<CreateDebOptions, 'name'>
  ) {
    options.targetCloneDbName = options.dbName
    options.dbName = currentConexionValues.value.dbName
    const formValues = {
      ...options,
      dsName: options.dsName ?? currentConexionValues.value.dsName,
      backupPath: null
    }

    window.electron.cloneDb(formValues, formValues)
  }

  function closeBackup() {
    isBackupOpen.value = false
  }

  function openDataSourceForm(ds: DataSource = null) {

    if(ds){
      currentDsForm.value = ds
    }
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
    const data = await window.electron.getFileArg();
    if (data !== null) {
      currentConexionValues.value.dbName = ''
      currentConexionValues.value.dsName = ''
      currentConexionValues.value.backupPath = data
      isRestoreOpen.value = true
      //setFieldValue('backupPath', { path: data })
    }
    return data
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
    handleBakupOnStart,
    openClone,
    cloneDb,
    currentDsForm,
    openDeleteDsForm,
    isDataSourceDeleteFormOpen,
  }
})
