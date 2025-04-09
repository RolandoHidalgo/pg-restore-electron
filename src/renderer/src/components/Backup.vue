<script setup lang="ts">


import {Button} from '@renderer/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'


import {computed,  ref} from 'vue'
import {useForm} from 'vee-validate'
import {z} from 'zod'
import {toTypedSchema} from '@vee-validate/zod'

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog

} from './ui/dialog'
import RestoreConsole from './restore-console.vue'
import DatasourceSelect from "@renderer/components/DatasourceSelect.vue";
import DbSelect from "@renderer/components/DbSelect.vue";
import DbSchemmSelect from "@renderer/components/DbSchemmSelect.vue";


const isOpenDialog = ref(false)


const coneccionSchema = z.object({
  datasource: z
    .string({
      required_error: 'Requerido.'
    }),
  schemma: z
    .string({
      required_error: 'Requerido.'
    }).optional(),
  dbName: z
    .string({
      required_error: 'Requerido.'
    }).min(1, {message: 'no vacio'})
})


const initVals = {
  port: '5432',
  host: 'localhost',
  user: 'postgres'

}



const {handleSubmit, values} = useForm({
  validationSchema: computed(() => toTypedSchema(coneccionSchema.passthrough())),
  initialValues: initVals,
  keepValuesOnUnmount: true

})

const onSubmit = handleSubmit((values) => {
  console.log(values, 'asdfsdfsf')
  isOpenDialog.value = true
  const formValues = {...values, backupPath: ''}
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
          <DatasourceSelect/>
        </div>
        <div>
          <!--          <FormField-->
          <!--            v-slot="{ componentField }"-->
          <!--            name="dbName"-->
          <!--          >-->
          <!--            <FormItem>-->
          <!--              <FormLabel>DB</FormLabel>-->
          <!--              <FormControl>-->
          <!--                <Input-->
          <!--                  type="text"-->
          <!--                  v-bind="componentField"-->
          <!--                />-->
          <!--              </FormControl>-->
          <!--              <FormMessage />-->
          <!--            </FormItem>-->
          <!--          </FormField>-->
          <DbSelect :ds-name="values.datasource ?? ''"/>
        </div>
        <div>
          <DbSchemmSelect :ds-name="values?.datasource ?? '' " :db-name="values?.dbName ?? ''"/>
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
      <DialogContent class="sm:max-w-[475px] p-1">
        <DialogHeader>
          <DialogTitle>Logs</DialogTitle>
        </DialogHeader>
        <div class="grid gap-2 py-2">
          <RestoreConsole/>
        </div>
      </DialogContent>
    </Dialog>
  </form>
</template>

<style scoped>

</style>
