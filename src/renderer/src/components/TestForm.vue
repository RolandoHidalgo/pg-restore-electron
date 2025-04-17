<script setup lang="ts">

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { CardContent, CardFooter } from '@renderer/components/ui/card'
import { Button } from '@renderer/components/ui/button'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { computed, onMounted } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'



const coneccionSchema = z.object({
  backupPath: z.record(z.string(), z.any(), {
    required_error: 'seleccione un backup'
  }),
  dbName: z
    .string({
      required_error: 'Requerido.'
    })
    .min(1, { message: 'no vacio' })
})




const { handleSubmit, values, resetForm,setFieldValue } = useForm({
  validationSchema: computed(() => toTypedSchema(coneccionSchema)),
  keepValuesOnUnmount: true,
})
onMounted(()=>{
  setFieldValue('backupPath',{ path: 'store.currentConexionValues.backupPath' })

})
const isFileSelected = computed(() => {
  return values.backupPath && values.backupPath.path
})
const onSubmit = handleSubmit((values) => {
  // if (!isConsoleOpen.value) {
  //   isRestoring.value = true
  //   const fileInputElement = document.getElementById('file_input')
  //
  //   if (isRestoreClone.value) {
  //     store.cloneDb(values)
  //   } else {
  //     store.restoreDb(values, newDb.value, fileInputElement?.files?.[0])
  //   }
  //
  //   isConsoleOpen.value = true
  // } else {
  //   store.isRestoreOpen = false
  // }
})


function test(){
  resetForm()
  console.log('a resetear')
  //setFieldValue('backupPath',undefined)
}

</script>

<template>
  <div>
  <form class="w-full flex flex-col pb-0" @onSubmit="onSubmit">
    <CardContent class="grid grid-cols-2 gap-2 overflow-y-auto pb-0">
      <!--          <div class="col-span-2">-->
      <!--            <FormField name="newDb">-->
      <!--              <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">-->
      <!--                <div class="space-y-0.5">-->
      <!--                  <FormLabel class="text-base"> Nueva</FormLabel>-->
      <!--                  <FormDescription> Crear una nueva db.</FormDescription>-->
      <!--                </div>-->
      <!--                <FormControl>-->
      <!--                  <Switch-->
      <!--                    id="new-db"-->
      <!--                    v-model:checked="newDb"-->
      <!--                    :disabled="isRestoreClone"-->
      <!--                  />-->
      <!--                </FormControl>-->
      <!--              </FormItem>-->
      <!--            </FormField>-->
      <!--          </div>-->
      <!--          <div v-if="isRestoreOnInit" class="col-span-2">-->
      <!--            <DatasourceSelect />-->
      <!--          </div>-->
      <!--          <div class="col-span-2" v-if="!newDb">-->
      <!--            <DbSelect :ds-name="currentDsName ?? ''" />-->
      <!--          </div>-->

      <!--          <div v-else>-->
      <!--            <FormField v-slot="{ componentField }" name="dbName">-->
      <!--              <FormItem>-->
      <!--                <FormLabel>DB</FormLabel>-->
      <!--                <FormControl>-->
      <!--                  <Input type="text" v-bind="componentField" />-->
      <!--                </FormControl>-->
      <!--                <FormMessage />-->
      <!--              </FormItem>-->
      <!--            </FormField>-->
      <!--          </div>-->

      <!--          <NewDbForm v-if="newDb" />-->

      <div class="col-span-2">
        <FormField v-slot="{ handleChange, handleBlur }" name="backupPath">
          <FormItem>
            <FormLabel
            >Backup file
            </FormLabel>
            <FormControl >
              <Input id="file_input" type="file" @change="handleChange" @blur="handleBlur" />
            </FormControl>
            <FormDescription >
              Archivo seleccionado {{ values.backupPath }}
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </CardContent>

    <!--        <RestoreConsole v-else @done="isRestoring = false" />-->
  </form>
  <CardFooter class="grid grid-cols-2 gap-2 overflow-y-auto pb-0">
    <Button @click="test" type="button"> Aceptar</Button>
  </CardFooter>
  </div>
</template>

<style scoped>

</style>
