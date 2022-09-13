<template>
    <v-app>
        <v-main class="pa-3">
            <restore-form></restore-form>
        </v-main>
    </v-app>
</template>

<script lang="ts">
    import Vue from 'vue';
    import RestoreForm from "@/components/restore-form.vue";

    export default Vue.extend({
        name: 'App',
        components: {RestoreForm},
        data: () => ({
            //
        }),
    });
</script>
