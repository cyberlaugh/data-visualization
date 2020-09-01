<!--
 * @Description:
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-08-31 11:47:03
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-09-01 10:16:12
-->
<template>
  <div>
    <trace-interop v-show="isTracing" v-model="stepInfo" @trace-points="tracePoints" />
    <div :id="chartID" v-loading="loading" :style="styleChartWrapper" />
  </div>
</template>

<script>
import echarts from 'echarts'
import windowresize from './mixins/windowresize'
import { getAllSelectedPoints } from '@/util/chart/pointpos'
import gradientColors from '@/util/chart/color'
import { cloneDeep } from 'lodash'
import TraceInterop from '@/components/charts/traceInterop'

export default {
  name: 'Scatter',
  components: {
    TraceInterop
  },
  mixins: [windowresize],
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    chartData: {
      type: Array,
      default: () => { return [] }
    },
    traceRange: {
      type: Array,
      default: () => { return [0, 0] }
    },
    traceOrderKey: {
      type: String, // 寻迹检索依据的排序字段
      default: 'time'
    }
  },
  data() {
    return {
      chart: null,
      options: null,
      loading: false,
      range: null,
      tracingPoints: [],
      tracingDataIndex: [], // [left,center,right]
      crntSelPoint: null,
      stepInfo: {
        size: 1, // 步长
        step: 10 // 步数
      },
      execStep: { // 正在检索的步数
        left: 0, // 左侧步数
        right: 0 // 右侧步数
      },
      traceColors: { // 寻迹点颜色渐变序列
        left: [],
        right: []
      },
      inRange: [0, 0],
      inRangeData: [],
      isTracing: false
    }
  },
  computed: {
    chartID() {
      return `chart_${this._uid}`
    },
    styleChartWrapper() {
      return {
        width: this.width,
        height: this.height,
        marginTop: '2px' }
    }
  },
  watch: {
    '$props.chartData': {
      handler(newer) {
        this.loading = true
        this.renderChart(newer)
      }
    }
  },
  mounted() {
    this.chart = echarts.init(document.getElementById(this.chartID))
    this.initOption()
    this.chart.on('brushSelected', this.onBrushFinished)
    this.chart.on('click', this.onChartClicked)
  },
  methods: {
    onBrushFinished(params) {
      console.log('sel params', params)
      if (params.batch.length > 0 && params.batch[0].areas.length > 0) {
        const shapes = params.batch[0].areas.map(c => {
          return {
            type: c.brushType,
            range: c.coordRange
          }
        })
        const allPoints = getAllSelectedPoints(this.$props.chartData, shapes)
        console.log('selPoints', allPoints)
      }
    },
    // 重置检索数据
    resetTracingData() {
      this.crntSelPoint = null
      this.execStep = { // 正在检索的步数
        left: 0, // 左侧步数
        right: 0 // 右侧步数
      }
      this.traceColors = { // 寻迹点颜色渐变序列
        left: [],
        right: []
      }
      this.inRange = [0, 0]
      this.inRangeData = []
      this.renderChart(this.chartData)
    },
    onChartClicked(params) {
      // 不是寻迹状态，或者正在寻迹过程中，鼠标点击都不做处理
      if (!this.isTracing || this.inRange[0] !== 0 || this.inRange[1] !== 0) return
      if (params.componentType === 'series') {
        // 数据点在原数组中的位置
        const d = params.data
        const crntDataIndex = this.chartData.findIndex(c => c[0] === d[0] && c[1] === d[1])
        if (crntDataIndex >= 0) {
          this.crntSelPoint = { index: crntDataIndex, data: params.data }
        }
      }
      // 设置渐变颜色范围
      const step = parseInt(this.stepInfo.step)
      this.traceColors.right = gradientColors('#ff0000', '#ffffff', step + 2).slice(1, step + 1)
      this.traceColors.left = gradientColors('#00ff00', '#ffffff', step + 2).slice(1, step + 1)
      console.log('this.traceColors', this.traceColors)
      this.setTracingCenterPoint()
    },
    // 设置寻迹中心点
    setTracingCenterPoint() {
      const pointsExcludeCenter = [...this.chartData]
      pointsExcludeCenter.splice(this.crntSelPoint.index, 1)
      const tempOption = cloneDeep(this.options)
      delete tempOption.series
      delete tempOption.visualMap
      console.log('option', tempOption)
      tempOption.series = [
        {
          type: 'scatter',
          name: 'center point',
          data: [[...this.crntSelPoint.data]],
          symbol: 'arrow',
          symbolSize: 20,
          itemStyle: {
            color: 'blue'
            // borderWidth:1,
            // borderColor:'#00ff00'
          }
        }, {
          type: 'scatter',
          data: pointsExcludeCenter,
          itemStyle: {
            color: '#ddd'
            // borderWidth:1,
            // borderColor:'#00ff00'
          },
          large: true,
          largeThreshold: 2000,
          animation: false
        }
      ]
      tempOption.toolbox.feature.myToolTrace.iconStyle = {
        color: this.isTracing ? 'red' : 'none'
      }
      this.chart.setOption(tempOption, true)
    },
    // 寻找点
    tracePoints(direction) {
      if (!this.crntSelPoint) {
        this.$message.error('请先选中点！')
        return
      }
      // 如果inrangeData为[0,0],高亮选中点，并以选中点为起点this.chartData
      if (this.inRange[0] === 0 && this.inRange[1] === 0) {
        this.inRange = [this.crntSelPoint.index, this.crntSelPoint.index]
      }

      let left = this.inRange[0]
      let right = this.inRange[1]

      if (direction === '-') {
        // 如果超出步数限制给出提示
        if (this.execStep.left >= this.stepInfo.step) {
          this.$message.info('已到步数限制！')
          return
        }
        // 向左移动
        for (let i = 0; i < this.stepInfo.size; i++) {
          if (left === 0) {
            this.$message.error('寻迹已达到数据首端！')
            return
          }
          left -= 1
          const pushData = [...this.chartData[left]]
          pushData.push(this.execStep.left)
          this.inRangeData.unshift(pushData)
        }
        this.execStep.left += 1
      }
      if (direction === '+') {
        // 如果超出步数限制给出提示
        if (this.execStep.right >= this.stepInfo.step) {
          this.$message.info('已到步数限制！')
          return
        }
        // 向右移动
        for (let i = 0; i < this.stepInfo.size; i++) {
          if (right + 1 >= this.chartData.length) {
            this.$message.error('寻迹已达到数据末端！')
            return
          }
          right += 1
          const pushData = [...this.chartData[right]]
          pushData.push(this.execStep.right)
          this.inRangeData.push(pushData)
        }
        this.execStep.right += 1
      }

      this.inRange = [left, right]

      const seriData = this.chartData.filter((c, i) => {
        return i < left || i > right
      })
      const traceData = cloneDeep(this.inRangeData)
      const crntSelPointValue = this.crntSelPoint.data[0]
      const colors = [[...this.traceColors.left], [...this.traceColors.right]]
      this.chart.setOption({
        series: [{
          type: 'scatter',
          name: 'center point',
          data: [[...this.crntSelPoint.data]],
          symbol: 'arrow',
          symbolSize: 20,
          itemStyle: {
            color: 'blue'
            // borderWidth:1,
            // borderColor:'#00ff00'
          }
        }, {
          type: 'scatter',
          data: seriData,
          itemStyle: {
            color: '#ddd'
            // borderWidth:1,
            // borderColor:'#00ff00'
          },
          large: true,
          largeThreshold: 2000,
          animation: false
        }, {
          type: 'scatter',
          data: traceData,
          symbol: 'circle',
          symbolSize: 12,
          itemStyle: {
            color: p => {
              if (p.value[0] >= crntSelPointValue) {
                return colors[1][p.value[2]]
              } else {
                return colors[0][p.value[2]]
              }
            }
          },
          emphasis: {
            label: {
              show: true,
              formatter: '{c}'
            }
          }
        }
        ],
        visualMap: [{
          type: 'piecewise',
          show: true,
          categories: [...new Array(this.traceColors.right.length).keys()],
          inRange: {
            color: [...this.traceColors.right]
          },
          dimension: 2,
          seriesIndex: 2
        }]
      })
    },
    initOption() {
      const self = this
      const tempOption = {
        title: {
          text: 'Dispersion of house price based on the area',
          left: 'center',
          top: 0,
          textStyle: {
            color: '#999'
          }
        },
        dataZoom: [
          {
            type: 'inside'
          },
          {
            type: 'slider'
          }
        ],
        brush: {
          throttleType: 'debounce',
          throttleDelay: 500,
          xAxisIndex: 0,
          yAxisIndex: 0,
          outOfBrush: {
            //   colorAlpha:0.1
            color: '#ddd'
          }
        },
        toolbox: {
          feature: {
            brush: {
              type: ['rect', 'polygon', 'keep', 'clear']
            },
            myTool1: {
              show: true,
              title: '导出数据',
              icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
              onclick: function() {
                self.chart.dispatchAction({
                  type: 'brush',
                  areas: [{
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    brushType: 'rect',
                    coordRange: [[24.83905579399142, 212.6072961373391], [13965.517241379312, 160448.27586206896]]
                  }]
                })
              }
            },
            myToolTrace: {
              show: true,
              title: '数据追踪',
              icon: 'path://M 865.75 327.64 a 82.6 82.6 0 0 0 -37 -45.36 L 553.78 123.55 a 82.66 82.66 0 0 0 -82.56 0 L 196.28 282.28 A 82.5 82.5 0 0 0 175.77 299 l -0.06 0.11 A 82.38 82.38 0 0 0 155 353.78 v 317.44 a 82.59 82.59 0 0 0 41.28 71.5 l 274.94 158.73 a 82.66 82.66 0 0 0 82.56 0 l 274.94 -158.73 a 82.58 82.58 0 0 0 41.28 -71.5 V 353.78 a 82.62 82.62 0 0 0 -4.25 -26.14 Z M 188.87 680.26 a 48.42 48.42 0 0 1 -0.85 -9 V 353.78 a 48.42 48.42 0 0 1 0.85 -9 L 370.34 449.5 a 48.5 48.5 0 0 0 -0.84 9 v 107.96 a 48.5 48.5 0 0 0 0.84 9 Z M 496 876.64 a 47.81 47.81 0 0 1 -8.26 -3.8 L 212.79 714.12 a 49.19 49.19 0 0 1 -7.4 -5.25 l 181.46 -104.76 a 49.58 49.58 0 0 0 7.42 5.25 l 93.46 53.95 a 48.45 48.45 0 0 0 8.26 3.8 Z m 0 -518.75 a 48.45 48.45 0 0 0 -8.26 3.8 l -93.46 53.95 a 49.58 49.58 0 0 0 -7.42 5.25 L 205.39 316.13 a 49.19 49.19 0 0 1 7.4 -5.25 l 274.94 -158.72 a 47.81 47.81 0 0 1 8.26 -3.8 Z m 33 -209.53 a 47.81 47.81 0 0 1 8.26 3.8 l 274.95 158.72 a 49.19 49.19 0 0 1 7.4 5.25 L 638.15 420.89 a 49.58 49.58 0 0 0 -7.42 -5.25 l -93.46 -53.95 a 48.45 48.45 0 0 0 -8.26 -3.8 Z m 283.2 565.76 L 537.27 872.84 a 47.81 47.81 0 0 1 -8.26 3.8 V 667.11 a 48.45 48.45 0 0 0 8.26 -3.8 l 93.46 -53.95 a 49.58 49.58 0 0 0 7.42 -5.25 l 181.46 104.76 a 49.19 49.19 0 0 1 -7.4 5.25 Z m 24.8 -42.9 a 48.42 48.42 0 0 1 -0.85 9 L 654.66 575.5 a 48.5 48.5 0 0 0 0.84 -9 V 458.54 a 48.5 48.5 0 0 0 -0.84 -9 l 181.47 -104.8 a 48.42 48.42 0 0 1 0.85 9 Z',
              onclick: function() {
                self.toggleTraceStatus()
              }
            },
            saveAsImage: {}
          }
        },
        visualMap: [{
          type: 'continuous',
          min: 15202,
          max: 159980,
          dimension: 1,
          itemWidth: 10,
          itemHeight: 300,
          orient: 'vertical',
          right: 10,
          top: 'center',
          text: ['HIGH', 'LOW'],
          calculable: true,
          inRange: {
            color: ['#dd4444', '#fec42c', '#80F1BE']
          }
        }],
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: [{
          type: 'value',
          splitLine: {
            show: false
          }
        }],
        yAxis: [{
          type: 'value'
        }],
        series: []
      }
      this.options = tempOption
    },
    // 切换数据追踪状态
    toggleTraceStatus() {
      this.isTracing = !this.isTracing
      const toolTrace = this.chart.getOption().toolbox[0].feature.myToolTrace
      console.log('this.getOption myToolTrace', toolTrace)

      toolTrace.iconStyle = {
        color: this.isTracing ? 'red' : 'none'
      }
      if (!this.isTracing) {
        this.resetTracingData()
      }
      this.chart.setOption({
        toolbox: {
          feature: {
            myToolTrace: toolTrace
          }
        }
      })
    },
    renderChart(data) {
      var itemStyle = {
        opacity: 0.8,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
      if (!this.chart || !this.options) { return }
      const series = []
      series.push({
        name: 'price-area',
        type: 'scatter',
        large: true,
        largeThreshold: 3000,
        itemStyle: itemStyle,
        symbolSize: 10,
        data: data
      })
      this.options.series = series
      this.chart.setOption(this.options, true)
      this.loading = false
    }
  }
}
</script>
