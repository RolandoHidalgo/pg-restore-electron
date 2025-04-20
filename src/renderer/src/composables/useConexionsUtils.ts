import { computed, MaybeRefOrGetter, Ref, ref, toRef, toValue, watchEffect } from 'vue'
import { useConexionStore } from '@renderer/stores/conexionStore'

const useDbs = (_dsName: MaybeRefOrGetter<string>) => {
  const conexionStore = useConexionStore()
  const dbs: Ref<string[]> = ref([])
  const loadingDbs = ref(false)
  const conexionErrors = ref('')
  const loadDbs = async () => {
    try {
      const dsName = toValue(_dsName)
      conexionErrors.value = ''
      loadingDbs.value = true
      dbs.value = await conexionStore.getDbsOfDataSource(dsName)
    } catch (err: any) {
      conexionErrors.value = err
    } finally {
      loadingDbs.value = false
    }
  }
  conexionStore.setLoadDbFunction(loadDbs)

  watchEffect(async () => {
    const dsName = toValue(_dsName)
    if (dsName && dsName !== '') {
      await loadDbs()
    }
  })

  const hasConexionErrors = computed(() => {
    return conexionErrors.value && conexionErrors.value !== ''
  })

  return { dbs, loadingDbs, conexionErrors, loadDbs, hasConexionErrors }
}
const useSchemas = (_dsName: MaybeRefOrGetter<string>, _dbName: MaybeRefOrGetter<string>) => {
  const conexionStore = useConexionStore()
  const schemas: Ref<string[]> = ref([])
  const loadingSchemas = ref(false)

  watchEffect(async () => {
    const dsName = toValue(_dsName)
    const dbName = toValue(_dbName)
    if (dsName && dsName !== '' && dbName && dbName !== '') {
      loadingSchemas.value = true
      schemas.value = await conexionStore.getSchemasOfDbInDataSource(dsName, dbName)
      loadingSchemas.value = false
    }
  })
  return { schemas, loadingSchemas }
}

export { useDbs, useSchemas }
