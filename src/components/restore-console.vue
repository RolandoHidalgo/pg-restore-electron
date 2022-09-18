<template>

    <div>
        <div class="console" id="console">
            <p  v-for="m in  messages">{{m}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "restore-console",
        mounted() {
            this.$electron.handleRestoreConsoleEvent((event, value) => {
                this.messages.push(value + '\n');
                if (value === 'finish-OK') {
                    this.$emit('done');
                }
                setTimeout(this.updateScroll, 50)
            });
            this.element = document.getElementById("console");

        },
        data() {
            return {
                element: null,
                messages: []
            }
        },
        methods: {
            updateScroll() {
                this.element.scrollTo({behavior: 'auto', top: Number(this.element.scrollHeight)});

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
        color: #f5fff2;
    }
</style>
