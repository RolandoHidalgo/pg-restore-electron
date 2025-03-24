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
  DialogHeader,
  DialogTitle,
  Dialog

} from './ui/dialog'
import RestoreConsole from './restore-console.vue'
import { Switch } from '@renderer/components/ui/switch'
import NewDbForm from './NewDbForm.vue'
import { FormDescription } from './ui/form'


const isOpenDialog = ref(false)



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



const initVals = {
  port: '5432',
  host: 'localhost',
  user: 'postgres'

}
const fileRef = ref();


const { handleSubmit, values } = useForm({
  validationSchema: computed(() => toTypedSchema(coneccionSchema.passthrough())),
  initialValues: initVals,
  keepValuesOnUnmount: true

})

const onSubmit = handleSubmit((values) => {
  console.log(values, 'asdfsdfsf')
  isOpenDialog.value = true
  const formValues = { ...values,backupPath: '' }
  window.electron.backupDb(formValues)
})


</script>

<template>
  <form
    class="w-full flex flex-col grow bg-blue-50"
    @submit="onSubmit"
  >

    <Card class="flex flex-col grow justify-between">
      <CardHeader>
        <CardTitle>
          Crear backup
        </CardTitle>
        <CardDescription>
          Entre los parámetros de conexión.
        </CardDescription>
      </CardHeader>
      <CardContent class="grid grid-cols-2 gap-4 overflow-y-auto h-[60dvh]">


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
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
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

      </CardContent>
      <CardFooter>
        <Button
          class="w-full"
          type="submit"
        >
          Crear Backup
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
