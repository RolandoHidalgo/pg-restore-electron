<template>
    <div>{{messages}}</div>
</template>

<script>
    export default {
        name: "restore-console",
        created() {
            this.$electron.handleRestoreConsoleEvent((event, value) => {
                console.log(value);
            })
        },
        data() {
            return {
                messages: ''
            }
        }
    }
</script>

<style scoped>

</style>
