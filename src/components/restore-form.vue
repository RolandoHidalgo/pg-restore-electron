<template>
    <main-content>
        <v-card
                tile
                elevation="0"
                class="ma-0 pa-0 flex flex-column"
        >
            <v-card-text>
                <v-form>
                    <v-row dense>
                        <v-col cols="3">
                            <v-select
                                    dense
                                    :items="items"
                                    label="Postgres version"
                                    outlined
                                    v-model="restoreData.binary"
                                    item-value="binary"
                                    :loading="binariesLoading"
                            ></v-select>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field
                                    prepend-inner-icon="mdi-database"
                                    dense
                                    label="Data Base"
                                    outlined
                                    v-model="restoreData.dbName"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field
                                    prepend-inner-icon="mdi-account"
                                    dense
                                    label="User"
                                    outlined
                                    v-model="restoreData.user"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field
                                    prepend-inner-icon="mdi-form-textbox-password"
                                    dense
                                    label="Password"
                                    type="password"
                                    outlined
                                    v-model="restoreData.password"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field
                                    prepend-inner-icon="mdi-ip-network-outline"
                                    dense
                                    label="Host"
                                    outlined
                                    v-model="restoreData.host"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field
                                    prepend-inner-icon="mdi-connection"
                                    dense
                                    label="Port"
                                    outlined
                                    type="number"
                                    v-model="restoreData.port"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-file-input
                                    dense
                                    label="Select backup"
                                    outlined
                                    @change="selectedFile"
                                    prepend-icon=""
                                    prepend-inner-icon="$file"
                                    v-model="file"
                            ></v-file-input>
                        </v-col>
                    </v-row>


                    <div>
                        <restore-console @done="processFinish"></restore-console>
                    </div>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green" @click="click" :loading="running" class="mr-3">restore</v-btn>
<!--                <v-btn color="primary" @click="processFinish" :loading="running
">sss</v-btn>-->
            </v-card-actions>
        </v-card>

    </main-content>
</template>

<script>
    import MainContent from "./MainContent";
    import RestoreConsole from "@/components/restore-console";

    export default {
        name: "restore-form",
        components: {RestoreConsole, MainContent},
        beforeMount() {
            this.$electron.getFileArg().then(data => {
                if (data !== null) {
                    const file = new File([], data, {
                        type: data.type
                    });
                    this.file = file;
                    this.restoreData.backupPath = data;
                }


            });


        },
        mounted() {
            this.binariesLoading = true;
            this.$electron.getBinaries().then(binaries => {
                this.items = binaries.map(e => {
                    return {...e, text: `${e.version} - ${e.arq}`}
                });
                this.binariesLoading = false;
            })

        },
        data() {
            return {
                file: null,
                items: [],
                binariesLoading: false,
                running: false,
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
        methods: {
            processFinish() {
                this.running = false;
                this.$electron.restoreFinish();
            },
            selectedFile(file) {
                this.restoreData.backupPath = file ? file.path : null;
                console.log(this.restoreData.backupPath);
            },
            click() {
                this.$electron.restoreDb(this.restoreData);
                this.running = true;
            }
        }
    }
</script>

<style scoped>

</style>
