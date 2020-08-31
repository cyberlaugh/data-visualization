<template>
        <base-charts
        :chart-type="chart.chartType"
        :chart-data="chart.chartData"
        :chart-settings="chart.chartSettings"
        :chart-data-zoom="chart.chartDataZoom"
        :mark-line="chart.markLine"
        :toolbox="chart.toolbox"
        :chart-extend="chart.chartExtend"
        :axis="chart.axis"
        :height="commentHeight"
        :events="chart.events"
        width="100%" />
</template>

<script>
import BaseCharts from '../components/chart'
// import cloneDeep from 'lodash/cloneDeep'
export default {
    name: 'VLine',
    components:{ BaseCharts },
    data(){
        return {
            chart:{
                chartType:'ve-line',
                chartData:null,
                chartSettings:null,
                chartDataZoom:[{ type: 'slider' },{type:'inside'}] ,
                markLine:null,
                toolbox:null,
                chartExtend:null,
                axis:null,
                events:null
            },
            commentHeight:"800px"
        }
    },
    created(){
        this.chart.chartData={
            columns: ['日期', '访问用户', '下单用户', '下单率'],
            rows: [
            { '日期': '1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
            { '日期': '2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
            { '日期': '5', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
            { '日期': '10', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
            { '日期': '11', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
            { '日期': '20', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
            ]
        }
        this.chart.chartSettings = {
            xAxisType: 'value'
        }
        this.chart.toolbox = {
            feature: {
                dataZoom: {
                // yAxisIndex: true
                },
                restore: {},
            }
        }
        let k = this.chart.toolbox
        this.chart.chartExtend = {
           toolbox:{
               feature:{
                   ...k.feature,
                   magicType:{
                       show:true,
                       type:['line','bar']
                   }
                   // saveAsImage: {}
               }
           },
           brush: { 
            //    toolbox:['lineX','lineY','polygon'],
                brushLink: [0, 1],
                xAxisIndex: [1],
                brushMode:'multiple',
                // inBrush:{colorAlpha:0.1},
                throttleType:'debounce',
                throttleDelay:1000
            }
        }
        // var dataBySeries = [
        //     [ 12, 23, 54, 6 ], // series 0 的数据
        //     [ 34, 34433, 2223, 21122, 1232, 34 ] // series 1 的数据
        // ]
        this.chart.events ={
            brushSelected: function (params) {
            var brushComponent = params.batch[0];

            var sum = 0; // 统计选中项的数据值的和

            for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
                // 对于每个 series：
                var dataIndices = brushComponent.selected[sIdx].dataIndex;

                for (var i = 0; i < dataIndices.length; i++) {
                    var dataIndex = dataIndices[i];
                    sum += dataIndex;
                }
            }
            console.log(brushComponent.selected)
            console.log(sum); // 用某种方式输出统计值。
            }
        }
    }
}
</script>

<style>

</style>