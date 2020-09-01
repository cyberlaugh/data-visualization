<!--
 * @Description:
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-08-31 11:47:03
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-09-01 10:18:47
-->
<template>
  <div class="wrapper-trace-interop">
    <span>每次搜寻</span><input v-model="stepSize" type="number">
    <span>个点, 搜寻</span><input v-model="step" type="number"><span>次</span>
    <button title="向前搜寻" @click="tracePoints('-')">
      &lt;
    </button>
    <button title="向后搜寻" @click="tracePoints('+')">
      &gt;
    </button>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'stepInfo',
    event: 'stepChange'
  },
  props: {
    stepInfo: {
      type: Object,
      default: () => { return { step: 10, size: 1 } }
    }
  },
  data() {
    return {
      stepSize: 1,
      step: 10
    }
  },
  watch: {
    stepSize(newer) {
      this.$emit('stepChange', { step: this.step, size: newer })
    },
    step(newer) {
      this.$emit('stepChange', { step: newer, size: this.stepSize })
    }
  },
  mounted() {
    this.stepSize = this.stepInfo.size
    this.step = this.stepInfo.step
  },
  methods: {
    tracePoints(sign) {
      this.$emit('trace-points', sign)
    }
  }
}
</script>

<style lang="scss"  scoped>
.wrapper-trace-interop{
    /deep/ input{
        width: 40px;
        margin: 0 .5em;
    }
}
</style>
