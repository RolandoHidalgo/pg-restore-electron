<script setup lang="ts">
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from './ui/select'
import {Ref, ref, watchEffect} from 'vue'
import {FormItem, FormLabel, FormField, FormMessage} from './ui/form'
import { useSchemas } from '@renderer/composables'


const props = defineProps<{
  dsName: string,
  dbName: string
}>()
const {schemas} = useSchemas(()=>props.dsName,()=>props.dbName)

</script>

<template>
  <FormField
    v-slot="{ componentField }"
    name="schemma"
  >
    <FormItem>
      <FormLabel>Db name.</FormLabel>

      <Select v-bind="componentField">
        <SelectTrigger>
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Schemmas en {{ props.dbName }}</SelectLabel>
            <SelectItem
              v-for="schema in schemas"
              :key="schema"
              :value="schema"
            >
              {{ schema }}
            </SelectItem>
            <!--              <SelectItem value="banana">-->
            <!--                Banana-->
            <!--              </SelectItem>-->
            <!--              <SelectItem value="blueberry">-->
            <!--                Blueberry-->
            <!--              </SelectItem>-->
            <!--              <SelectItem value="grapes">-->
            <!--                Grapes-->
            <!--              </SelectItem>-->
            <!--              <SelectItem value="pineapple">-->
            <!--                Pineapple-->
            <!--              </SelectItem>-->
          </SelectGroup>
        </SelectContent>
      </Select>

      <FormMessage/>
    </FormItem>
  </FormField>
</template>

<style scoped>

</style>
