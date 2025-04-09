<script setup lang="ts">

import { onMounted, ref } from 'vue'
import {CircleCheck,LoaderCircle} from 'lucide-vue-next'
const emit = defineEmits(['done', 'delete'])
const element = ref(null);
const messages = ref([])
onMounted(() => {
  window.electron.handleRestoreConsoleEvent((event, value) => {
    messages.value.push(value + '\n');
    if (value === 'finish-OK') {
      emit('done');
    }
    setTimeout(updateScroll, 50)
  });
  element.value = document.getElementById("console");
})

function updateScroll() {
  element.value.scrollTo({behavior: 'auto', top: Number(element.value.scrollHeight)});
}

</script>

<template>

  <div>
    <div class="console " id="console">
      <p
        class="mx-0 flex justify-start items-center w-full text-xs"
        v-for="(m,i) in  messages" >
       <span class="mr-0.5"> <LoaderCircle v-if="i === messages.length-1 && m!=='finish-OK\n'" class="text-neutral-100 animate-spin"/>
        <CircleCheck v-else class="text-green-400 " /></span>

        <span class="break-all">{{ m }}</span>
      </p>
    </div>
  </div>
</template>


<style scoped>
.console {
  background-color: #2b2b2b;
  min-height: 300px;
  max-height: 300px;
  max-width: 100%;
  overflow: auto;
  color: #f5fff2;
}
</style>
