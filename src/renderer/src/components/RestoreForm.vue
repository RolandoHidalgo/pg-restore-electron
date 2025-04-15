<script setup lang="ts">

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@renderer/components/ui/sheet'
import { Button } from '@renderer/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@renderer/components/ui/form'
import { Switch } from '@renderer/components/ui/switch'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { computed, ref } from 'vue'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

const coneccionSchema = z.object({
  // backupPath: z.record(z.string(), z.any(), {
  //   required_error: 'seleccione un backup'
  // }),
  dbName: z
    .string({
      required_error: 'Requerido.'
    })
    .min(1, { message: 'no vacio' })
})

const initVals = {
  port: '5432',
  host: 'localhost',
  user: 'postgres'
}

// onBeforeMount(() => {
//   window.electron.getFileArg().then((data) => {
//     console.log(data, 'la data')
//     if (data !== null) {
//       setFieldValue('backupPath', { path: data })
//     }
//   })
// })

const { handleSubmit, values } = useForm({
  validationSchema: computed(() =>
    toTypedSchema(
      coneccionSchema.passthrough()
    )
  ),
  initialValues: initVals,
  keepValuesOnUnmount: true
})

const onSubmit = handleSubmit((values) => {
  // const fileInputElement = document.getElementById('file_input')
  // //console.log(, 'path')
  // isConsoleOpen.value = true
  //
  // store.restoreDb(values, newDb.value, fileInputElement.files[0])

})
</script>

<template>
  <form @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="dbName">
      <FormItem>
        <FormLabel>DB</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit"> Restaurar Backup </Button>

  </form>
</template>

<style scoped>

</style>
