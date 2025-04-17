
import { useFormValues, useSetFieldValue } from 'vee-validate'
import { useAppStore } from '@renderer/stores/appStore'
import { computed, toRef, watchEffect, ref, nextTick, onBeforeMount } from 'vue'
import { z } from 'zod'
const conDsSchema = z.object({
  dsName: z.string({
    required_error: 'Requerido.'
  })
});


const useRestoreOnInitApi = (_currentZodSchema) => {

  const values = useFormValues();
  const setBackupPathValue = useSetFieldValue('backupPath')
  const store = useAppStore();
  onBeforeMount(() => {
    store.handleBakupOnStart().then(data=>{
      if(data!=null){
        nextTick(() => {
          console.log('la setea')
          setBackupPathValue({ path: store.currentConexionValues.backupPath })
        })
      }
    })
  })
  const isRestoreOnInit = computed(() => {
    return store.currentConexionValues.backupPath
  })
  watchEffect(()=>{
    const currentZodSchema = toRef(_currentZodSchema)
    if (store.currentConexionValues.backupPath) {
      currentZodSchema.value = currentZodSchema.value.merge(conDsSchema);
    }
  })

  watchEffect(() => {
    if (!store.isRestoreOpen) {
      store.currentConexionValues.backupPath = null
      setBackupPathValue(undefined)

    }

    if ( store.isRestoreOpen && store.currentConexionValues.backupPath && !values.value.backupPath) {
      // nextTick(() => {
      //   console.log('la setea')
      //   setBackupPathValue({ path: store.currentConexionValues.backupPath })
      // })

    }
  })


  return {isRestoreOnInit}
}
export default useRestoreOnInitApi;
