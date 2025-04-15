<script lang="ts" setup>
import MainContent from "./MainContent.vue";
import RestoreConsole from "./restore-console.vue";
import {computed, onBeforeMount, onMounted, ref} from "vue";
import AddDbDialog from "./AddDbDialog.vue";

const file = ref([]);
onBeforeMount(() => {
  window.electron.getFileArg().then(data => {

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
      return {...e, text: `${e.version} - ${e.arq}`};
    });
    binariesLoading.value = false;
  });
});


const rules = {
  required: value => !!value || "Este campo es obligatorio"
};

const addDbDialogOpen = ref(false);

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
  binary: "",

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
  window.electron.restoreDb({...restoreData.value});
  running.value = true;
}

function addDb() {
  addDbDialogOpen.value = true;
}

const createDbForm = ref({
  name: '',
  encoding: undefined,
  template: undefined,
  collate: undefined,
  ctype: undefined,
  tablespace: undefined
})
const creatingDb = ref(false);
const createdDbFormVaild = ref(false);


function createDb() {
  //restoreData.value.dbForm = createDbForm.value;
  window.electron.createDb({...restoreData.value}, {...createDbForm.value});
  restoreData.value.dbName = createDbForm.value.name;
  addDbDialogOpen.value = false;
}

const isValidAdd = computed(() => {
  return restoreData.value.binary !== '' && restoreData.value.password !== '';
})
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

              >
                <template v-slot:append-inner>
                  <v-icon
                    :disabled="!isValidAdd"
                    icon="mdi-plus"
                    @click="addDb"
                  />
                </template>

              </v-text-field>
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
    <v-dialog
      v-model="addDbDialogOpen"
      width="600"
    >
      <v-card

        class="pa-3"
        prepend-icon="mdi-update"
        title="Crear nueva Db"
        persistent
      >
        <v-form v-model="createdDbFormVaild">
          <v-row>
            <v-col cols="12">
              <VTextField label="Nombre" v-model="createDbForm.name"></VTextField>
            </v-col>
            <v-col cols="12">
              <VSelect :items="['LATIN1']" clearable label="Encoding" v-model="createDbForm.encoding"></VSelect>
            </v-col>
            <v-col cols="12">
              <VSelect :items="['template0']" clearable label="Template" v-model="createDbForm.template"></VSelect>
            </v-col>
            <v-col cols="12">
              <VSelect :items="['C']" clearable label="Collation" v-model="createDbForm.collate"></VSelect>
            </v-col>
            <v-col cols="12">
              <VSelect :items="['C']" clearable label="Character Type" v-model="createDbForm.ctype"></VSelect>
            </v-col>
            <v-col cols="12">
              <VSelect :items="['pg_default']" clearable label="Tablespace" v-model="createDbForm.tablespace"></VSelect>
            </v-col>
          </v-row>
        </v-form>


        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            class="ms-auto"
            text="Cancelar"
            @click="addDbDialogOpen = false"
          ></v-btn>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="createDb"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </main-content>
</template>


<style scoped>

</style>
