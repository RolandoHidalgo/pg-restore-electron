<template>
    <div style="background-color: #2b2b2b;min-height: 300px">
        <p style="color: red" v-for="m in  messages">{{m}}</p>
    </div>
</template>

<script>
    export default {
        name: "restore-console",
        created() {
            this.$electron.handleRestoreConsoleEvent((event, value) => {
                //this.message.push(value + '\n');
                console.log(value);
            })
        },
        data() {
            return {
                messages: []
            }
        }
    }
</script>

<style scoped>

</style>
