<template>
  <main-content>
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
          ></v-select>
        </v-col>
        <v-col cols="3">
          <v-text-field
              dense
              label="Data Base"
              outlined
              v-model="restoreData.dbName"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
              dense
              label="User"
              outlined
              v-model="restoreData.user"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
              dense
              label="Password"
              outlined
              v-model="restoreData.password"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
              dense
              label="Host"
              outlined
              v-model="restoreData.host"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              dense
              label="Port"
              outlined
              v-model="restoreData.port"
          ></v-text-field>
        </v-col>
        <v-col cols="5">
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


      <v-btn color="primary" @click="click">restore</v-btn>

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
  beforeMount() {
    this.$electron.getFileArg().then(data => {
      if (data !== null) {
        const file = new File([], data, {
          type: data.type
        });
        this.file = file;
        this.restoreData.backupPath = data;
      }


    })

  },
  mounted() {

  },
  data() {
    return {
      file: null,
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
