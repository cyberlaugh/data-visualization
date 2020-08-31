<template>
  <div>
      <h3 style="margin-bottom:20px;">可控视角散点图</h3>
      <section class="region-rotatecontrol">
        <span>垂直角度:</span><el-input type="number" v-model="viewControl.alpha" min="-90" max="90"></el-input>
        <span>水平角度:</span><el-input type="number" v-model="viewControl.beta" min="-90" max="90"></el-input>
        <button @click="viewfocus">定焦</button>
        <!-- <span>z:</span><el-input v-model="z"></el-input> -->
      </section>
      <hr>
      <scattersthreed ref='scattersthreed' height="800px" :view-control="viewControl" />
  </div>
</template>

<script>
import scattersthreed from '@/components/charts/scattersthreed'
export default {
    name:'scatter3dview',
    components:{
        scattersthreed
    },
    data(){
        return {
            viewControl:{
                alpha:20,
                beta:40
            }
            // z:0
        }
    },
    methods:{
        viewfocus(){
            this.$refs.scattersthreed.resetOption(this.viewControl)
        }
    }
}
</script>

<style lang="scss"  scoped>
.region-rotatecontrol{
    /deep/ .el-input{
        width: 200px;
        margin: 0 .5em;
    }
}
</style>