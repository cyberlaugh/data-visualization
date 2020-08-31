<template>
  <el-select
    :class="{'no-border':noborder}"
    v-model="selectValue"
    popper-class="el-typeselect-popper"
    placeholder="请选择">
    <svg-icon slot="prefix" :icon-class="iconClass" class-name="icon-typeselected" />
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <svg-icon :icon-class="`datatype_${item.value}`" class-name="icon-typeselect" />
      <span>{{ item.label }}</span>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'TypeSelect',
  props: {
    value: {
      type: String,
      default: ''
    },
    noborder: {
      type: Boolean,
      default: true
    },
    availableTypes: {
      type: Array,
      default: () => { return [] } // ['string','date']
    }
  },
  data() {
    return {
      alloptions: [
        { value: 'string', label: '字符串', prefix: 'ABC' },
        { value: 'bigint', label: '整型', prefix: '123' },
        { value: 'double', label: '浮点', prefix: '#.#' },
        { value: 'boolean', label: '布尔', prefix: 'BOOL' },
        { value: 'date', label: '日期', prefix: 'DATE' },
        { value: 'timestamp', label: '日期时间', prefix: '00:00' }
      ],
      options: []
    }
  },
  computed: {
    selectValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    iconClass: {
      get() {
        return `datatype_${this.selectValue}`
      },
      set() {

      }
    }
  },
  watch: {
    '$props.availableTypes': {
      handler(newer) {
        this.getAvailableOptions(newer)
      },
      deep: true
    }
  },
  created() {
    this.getAvailableOptions(this.availableTypes)
  },
  methods: {
    getAvailableOptions(availableTypes) {
      if (availableTypes && availableTypes.length > 0) {
        this.options = this.alloptions.filter(c => {
          return availableTypes.indexOf(c.value) >= 0
        })
      } else {
        this.options = [...this.alloptions]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .svg-icon.icon-typeselect {
  width: 4em!important;
}
/deep/ .svg-icon.icon-typeselected{
  width:5em;
  height:100%;
}
/deep/ .el-input--prefix {
  cursor:pointer;
  .el-input__inner{
    padding-left: 5.2em;
    width: 0;
    border:none;
  }
}
/deep/ .el-select.no-border {
  .el-input{
    .el-input__inner{
      border:none;
    }
  }
}
</style>
<style scoped>
.el-typeselect-popper .el-select-dropdown__item{
  padding: 0 .8em 0 0;
}
</style>

