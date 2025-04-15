import { useFormValues } from 'vee-validate'
import { useAppStore } from '@renderer/stores/appStore'
import { ref, watchEffect } from 'vue'
import { BackupInfo } from '../../../main/utils/restore/binariesUtils'

const useBackupInfo = () => {
  const values = useFormValues()
  const store = useAppStore()
  const backupInfo = ref<BackupInfo>({
    fecha: '',
    entries: 0,
    dbVersion: '',
    pgDumpVersion: '',
    dbName: ''
  })
  const parseBackup = async (backupPath: string | File, dsName = null): Promise<BackupInfo> => {

    return window.electron.parseBackup(dsName ?? store.currentConexionValues.dsName, backupPath)
  }
  watchEffect(async () => {
    if (values.value.backupPath) {

      if (values.value.backupPath.path) {
        if (values.value.dsName && values.value.dsName !== '') {

          backupInfo.value = await parseBackup(values.value.backupPath.path, values.value.dsName)
        }
      } else {
        const fileInputElement = document.getElementById('file_input')

        backupInfo.value = await parseBackup(fileInputElement?.files?.[0])
      }
    }
  })
  watchEffect(() => {
    if (!store.isRestoreOpen) {
      backupInfo.value = {
        fecha: '',
        entries: 0,
        dbVersion: '',
        pgDumpVersion: '',
        dbName: ''
      }
    }
  })

  return backupInfo
}

export default useBackupInfo
