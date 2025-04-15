
import { useFormValues, useSetFieldValue } from 'vee-validate'
import { useAppStore } from '@renderer/stores/appStore'
import { computed, Ref, toRef, watchEffect } from 'vue'
import { z } from 'zod'
const conDsSchema = z.object({
  dsName: z.string({
    required_error: 'Requerido.'
  })
});


const useRestoreCloneApi = (_currentZodSchema,newDb:Ref<Boolean>) => {
  const store = useAppStore();

  const isRestoreClone = computed(() => {
    return store.currentConexionValues.isClone
  })
  watchEffect(()=>{
    const currentZodSchema = toRef(_currentZodSchema)
    if (store.currentConexionValues.isClone) {
      currentZodSchema.value = currentZodSchema.value.omit({ backupPath: true }).passthrough()
    }
  })
  watchEffect(() => {
    if (!store.isRestoreOpen) {
      store.currentConexionValues.isClone = false
    }
  })
  watchEffect(() => {
    if (store.currentConexionValues.isClone) {
      newDb.value = true
    }
  })

  return {isRestoreClone}
}
export default useRestoreCloneApi;
