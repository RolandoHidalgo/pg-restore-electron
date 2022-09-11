<template>
    <main-content>
        <v-form>
            <div>
                <v-select
                        :items="items"
                        label="Postgres version"
                        outlined
                        v-model="restoreData.binary"
                        item-value="binary"
                ></v-select>
                <v-text-field
                        label="Data Base"
                        outlined
                        v-model="restoreData.dbName"
                ></v-text-field>
                <v-text-field
                        label="User"
                        outlined
                        v-model="restoreData.user"
                ></v-text-field>

                <v-text-field
                        label="Password"
                        outlined
                        v-model="restoreData.password"
                ></v-text-field>
                <v-text-field
                        label="Host"
                        outlined
                        v-model="restoreData.host"
                ></v-text-field>
                <v-text-field
                        label="Port"
                        outlined
                        v-model="restoreData.port"
                ></v-text-field>
                <v-file-input
                        label="Select backup"
                        outlined
                        @change="selectedFile"
                ></v-file-input>
                <v-btn color="primary" @click="click">restore</v-btn>

            </div>
            <div>
                <restore-console></restore-console>
            </div>
        </v-form>
    </main-content>
</template>

<script>
    import MainContent from "./MainContent";
    import RestoreConsole from "@/components/restore-console";

    export default {
        name: "restore-form",
        components: {RestoreConsole, MainContent},
        data() {
            return {
                file: '',
                restoreData: {
                    dbName: '',
                    port: '5432',
                    host: 'localhost',
                    backupPath: null,
                    user: 'postgres',
                    password: '',
                    binary: ''
                }
            }
        },
        computed: {
            items() {
                return this.$electron.getBinaries().map(e => {
                    return {...e, text: `${e.version} - ${e.arq}`}
                });
            }
        },
        methods: {
            selectedFile(file) {
                this.restoreData.backupPath = file ? file.path : null;
                console.log(this.restoreData.backupPath);
            },
            click() {
                this.$electron.restoreDb(this.restoreData);
            }
        }
    }
</script>

<style scoped>

</style>
