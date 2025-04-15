import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
type Binary = {arq:string,version:string,binarie:string};
export const useBinarieStore = defineStore('binarieStore', () => {
  const binariesLoading = ref(false)

  const binaries: Ref<(Binary&{text: string })[]> = ref([])

  async function loadBinaries() {
    binariesLoading.value = true
    binaries.value = await window.electron.getBinaries().then((binaries:Binary[]) => {

      return binaries.map((e:Binary) => {
        return { ...e, text: `${e.version} - ${e.arq}` }
      })
    })
    binariesLoading.value = false
  }

  return { loadBinaries, binaries, binariesLoading }
})
