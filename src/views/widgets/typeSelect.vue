<template>
  <div>
    <type-select v-model="selType" :available-types="['string','boolean']"/>
    <el-button>{{ selType}}</el-button>
  </div>
</template>

<script>
import TypeSelect from '@/components/TypeSelect/index.vue'
export default {
  name: 'VTypeSelect',
  components: { TypeSelect },
  data() {
    return {
        selType:''
    }
  }
}
</script>

<style>

</style>
