<script setup lang="ts">
import { Button } from '@renderer/components/ui/button'
import { computed, ref, watchEffect } from 'vue'
import { ReloadIcon } from '@radix-icons/vue'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'

import BinarySelect from '@renderer/components/BinarySelect.vue'

import { CardContent } from '@renderer/components/ui/card'
import { Input } from '@renderer/components/ui/input'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@renderer/components/ui/sheet'
import { useAppStore } from '@renderer/stores/appStore'
import { useDataSourceStore } from '@renderer/stores/datasourceStore'
import { useConexionStore } from '@renderer/stores/conexionStore'

const store = useAppStore()
const dsStore = useDataSourceStore()
const messages = ref('')
const updating = ref(false)
const isEdit = ref(false);
const coneccionSchema = z.object({
  binary: z.string({
    required_error: 'Requerido.'
  }),
  password: z
    .string({
      required_error: 'Requerido.'
    })
    .min(1, { message: 'no vacio' }),
  username: z
    .string({
      required_error: 'Requerido.'
    })
    .min(1, { message: 'no vacio' }),

  host: z
    .string({
      required_error: 'Requerido.'
    })
    .min(1, { message: 'no vacio' }),
  port: z
    .number({
      required_error: 'Requerido.'
    })
    .min(1, { message: 'no vacio' }),
  name: z
    .string({
      required_error: 'Requerido.'
    })
    .min(1, { message: 'no vacio' })
})
const initVals = {
  port: 5432,
  host: 'localhost',
  username: 'postgres'
}
const { handleSubmit, resetForm, values, setValues } = useForm({
  validationSchema: computed(() => toTypedSchema(coneccionSchema.passthrough())),
  initialValues: initVals,
  keepValuesOnUnmount: true
})

const onSubmit = handleSubmit(async (values) => {
  await window.electron.addDatasource(values)
  await dsStore.loadDataSources()
  if(isEdit.value){
    useConexionStore().loadDbs()
  }
  store.isDataSourceFormOpen = false
  resetForm()
})
watchEffect(() => {
  if (!store.isDataSourceFormOpen) {

    store.currentDsForm = null
    resetForm()
  }
  // else {
  //   if (store.currentDsForm) {

  //   }
  // }
})
const handleReset = () => {

  resetForm({ values: { ...initVals } })
}
store.$onAction(({ name, after }) => {
  after(() => {
    if (name === 'openDataSourceForm') {

      setValues({ ...store.currentDsForm })
      isEdit.value = store.currentDsForm !== null
      //resetForm({ values:  })
      store.currentDsForm = null
    }
  })
})
</script>

<template>
  <Sheet v-model:open="store.isDataSourceFormOpen" class="p-0!">
    <SheetTrigger></SheetTrigger>
    <SheetContent side="bottom" class="rounded-t-lg">
      <SheetHeader>
        <SheetTitle>{{`${isEdit?'Editar':'Adicionar'}`}} datasource</SheetTitle>
        <SheetDescription> Parámetros de conexión.</SheetDescription>
      </SheetHeader>
      <form class="w-full flex flex-col" @submit="onSubmit">
        <CardContent class="grid grid-cols-2 gap-2 overflow-y-auto">
          <div>
            <BinarySelect />
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="name" >
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" :disabled="isEdit"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" v-bind="componentField" />
                </FormControl>

                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="username">
              <FormItem>
                <FormLabel>User</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="host">
              <FormItem>
                <FormLabel>Host</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="port">
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </CardContent>
      </form>
      <SheetFooter>
        <Button @click="onSubmit" :disabled="updating">
          <ReloadIcon class="w-4 h-4 mr-2 animate-spin" v-if="updating" />
          Aceptar
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<style scoped></style>
