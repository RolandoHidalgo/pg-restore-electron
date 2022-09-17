<template>
    <div class="console" id="console">
        <p style="color: red" v-for="m in  messages">{{m}}</p>
    </div>
</template>

<script>
    export default {
        name: "restore-console",
        mounted() {
            this.$electron.handleRestoreConsoleEvent((event, value) => {
                this.messages.push(value + '\n');
                console.log(value);
                if (value === 'finish-OK') {
                    console.log('matao el gallo');
                }
                this.updateScroll();
            })
        },
        data() {
            return {
                messages: []
            }
        },
        methods: {
            updateScroll() {
                const element = document.getElementById("console");
                element.scrollTop = element.scrollHeight;
            }
        }
    }
</script>

<style scoped>
    .console {
        background-color: #2b2b2b;
        min-height: 300px;
        max-height: 300px;
        overflow: auto;
        color: red;
    }
</style>
