<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { FormItem, FormLabel, FormField, FormMessage } from './ui/form'
import { useDataSource } from '@renderer/composables'





const {datasources} = useDataSource()




</script>

<template>
  <FormField v-slot="{ componentField }" name="dsName">
    <FormItem>
      <FormLabel>Datasource.</FormLabel>

      <Select v-bind="componentField">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Conexiones guardadas</SelectLabel>
            <SelectItem v-for="ds in datasources" :key="ds.name" :value="ds.name">
              {{ ds.text }}
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

      <FormMessage />
    </FormItem>
  </FormField>
</template>

<style scoped></style>
