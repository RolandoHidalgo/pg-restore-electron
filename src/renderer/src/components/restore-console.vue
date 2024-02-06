<script setup lang="ts">

import { onMounted, ref } from 'vue'

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
    <div class="console" id="console">
      <p v-for="m in  messages">{{ m }}</p>
    </div>
  </div>
</template>


<style scoped>
.console {
  background-color: #2b2b2b;
  min-height: 300px;
  max-height: 300px;
  overflow: auto;
  color: #f5fff2;
}
</style>
