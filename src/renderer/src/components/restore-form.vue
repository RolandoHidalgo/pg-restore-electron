<script lang="ts" setup>
import MainContent from "./MainContent.vue";
import RestoreConsole from "./restore-console.vue";
import { onBeforeMount, onMounted, ref } from "vue";

const file = ref([]);
onBeforeMount(() => {
  window.electron.getFileArg().then(data => {
    console.log(data, "la data");
    if (data !== null) {
      const fileTemp = new File([], data, {
        type: data.type
      });
      console.log(file, "el file");
      file.value.push(fileTemp);
      restoreData.value.backupPath = data;
    }


  });


});

onMounted(() => {
  binariesLoading.value = true;
  window.electron.getBinaries().then((binaries) => {
    console.log(binaries, "binaries");
    items.value = binaries.map(e => {
      return { ...e, text: `${e.version} - ${e.arq}` };
    });
    binariesLoading.value = false;
  });
});


const rules = {
  required: value => !!value || "Este campo es obligatorio"
};


const formValid = ref(false);

const items = ref([]);

const binariesLoading = ref(false);

const running = ref(false);

const restoreData = ref({
  dbName: "",
  port: "5432",
  host: "localhost",
  backupPath: null,
  user: "postgres",
  password: "",
  binary: ""
});


function processFinish() {
  running.value = false;
  window.electron.restoreFinish();
}

function selectedFile(fileParam) {
  debugger;
  const a = file.value;
  restoreData.value.backupPath = file.value ? file.value[0].path : null;

}

function click() {
  debugger;
  window.electron.restoreDb({ ...restoreData.value });
  running.value = true;
}


</script>

<template>
  <main-content>
    <v-card
      tile
      elevation="0"
      class="ma-0 pa-0 flex flex-column"
    >

      <v-card-text>
        <v-form v-model="formValid">
          <v-row dense>
            <v-col cols="3">
              <VAutocomplete
                item-title="text"
                item-value="binary"
                variant="outlined"
                density="compact"
                :items="items"
                v-model="restoreData.binary"
                label="* Postgres version"
                :loading="binariesLoading"
                :rules="[rules.required]"
              ></VAutocomplete>

            </v-col>
            <v-col cols="3">
              <v-text-field
                prepend-inner-icon="mdi-database"
                variant="outlined"
                density="compact"
                label="Data Base"

                v-model="restoreData.dbName"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                prepend-inner-icon="mdi-account"

                label="User"
                variant="outlined"
                density="compact"
                v-model="restoreData.user"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                prepend-inner-icon="mdi-form-textbox-password"
                variant="outlined"
                density="compact"
                label="Password"
                type="password"

                v-model="restoreData.password"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                prepend-inner-icon="mdi-ip-network-outline"
                variant="outlined"
                density="compact"
                label="Host"

                v-model="restoreData.host"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                variant="outlined"
                density="compact"
                label="Port"

                type="number"
                v-model="restoreData.port"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-file-input
                variant="outlined"
                density="compact"
                label="Select backup"

                @change="selectedFile"
                prepend-icon=""
                prepend-inner-icon="$file"
                v-model="file"
                :rules="[rules.required]"
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
        <v-btn color="primary" @click="click" :loading="running" :disabled="!formValid">restore</v-btn>
        <!--                <v-btn color="primary" @click="processFinish" :loading="running">sss</v-btn>-->
      </v-card-actions>
    </v-card>

  </main-content>
</template>


<style scoped>

</style>
