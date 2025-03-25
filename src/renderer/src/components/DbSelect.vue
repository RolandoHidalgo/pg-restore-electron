<script setup lang="ts">
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from './ui/select'
import {onMounted, Ref, ref, watchEffect} from 'vue'
import {FormItem, FormLabel, FormField, FormMessage} from './ui/form'
import {DataSource} from "../../../main/utils/restore/dataSourceUtils";

const props =defineProps<{
  dsName: string
}>()


// onMounted(() => {
//   datasourcesLoading.value = true
//   window.electron.getDatasource().then((ds: DataSource[]) => {
//     console.log(ds, 'ds')
//     items.value = ds.map(e => {
//       return {...e, text: `${e.name}-${e.host}`}
//     })
//     datasourcesLoading.value = false
//   })
// })



const items: Ref<string[]> = ref([])
//items.value = await window.electron.getDbs(props.dsName)
const datasourcesLoading = ref(false)
watchEffect(async () => {
  if (props.dsName && props.dsName !== '') {
    items.value = await window.electron.getDbs(props.dsName)
  }

})

</script>

<template>
  <FormField
    v-slot="{ componentField }"
    name="dbName"
  >
    <FormItem>
      <FormLabel>Db name.</FormLabel>

      <Select v-bind="componentField">
        <SelectTrigger>
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Bases de datos en {{props.dsName}}</SelectLabel>
            <SelectItem
              v-for="ds in items"
              :key="ds"
              :value="ds"
            >
              {{ ds }}
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
