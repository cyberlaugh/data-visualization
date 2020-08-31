<template>
<div style="overflow:auto;">
  <trace-interop v-show="isTracing" v-model="stepInfo" @trace-points="tracePoints"/>
  <h6><span>选中点：{{ crntSelPoint && crntSelPoint.data.join(', ')}}</span></h6>
  <div :id="chartID" v-loading="loading" :style="styleChartWrapper" />
</div>
</template>

<script>
import echarts from 'echarts';
import 'echarts-gl';
import { cloneDeep } from 'lodash'
import windowresize from './mixins/windowresize'
import gradientColors from '@/util/chart/color'
import TraceInterop from '@/components/charts/traceInterop'

export default {
  name: 'ScattersThreeD',
  components:{
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
    viewControl:{
      type:Object,
      default:null
    }
  },
  data() {
    return {
      chart: null,
      chartData: null,
      options: null,
      loading: true,
      mouseCurValue: null,
      crntSelPoint: null,
      stepInfo:{
        size:1, // 步长
        step:10, // 步数
      },
      execStep:{ // 正在检索的步数
        left:0, // 左侧步数
        right:0 // 右侧步数
      },
      traceColors:{ // 寻迹点颜色渐变序列
        left:[],
        right:[]
      },
      inRange:[0,0],
      inRangeData:[],
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
    '$props.viewControl' :{
      handler(newer){
        console.log(newer)
        // Object.assign(this.options.grid3D.viewControl,newer)
        // this.$set(this.options.grid3D.viewControl,'alpha',newer.alpha)
        // this.$set(this.options.grid3D.viewControl,'beta',newer.beta)
        console.log('this.options.grid3D.viewControl',this.options.grid3D.viewControl)
        this.chart.setOption({grid3D:{viewControl:{alpha:parseInt(newer.alpha),beta:parseInt(newer.beta)}}})
        // this.$nextTick(()=>{
        //   this.chart.setOption(this.options,{notMerge:true})
        // })        
      },
      deep:true
    }
  },
  mounted() {
    this.chart = echarts.init(document.getElementById(this.chartID))
    this.chart.on('click', this.onChartClicked)
    this.setOption()
    let mockData = this.mockData()
    this.chartData = mockData.sort((a,b)=>{
      return a[0]-b[0]
    })
    this.renderChart(cloneDeep(this.chartData))
  },
  methods: {
    resetOption(v){
      console.log('reset option',v)
      this.chart.setOption({grid3D:{viewControl:{alpha:v.alpha,beta:v.beta}}})
      setTimeout(() => {
        console.log('option',this.chart.getOption())
      }, 2000);
    },
    setOption() {
      const _self = this
      const tempOption = {
        grid3D: {
          viewControl:{
            autoRotate:false,
            // projection:'orthographic', // perspective
            alpha:this.viewControl.alpha,
            beta:this.viewControl.beta
          }
        },
        toolbox:{
          feature:{
            myToolTrace:{
              show:true,
              title:'数据追踪',
              icon:'path://M 865.75 327.64 a 82.6 82.6 0 0 0 -37 -45.36 L 553.78 123.55 a 82.66 82.66 0 0 0 -82.56 0 L 196.28 282.28 A 82.5 82.5 0 0 0 175.77 299 l -0.06 0.11 A 82.38 82.38 0 0 0 155 353.78 v 317.44 a 82.59 82.59 0 0 0 41.28 71.5 l 274.94 158.73 a 82.66 82.66 0 0 0 82.56 0 l 274.94 -158.73 a 82.58 82.58 0 0 0 41.28 -71.5 V 353.78 a 82.62 82.62 0 0 0 -4.25 -26.14 Z M 188.87 680.26 a 48.42 48.42 0 0 1 -0.85 -9 V 353.78 a 48.42 48.42 0 0 1 0.85 -9 L 370.34 449.5 a 48.5 48.5 0 0 0 -0.84 9 v 107.96 a 48.5 48.5 0 0 0 0.84 9 Z M 496 876.64 a 47.81 47.81 0 0 1 -8.26 -3.8 L 212.79 714.12 a 49.19 49.19 0 0 1 -7.4 -5.25 l 181.46 -104.76 a 49.58 49.58 0 0 0 7.42 5.25 l 93.46 53.95 a 48.45 48.45 0 0 0 8.26 3.8 Z m 0 -518.75 a 48.45 48.45 0 0 0 -8.26 3.8 l -93.46 53.95 a 49.58 49.58 0 0 0 -7.42 5.25 L 205.39 316.13 a 49.19 49.19 0 0 1 7.4 -5.25 l 274.94 -158.72 a 47.81 47.81 0 0 1 8.26 -3.8 Z m 33 -209.53 a 47.81 47.81 0 0 1 8.26 3.8 l 274.95 158.72 a 49.19 49.19 0 0 1 7.4 5.25 L 638.15 420.89 a 49.58 49.58 0 0 0 -7.42 -5.25 l -93.46 -53.95 a 48.45 48.45 0 0 0 -8.26 -3.8 Z m 283.2 565.76 L 537.27 872.84 a 47.81 47.81 0 0 1 -8.26 3.8 V 667.11 a 48.45 48.45 0 0 0 8.26 -3.8 l 93.46 -53.95 a 49.58 49.58 0 0 0 7.42 -5.25 l 181.46 104.76 a 49.19 49.19 0 0 1 -7.4 5.25 Z m 24.8 -42.9 a 48.42 48.42 0 0 1 -0.85 9 L 654.66 575.5 a 48.5 48.5 0 0 0 0.84 -9 V 458.54 a 48.5 48.5 0 0 0 -0.84 -9 l 181.47 -104.8 a 48.42 48.42 0 0 1 0.85 9 Z',
              onclick:function(){
                _self.toggleTraceStatus()
              }
            }
          }
        },
        xAxis3D: {},
        yAxis3D: {},
        zAxis3D: { max: 100 },
        series: [{
            type: 'scatter3D',
            data: []
        }]
      }
      this.options = tempOption
    },
    toggleTraceStatus(){
      const _self = this
      this.isTracing = !this.isTracing
      let toolboxConfig={
          feature:{
            myToolTrace:{
              show:true,
              title:'数据追踪',
              icon:'path://M 865.75 327.64 a 82.6 82.6 0 0 0 -37 -45.36 L 553.78 123.55 a 82.66 82.66 0 0 0 -82.56 0 L 196.28 282.28 A 82.5 82.5 0 0 0 175.77 299 l -0.06 0.11 A 82.38 82.38 0 0 0 155 353.78 v 317.44 a 82.59 82.59 0 0 0 41.28 71.5 l 274.94 158.73 a 82.66 82.66 0 0 0 82.56 0 l 274.94 -158.73 a 82.58 82.58 0 0 0 41.28 -71.5 V 353.78 a 82.62 82.62 0 0 0 -4.25 -26.14 Z M 188.87 680.26 a 48.42 48.42 0 0 1 -0.85 -9 V 353.78 a 48.42 48.42 0 0 1 0.85 -9 L 370.34 449.5 a 48.5 48.5 0 0 0 -0.84 9 v 107.96 a 48.5 48.5 0 0 0 0.84 9 Z M 496 876.64 a 47.81 47.81 0 0 1 -8.26 -3.8 L 212.79 714.12 a 49.19 49.19 0 0 1 -7.4 -5.25 l 181.46 -104.76 a 49.58 49.58 0 0 0 7.42 5.25 l 93.46 53.95 a 48.45 48.45 0 0 0 8.26 3.8 Z m 0 -518.75 a 48.45 48.45 0 0 0 -8.26 3.8 l -93.46 53.95 a 49.58 49.58 0 0 0 -7.42 5.25 L 205.39 316.13 a 49.19 49.19 0 0 1 7.4 -5.25 l 274.94 -158.72 a 47.81 47.81 0 0 1 8.26 -3.8 Z m 33 -209.53 a 47.81 47.81 0 0 1 8.26 3.8 l 274.95 158.72 a 49.19 49.19 0 0 1 7.4 5.25 L 638.15 420.89 a 49.58 49.58 0 0 0 -7.42 -5.25 l -93.46 -53.95 a 48.45 48.45 0 0 0 -8.26 -3.8 Z m 283.2 565.76 L 537.27 872.84 a 47.81 47.81 0 0 1 -8.26 3.8 V 667.11 a 48.45 48.45 0 0 0 8.26 -3.8 l 93.46 -53.95 a 49.58 49.58 0 0 0 7.42 -5.25 l 181.46 104.76 a 49.19 49.19 0 0 1 -7.4 5.25 Z m 24.8 -42.9 a 48.42 48.42 0 0 1 -0.85 9 L 654.66 575.5 a 48.5 48.5 0 0 0 0.84 -9 V 458.54 a 48.5 48.5 0 0 0 -0.84 -9 l 181.47 -104.8 a 48.42 48.42 0 0 1 0.85 9 Z',
              onclick:function(){
                _self.toggleTraceStatus()
              }
            }
          }
        }
      if(_self.isTracing){
        toolboxConfig.iconStyle= {
          color:'red',
        }
      }else{
        toolboxConfig.iconStyle= {
          color:'none',
        }
        this.resetTracingData()
      }
      this.chart.setOption({
        toolbox:toolboxConfig
      })
    },
    onChartClicked(params){
      // 不是寻迹状态，或者正在寻迹过程中，鼠标点击都不做处理
      if(!this.isTracing || this.inRange[0]!==0 || this.inRange[1]!==0 ) return
      if(params.componentType === 'series'){
        // 数据点在原数组中的位置
        let d=params.data
        const crntDataIndex = this.chartData.findIndex(c=>c[0]===d[0] && c[1]===d[1] && c[2]===d[2])
        if(crntDataIndex>=0) {
          this.crntSelPoint = { index:crntDataIndex, data:params.data}
        }
      }
      // 设置渐变颜色范围
      const step = parseInt(this.stepInfo.step)
      this.traceColors.right = gradientColors('#ff0000','#ffffff',step+2).slice(1,step+1)
      this.traceColors.left = gradientColors('#00ff00','#ffffff',step+2).slice(1,step+1)
      console.log('this.traceColors', this.traceColors)
      this.setTracingCenterPoint()
    },
    // 重置检索数据
    resetTracingData(){
      this.crntSelPoint = null
      this.execStep = { // 正在检索的步数
        left:0, // 左侧步数
        right:0 // 右侧步数
      }
      this.traceColors = { // 寻迹点颜色渐变序列
        left:[],
        right:[]
      }
      this.inRange = [0,0]
      this.inRangeData = []
      this.options.series =  [{
        type: 'scatter3D',
        data: this.chartData
      }]
      this.chart.setOption(this.options,true)
    },
    // 设置寻迹中心点
    setTracingCenterPoint(){
      const pointsExcludeCenter = [...this.chartData]
      pointsExcludeCenter.splice(this.crntSelPoint.index,1)
      this.chart.setOption({
        series:[
          {
            type:'scatter3D',
            name:'center point',
            data:[[...this.crntSelPoint.data]],
            symbol:'arrow',
            symbolSize:20,
            itemStyle:{
              color:'blue',
              // borderWidth:1,
              // borderColor:'#00ff00'
            }
          },{
            type:'scatter3D',
            data:pointsExcludeCenter,
            itemStyle:{
              color:'#ddd',
              // borderWidth:1,
              // borderColor:'#00ff00'
            },
            animation:false
          }
        ]
      })
      console.log('this.chart.getOption',this.chart.getOption())
    },
    // 寻找点
    tracePoints(direction){
      if(!this.crntSelPoint){
        this.$message.error('请先选中点！')
        return
      }
      // 如果inrangeData为[0,0],高亮选中点，并以选中点为起点this.chartData
      if(this.inRange[0] === 0 && this.inRange[1] === 0){
        this.inRange = [this.crntSelPoint.index,this.crntSelPoint.index]
      }
      
      let left = this.inRange[0]
      let right = this.inRange[1]
      
      if(direction === '-'){
        // 如果超出步数限制给出提示
        if(this.execStep.left >= this.stepInfo.step){
          this.$message.info('已到步数限制！')
          return
        }
        //向左移动
        for(let i=0;i<this.stepInfo.size;i++){
          left -= 1
          if(left<0){
            this.$message.error('寻迹已达到数据首端！')
            return
          }
          let pushData = [...this.chartData[left]]
          pushData.push(this.execStep.left)
          this.inRangeData.unshift(pushData)
        }
        this.execStep.left += 1
      }
      if(direction === '+'){
        // 如果超出步数限制给出提示
        if(this.execStep.right >= this.stepInfo.step){
          this.$message.info('已到步数限制！')
          return
        }
        //向右移动
        for(let i=0;i<this.stepInfo.size;i++){
          right += 1
          if(right>=this.chartData.length){
            this.$message.error('寻迹已达到数据末端！')
            return
          }
          let pushData = [...this.chartData[right]]
          pushData.push(this.execStep.right)
          this.inRangeData.push(pushData)
        }
        this.execStep.right += 1
      }

      if(left<0) left =0
      if(right>=this.chartData.length) right = this.chartData.length-1
      this.inRange = [left,right]
      
      const seriData = this.chartData.filter((c,i)=>{
        return i<left || i>right
      })
      const traceData = cloneDeep(this.inRangeData)
      const crntSelPointValue = this.crntSelPoint.data[0]
      const colors = [[...this.traceColors.left],[...this.traceColors.right]]
      this.chart.setOption({
        series:[{
            type:'scatter3D',
            name:'center point',
            data:[[...this.crntSelPoint.data]],
            symbol:'arrow',
            symbolSize:20,
            itemStyle:{
              color:'blue',
              // borderWidth:1,
              // borderColor:'#00ff00'
            }
          },{
            type:'scatter3D',
            data:seriData,
            itemStyle:{
              color:'#ddd',
              // borderWidth:1,
              // borderColor:'#00ff00'
            },
            animation:false
          },{
            type:'scatter3D',
            data:traceData,
            symbol:'circle',
            symbolSize:12,
            itemStyle:{
              color:p=>{
                if(p.value[0] >= crntSelPointValue){
                  return colors[1][p.value[3]]
                }else{
                  return colors[0][p.value[3]]
                }                
              }
            },
            emphasis:{
              // itemStyle:{
              //   color:'black',
              //   borderColor:'#fff'
              // },       
              label:{
                show:true,
                formatter:'{c}'
              }
            }
          }
        ],
        visualMap:[{
          type:'piecewise',
          show:true,
          categories:[...new Array(this.traceColors.right.length).keys()],
          inRange:{
            color:[...this.traceColors.right]
          },
          dimension:3,
          seriesIndex:2
        }]
      })
      console.log('get option after trace', this.chart.getOption().series)
    },
    makeGaussian(amplitude, x0, y0, sigmaX, sigmaY) {
        return function (amplitude, x0, y0, sigmaX, sigmaY, x, y) {
            var exponent = -(
                    ( Math.pow(x - x0, 2) / (2 * Math.pow(sigmaX, 2)))
                    + ( Math.pow(y - y0, 2) / (2 * Math.pow(sigmaY, 2)))
                );
            return amplitude * Math.pow(Math.E, exponent);
        }.bind(null, amplitude, x0, y0, sigmaX, sigmaY);
    },
    mockData(){
      // 创建一个高斯分布函数
      var gaussian = this.makeGaussian(50, 0, 0, 20, 20);

      var data = [];
      for (var i = 0; i < 3000; i++) {
          // x, y 随机分布
          var x = Math.random() * 100 - 50;
          var y = Math.random() * 100 - 50;
          var z = gaussian(x, y);
          data.push([x, y, z]);
      }
      return data
    },
    renderChart(data) {
      if (!this.chart || !this.options) { return }
      this.options.series[0].data = data
      this.chart.setOption(this.options)
      this.loading = false
    }
  }
}
</script>
