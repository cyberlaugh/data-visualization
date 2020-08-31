<template>
  <div>
    <select-rich
      v-model="value"
      :options="models"
      :option-key="{ value: 'id', label: 'name' }"
      :combind-value="['id','type']"
      :filter-by="filterBy"
      :filterable="true"
      :clearable="true"
      placeholder="Please Select"
      empty-text="请至少选择一个模型类别"
    />
    <el-button @click="changValue">
      改变选中值
    </el-button>
    <el-button @click="changData">
      改变列表
    </el-button>
    <el-button @click="getSelV">
      获取选中值
    </el-button>
  </div>
</template>

<script>
import SelectRich from '@/components/SelectRich/index.vue'
export default {
  name: 'VSelectRich',
  components: { SelectRich },
  data() {
    return {
      value: '',
      models: [],
      filterBy: { key: 'type', value: [{ label: '单独模型', value: 'model' }, { label: '组合模型', value: 'pipeline' }], single: false } // { key: 'group', value: [{ label: '单独模型', value: 'S' }, { label: '组合模型', value: 'C' }], single: false }
    }
  },
  created() {
    this.models =
            [{ 'id': 28, 'name': 'test_2', 'type': 'model' }, { 'id': 30, 'name': 'test_11', 'type': 'model' }, { 'id': 32, 'name': 'st_threshold', 'type': 'model' }, { 'id': 33, 'name': 'luanf_个性化阈值', 'type': 'model' }, { 'id': 37, 'name': 'st_arima', 'type': 'model' }, { 'id': 38, 'name': 'hd_马氏距离模型', 'type': 'model' }, { 'id': 42, 'name': 'st_new_马氏距离', 'type': 'model' }, { 'id': 43, 'name': 'st_new_健康度', 'type': 'model' }, { 'id': 44, 'name': 'st_new_轴心轨迹', 'type': 'model' }, { 'id': 45, 'name': 'st_new_频谱', 'type': 'model' }, { 'id': 46, 'name': 'st_new_个性化阈值', 'type': 'model' }, { 'id': 50, 'name': 'st_arimax', 'type': 'model' }, { 'id': 68, 'name': 'fft1', 'type': 'model' }, { 'id': 69, 'name': 'iso1', 'type': 'model' }, { 'id': 70, 'name': 'threshold1', 'type': 'model' }, { 'id': 76, 'name': '鸢尾花预测模型', 'type': 'model' }, { 'id': 77, 'name': 'st_wzj_个性化阈值', 'type': 'model' }, { 'id': 78, 'name': 'threshold_model1', 'type': 'model' }, { 'id': 79, 'name': 'st_wzj_频谱变换', 'type': 'model' }, { 'id': 80, 'name': 'st_wzj_轴心轨迹', 'type': 'model' }, { 'id': 81, 'name': 'st_wzj_马氏距离_test', 'type': 'model' }, { 'id': 82, 'name': 'st_wzj_arima', 'type': 'model' }, { 'id': 83, 'name': 'iso6', 'type': 'model' }, { 'id': 84, 'name': 'st_wzj_健康度', 'type': 'model' }, { 'id': 86, 'name': 'st_wzj_arimax', 'type': 'model' }, { 'id': 88, 'name': 'st_wzj_马氏距离', 'type': 'model' }, { 'id': 89, 'name': 'mq_cluster_test', 'type': 'model' }, { 'id': 93, 'name': 'test_model', 'type': 'model' }, { 'id': 99, 'name': 'st_个性化阈值_wzj', 'type': 'model' }, { 'id': 100, 'name': '20200401光伏回归ljs', 'type': 'model' }, { 'id': 101, 'name': '用于服务测试', 'type': 'model' }, { 'id': 102, 'name': 'flower0401ljs', 'type': 'model' }, { 'id': 103, 'name': '三峡电厂_三峡右岸24号机组_个性化阈值_上导轴承X摆度峰峰值', 'type': 'model' }, { 'id': 107, 'name': 'mq_test_lstm', 'type': 'model' }, { 'id': 112, 'name': 'aggModel', 'type': 'model' }, { 'id': 116, 'name': 'thresholdModel', 'type': 'model' }, { 'id': 117, 'name': 'testmultitable', 'type': 'model' }, { 'id': 118, 'name': 'iso02', 'type': 'model' }, { 'id': 119, 'name': '单独_鸢尾花_zxl', 'type': 'model' }, { 'id': 121, 'name': 'zxl_鸢尾花2', 'type': 'model' }, { 'id': 125, 'name': 'arima_test', 'type': 'model' }, { 'id': 129, 'name': 'q1', 'type': 'model' }, { 'id': 130, 'name': 'testregression', 'type': 'model' }, { 'id': 132, 'name': 'iso07', 'type': 'model' }, { 'id': 133, 'name': 'iso33', 'type': 'model' }, { 'id': 134, 'name': 'st_wzj_threshold', 'type': 'model' }, { 'id': 135, 'name': 'FT_个性化阈值', 'type': 'model' }, { 'id': 136, 'name': 'iso_marui', 'type': 'model' }, { 'id': 137, 'name': 'iso66', 'type': 'model' }, { 'id': 138, 'name': 'uu', 'type': 'model' }, { 'id': 139, 'name': 'tt', 'type': 'model' }, { 'id': 141, 'name': 'ywhModel01', 'type': 'model' }, { 'id': 43, 'name': 'testmultitable', 'type': 'pipeline' }, { 'id': 45, 'name': 'testmultitable1', 'type': 'pipeline' }, { 'id': 122, 'name': 'test_arima_1', 'type': 'pipeline' }, { 'id': 130, 'name': 'zxl_鸢尾花', 'type': 'pipeline' }, { 'id': 134, 'name': 'zxq_test', 'type': 'pipeline' }, { 'id': 139, 'name': 'test_孤立森林', 'type': 'pipeline' }, { 'id': 145, 'name': 'iso_test', 'type': 'pipeline' }, { 'id': 148, 'name': 'qq', 'type': 'pipeline' }, { 'id': 149, 'name': 'testregression', 'type': 'pipeline' }, { 'id': 151, 'name': 'testregression01', 'type': 'pipeline' }, { 'id': 152, 'name': 'testkmeans', 'type': 'pipeline' }, { 'id': 153, 'name': 'testmuititableregression', 'type': 'pipeline' }, { 'id': 154, 'name': 'testiforest', 'type': 'pipeline' }, { 'id': 155, 'name': 'testmd', 'type': 'pipeline' }, { 'id': 156, 'name': 'testhd_threshold', 'type': 'pipeline' }, { 'id': 186, 'name': 'threshold06', 'type': 'pipeline' }, { 'id': 187, 'name': 'fft01', 'type': 'pipeline' }, { 'id': 188, 'name': 'iso66', 'type': 'pipeline' }, { 'id': 189, 'name': 'md_01', 'type': 'pipeline' }, { 'id': 190, 'name': 'FrequencyJudge01', 'type': 'pipeline' }, { 'id': 191, 'name': 'SignalDenoising01', 'type': 'pipeline' }, { 'id': 192, 'name': 'MathCalculate012', 'type': 'pipeline' }, { 'id': 193, 'name': 'threshold0303', 'type': 'pipeline' }, { 'id': 194, 'name': 'iforestMathThreshold01', 'type': 'pipeline' }, { 'id': 196, 'name': 'Test_天融', 'type': 'pipeline' }, { 'id': 197, 'name': 'FT2_tianrong', 'type': 'pipeline' }, { 'id': 200, 'name': 'FT4_天融', 'type': 'pipeline' }, { 'id': 201, 'name': 'FT5_天融', 'type': 'pipeline' }, { 'id': 202, 'name': 'FT6_天融', 'type': 'pipeline' }, { 'id': 203, 'name': 'FT9_天融', 'type': 'pipeline' }, { 'id': 208, 'name': 'test_test_hwx', 'type': 'pipeline' }, { 'id': 211, 'name': '测试实时流_CUI_hd', 'type': 'pipeline' }, { 'id': 215, 'name': '测试_zxl', 'type': 'pipeline' }, { 'id': 216, 'name': 'test_linpeng', 'type': 'pipeline' }, { 'id': 217, 'name': 'test_edit_428', 'type': 'pipeline' }, { 'id': 218, 'name': 'test_edit_hwx', 'type': 'pipeline' }]
  },
  mounted() {
    this.value = ''
  },
  methods: {
    getSelV() {
      console.log('选中值', this.value)
    },
    changValue() {
      this.value = { 'id': 188, 'name': 'iso66', 'type': 'pipeline' }
      console.log(this.value)
    },
    changData() {
      this.models =
        [{ 'id': 28, 'name': 'test_2', 'type': 'model' }, { 'id': 30, 'name': 'test_11', 'type': 'model' },
          { 'id': 28, 'name': 'iso66', 'type': 'pipeline' }, { 'id': 189, 'name': 'md_01', 'type': 'pipeline' }
        ]
    }
  }
}
</script>

<style>

</style>
