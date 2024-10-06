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
import BinarySelect from './BinarySelect.vue'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { FormControl, FormItem, FormLabel, FormMessage, FormField } from '@renderer/components/ui/form'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogFooter
} from './ui/dialog'
import RestoreConsole from './restore-console.vue'
import { Switch } from '@renderer/components/ui/switch'
import NewDbForm from './NewDbForm.vue'


const isOpenDialog = ref(false)

const newDb = ref(false)

const newDbSchema = z.object({
  encoding: z
    .string({
      required_error: 'Requerido.'
    }),
  template: z
    .string({
      required_error: 'Requerido.'
    }),
  collate: z
    .string({
      required_error: 'Requerido.'
    }),
  ctype: z
    .string({
      required_error: 'Requerido.'
    }),
  tablespace: z
    .string({
      required_error: 'Requerido.'
    })
})

const coneccionSchema = z.object({
  binary: z
    .string({
      required_error: 'Requerido.'
    }),
  password: z
    .string({
      required_error: 'Requerido.'
    }).min(1, { message: 'no vacio' }),
  user: z
    .string({
      required_error: 'Requerido.'
    }).min(1, { message: 'no vacio' }),
  backupPath: z
    .record(z.string(), z.any(), {
      required_error: 'seleccione un backup'
    }),
  host: z
    .string({
      required_error: 'Requerido.'
    }).min(1, { message: 'no vacio' }),
  port: z
    .string({
      required_error: 'Requerido.'
    }).min(1, { message: 'no vacio' }),
  dbName: z
    .string({
      required_error: 'Requerido.'
    }).min(1, { message: 'no vacio' })
})


const pepe = computed(() => {
  const schema = newDb.value ? 1 : 0
  return schema
})
const { handleSubmit, setFieldValue } = useForm({
  validationSchema: computed(() => toTypedSchema(newDb.value ? coneccionSchema.merge(newDbSchema).passthrough() : coneccionSchema.passthrough())),
  initialValues: {
    port: '5432',
    host: 'localhost',
    user: 'postgres'

  },
  keepValuesOnUnmount: true

})
onBeforeMount(() => {
  window.electron.getFileArg().then(data => {
    console.log(data, 'la data')
    if (data !== null) {

      setFieldValue('backupPath', data)
    }


  })


})
const onSubmit = handleSubmit((values) => {
  console.log(values, 'asdfsdfsf')
  isOpenDialog.value = true
  const formValues = { ...values, backupPath: values.backupPath.path }
  window.electron.createDb(formValues, formValues)
})


</script>

<template>
  <form
    class="w-full "
    @submit="onSubmit"
  >

    <Card>
      <CardHeader>
        <CardTitle>
          Restaurar backup
        </CardTitle>
        <CardDescription>
          Entre los parámetros de conexión.
        </CardDescription>
      </CardHeader>
      <CardContent class="grid grid-cols-2 gap-4 overflow-y-auto h-[55dvh]">


        <div>
          <BinarySelect />
        </div>
        <div>
          <FormField
            v-slot="{ componentField }"
            name="dbName"
          >
            <FormItem>
              <FormLabel>DB</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  v-bind="componentField"
                />
                <div>
                  <Switch
                    id="new-db"
                    v-model:checked="newDb"
                  />
                  <Label for="new-db" class="text-muted-foreground"> Nueva Db</Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <NewDbForm v-if="newDb"/>
        <div>
          <FormField
            v-slot="{ componentField }"
            name="password"
          >
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField
            v-slot="{ componentField }"
            name="user"
          >
            <FormItem>
              <FormLabel>User</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField
            v-slot="{ componentField }"
            name="host"
          >
            <FormItem>
              <FormLabel>Host</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField
            v-slot="{ componentField }"
            name="port"
          >
            <FormItem>
              <FormLabel>Port</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="col-span-2">
          <FormField
            v-slot="{ handleChange,handleBlur }"
            name="backupPath"
          >
            <FormItem>
              <FormLabel>Backup file</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  @change="handleChange"
                  @blur="handleBlur"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

      </CardContent>
      <CardFooter>
        <Button
          class="w-full"
          type="submit"
        >
          Create account
        </Button>
      </CardFooter>
    </Card>
    <Dialog v-model:open="isOpenDialog">
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

<style scoped>

</style>
