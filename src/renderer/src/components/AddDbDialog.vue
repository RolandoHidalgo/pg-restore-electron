<script setup lang="ts">


import {ref} from "vue";

const props = defineProps(['valor']);


const formValid = ref(false);


const running = ref(false);


function click() {

  window.electron.createDb({...props.valor});
  running.value = true;
}
</script>

<template>
  <v-dialog max-width="500">
    <v-form v-model="formValid">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
            v-bind="activatorProps"
            color="surface-variant"
            text="Open Dialog"
            variant="flat"
        ></v-btn>
      </template>

      <template v-slot:default="{ isActive }">
        <v-card title="Dialog">
          <v-card-text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore
            magna aliqua.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
                text="Close Dialog"
                @click="isActive.value = false"
            ></v-btn>
            <v-btn color="primary" @click="click" :loading="running" :disabled="!formValid">restore</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-form>
  </v-dialog>

</template>

<style scoped>

</style>
