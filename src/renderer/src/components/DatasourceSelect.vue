<script setup lang="ts">
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from './ui/select'
import {onMounted, Ref, ref} from 'vue'
import {FormItem, FormLabel, FormField, FormDescription, FormMessage} from './ui/form'
import {DataSource} from "../../../main/utils/restore/dataSourceUtils";

onMounted(() => {
  datasourcesLoading.value = true
  window.electron.getDatasource().then((ds: DataSource[]) => {
    console.log(ds, 'ds')
    items.value = ds.map(e => {
      return {...e, text: `${e.name}-${e.host}`}
    })
    datasourcesLoading.value = false
  })
})

const items: Ref<(DataSource&{text:string})[]> = ref([])

const datasourcesLoading = ref(false)


</script>

<template>
  <FormField
    v-slot="{ componentField }"
    name="datasource"
  >
    <FormItem>
      <FormLabel>Datasource.</FormLabel>

      <Select v-bind="componentField">
        <SelectTrigger>
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Conexiones guardadas</SelectLabel>
            <SelectItem
              v-for="ds in items"
              :key="ds.name"
              :value="ds.name"
            >
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

      <FormMessage/>
    </FormItem>
  </FormField>
</template>

<style scoped>

</style>
