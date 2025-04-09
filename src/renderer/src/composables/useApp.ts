import { useAppStore } from '@renderer/stores/appStore'

const useApp = () => {
  const store = useAppStore()
  return {
    showConsole: store.showConsole,
    closeConsole: store.closeConsole,
    openBackup: store.openBackup,
    openRestore: store.openRestore,
    isBackupOpen: store.isBackupOpen,
    currentConexionValues:store.currentConexionValues
  }
}

export default useApp
