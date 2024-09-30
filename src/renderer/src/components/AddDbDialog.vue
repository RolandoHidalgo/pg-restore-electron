<script setup lang="ts">


import {ref} from "vue";

const props = withDefaults(defineProps<{
  isOpen?: boolean,
}>(), {
  isOpen: false,
});


const formValid = ref(false);


const running = ref(false);


function click() {

  window.electron.createDb({...props.valor});
  running.value = true;
}
</script>

<template>
  <v-dialog
    v-model="addDbDialogOpen"
    width="auto"
  >
    <v-card
      max-width="400"
      prepend-icon="mdi-update"
      text="Your application will relaunch automatically after the update is complete."
      title="Update in progress"
      persistent
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          class="ms-auto"
          text="Cancelar"
          @click="addDbDialogOpen = false"
        ></v-btn>
        <v-btn
          class="ms-auto"
          text="Ok"
          @click="addDbDialogOpen = false"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>

</template>

<style scoped>

</style>
