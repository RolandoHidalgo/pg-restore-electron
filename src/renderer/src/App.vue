<script setup lang="ts">
import RestoreForm from "./components/restore-form.vue";

</script>

<template>
  <v-app>
    <!--      <v-system-bar-->
    <!--          window-->
    <!--          dark-->
    <!--          class="bar"-->
    <!--      >-->
    <!--        <v-icon>mdi-message</v-icon>-->
    <!--        <span>10 unread messages</span>-->
    <!--        <v-spacer></v-spacer>-->
    <!--        <v-icon>mdi-minus</v-icon>-->
    <!--        <v-icon>mdi-checkbox-blank-outline</v-icon>-->
    <!--        <v-icon>mdi-close</v-icon>-->
    <!--      </v-system-bar>-->
    <v-main>
      <restore-form></restore-form>
    </v-main>
  </v-app>
</template>

<style>
html, body {
  overflow: auto !important;
}

.bar {
  -webkit-app-region: drag;
}
</style>
