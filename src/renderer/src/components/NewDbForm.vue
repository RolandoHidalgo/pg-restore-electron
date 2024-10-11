<script setup lang="ts">

import CustomSelect from './CustomSelect.vue'
</script>

<template>
  <div>
    <CustomSelect
      name="encoding"
      label="Encoding"
      :items="['LATIN1']" />
  </div>
  <div>
    <CustomSelect name="template" :items="['template0']" label="Template" />
  </div>
  <div>
    <CustomSelect name="collate" :items="['C']" label="Collation" />
  </div>
  <div>
    <CustomSelect name="ctype" :items="['C']" label="Character Type" />
  </div>
  <div>
    <CustomSelect name="tablespace" :items="['pg_default']" label="Tablespace" />
  </div>
</template>

<style scoped>

</style>
