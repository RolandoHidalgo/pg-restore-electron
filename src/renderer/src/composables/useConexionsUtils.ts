import { MaybeRefOrGetter, Ref, ref, toRef, toValue, watchEffect } from 'vue'
import { useConexionStore } from '@renderer/stores/conexionStore'


const useDbs = (_dsName:MaybeRefOrGetter<string>)=>{

  const conexionStore = useConexionStore();
  const dbs:Ref<string[]>=ref([])
  const loadingDbs = ref(false)

  watchEffect(async ()=>{
    const dsName = toValue(_dsName);
    if(dsName && dsName !== ''){
      loadingDbs.value = true;
      dbs.value = await conexionStore.getDbsOfDataSource(dsName)
      loadingDbs.value = false;
    }
  })
  return {dbs,loadingDbs}
}
const useSchemas = (_dsName:MaybeRefOrGetter<string>,_dbName:MaybeRefOrGetter<string>)=>{

  const conexionStore = useConexionStore();
  const schemas:Ref<string[]>=ref([])
  const loadingSchemas = ref(false)

  watchEffect(async ()=>{
    const dsName = toValue(_dsName);
    const dbName = toValue(_dbName);
    if(dsName && dsName !== '' && dbName && dbName !== ''){
      loadingSchemas.value = true;
      schemas.value = await conexionStore.getSchemasOfDbInDataSource(dsName,dbName)
      loadingSchemas.value = false;
    }
  })
  return {schemas,loadingSchemas}
}

export {useDbs, useSchemas}
