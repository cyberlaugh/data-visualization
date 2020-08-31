<template>
    <div class="wrapper-trace-interop">    
    每次搜寻<input type="number" v-model="stepSize" />个点,
    搜寻<input type="number" v-model="step" />次
    <button @click="tracePoints('-')">&lt;</button>
    <button @click="tracePoints('+')">&gt;</button>
  </div>  
</template>

<script>
export default {
    model:{
        prop:'stepInfo',
        event:'stepChange'
    },
    props:{
        stepInfo:{
            type:Object,
            default:()=>{return { step:10,size:1}}
        }
    },
    data(){
        return {
            stepSize:1,
            step:10
        }
    },
    watch:{
        stepSize(newer){
            this.$emit('stepChange',{step:this.step,size:newer})
        },
        step(newer){
            this.$emit('stepChange',{step:newer,size:this.stepSize})
        }
    },
    methods:{
        tracePoints(sign){
            this.$emit('trace-points',sign)
        }
    },
    mounted(){
        this.stepSize = this.stepInfo.size
        this.step = this.stepInfo.step
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