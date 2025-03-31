<script setup lang="ts">
import { Button } from '@renderer/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'

import { computed, onBeforeMount, ref } from 'vue'

import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField
} from '@renderer/components/ui/form'

import { DialogContent, DialogHeader, DialogTitle, Dialog } from './ui/dialog'
import RestoreConsole from './restore-console.vue'
import { Switch } from '@renderer/components/ui/switch'
import NewDbForm from './NewDbForm.vue'
import { FormDescription } from './ui/form'
import DatasourceSelect from "@renderer/components/DatasourceSelect.vue";

const isOpenDialog = ref(false)

const newDb = ref(false)

const newDbSchema = z.object({
  encoding: z.string({
    required_error: 'Requerido.'
  }),
  template: z.string({
    required_error: 'Requerido.'
  }),
  collate: z.string({
    required_error: 'Requerido.'
  }),
  ctype: z.string({
    required_error: 'Requerido.'
  }),
  tablespace: z.string({
    required_error: 'Requerido.'
  })
})

const coneccionSchema = z.object({
  datasource: z
    .string({
      required_error: 'Requerido.'
    }),
  backupPath: z.record(z.string(), z.any(), {
    required_error: 'seleccione un backup'
  }),
  dbName: z
    .string({
      required_error: 'Requerido.'
    })
    .min(1, { message: 'no vacio' })
})

const pepe = computed(() => {
  const schema = newDb.value ? 1 : 0
  return schema
})
const initVals = {
  port: '5432',
  host: 'localhost',
  user: 'postgres'
}
const fileRef = ref()
onBeforeMount(() => {
  window.electron.getFileArg().then((data) => {
    console.log(data, 'la data')
    if (data !== null) {
      setFieldValue('backupPath', { path: data })
    }
  })
})

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: computed(() =>
    toTypedSchema(
      newDb.value ? coneccionSchema.merge(newDbSchema).passthrough() : coneccionSchema.passthrough()
    )
  ),
  initialValues: initVals,
  keepValuesOnUnmount: true
})

const onSubmit = handleSubmit((values) => {
  const fileInputElement = document.getElementById('file_input')
  //console.log(, 'path')
  isOpenDialog.value = true

  const formValues = {
    ...values,
    backupPath:values?.backupPath?.path ?? window.electron.showFilePath(fileInputElement.files[0])
  }
  if (newDb.value) {
    window.electron.createDb(formValues, formValues)
  } else {
    window.electron.restoreDb(formValues)
  }
})

const isFileSelected = computed(() => {
  return values.backupPath && values.backupPath.path
})
</script>

<template>
  <form class="w-full flex flex-col grow bg-blue-50" @submit="onSubmit">
    <Card class="flex flex-col grow justify-between">
      <CardHeader>
        <CardTitle> Restaurar backup </CardTitle>
        <CardDescription> Entre los parámetros de conexión. </CardDescription>
      </CardHeader>
      <CardContent class="grid grid-cols-2 gap-4 overflow-y-auto h-[60dvh]">
        <div>
          <DatasourceSelect/>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="dbName">
            <FormItem>
              <FormLabel>DB</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
                <div>
                  <Switch id="new-db" v-model:checked="newDb" />
                  <Label for="new-db" class="text-muted-foreground"> Nueva Db</Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <NewDbForm v-if="newDb" />



        <div class="col-span-2">
          <FormField v-slot="{ handleChange, handleBlur }" name="backupPath">
            <FormItem>
              <FormLabel>Backup file</FormLabel>
              <FormControl>
                <Input id="file_input" type="file" @change="handleChange" @blur="handleBlur" />
              </FormControl>
              <FormDescription v-if="isFileSelected">
                Archivo seleccionado {{ values.backupPath?.path }}
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </CardContent>
      <CardFooter>
        <Button class="w-full" type="submit"> Restore Backup </Button>
      </CardFooter>
    </Card>
    <Dialog v-model:open="isOpenDialog" modal>
      <DialogContent class="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Logs</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <RestoreConsole />
        </div>
      </DialogContent>
    </Dialog>
  </form>
</template>

<style scoped></style>
