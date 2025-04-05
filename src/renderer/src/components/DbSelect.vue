<script setup lang="ts">
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from './ui/select'
import {FormItem, FormLabel, FormField, FormMessage} from './ui/form'
import { useDbs } from '@renderer/composables'
import { SelectIcon } from 'radix-vue'
import { CaretSortIcon,CaretDownIcon } from '@radix-icons/vue'

const props =defineProps<{
  dsName: string
}>()
const {dbs} = useDbs(()=>props.dsName)


</script>

<template>
  <FormField
    v-slot="{ componentField }"
    name="dbName"
  >
    <FormItem>
      <FormLabel>Db name.</FormLabel>

      <Select v-bind="componentField">
        <SelectTrigger >
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Bases de datos en {{props.dsName}}</SelectLabel>
            <SelectItem
              v-for="db in dbs"
              :key="db"
              :value="db"
            >
              {{ db }}
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
