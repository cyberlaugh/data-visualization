<template>
  <div class="wrapper-custom-view">
    <section class="container-filter">
      <header>查询条件</header>
      <hr>
      <div class="select-date">
        <div>开始时间</div>
        <div>
          <el-date-picker
            v-model="dateStart"
            type="date"
            value-format="yyyy-MM-dd"
            size="small"
          />
        </div>
        <div>结束时间</div>
        <div>
          <el-date-picker
            v-model="dateEnd"
            type="date"
            value-format="yyyy-MM-dd"
            size="small"
          />
        </div>
      </div>
      <div class="btn-query">
        <el-button type="primary">
          查询
        </el-button>
      </div>
      <hr>
      <div class="tree-region">
        <el-tree
          ref="treeRegion"
          :data="dataTreeRegion"
          :default-expanded-keys="['00','01']"
          :props="{children:'children',label:'label'}"
          node-key="id"
          highlight-current
          @node-click="treeRegionClicked"
        />
      </div>
    </section>
    <div v-loading="isloading" class="container-report">
      <div class="report-left">
        <div class="report-left-top">
          <div class="left-top-left">
            <card icon-class="el-icon-save" head-title="基础信息" :content="baseInfo" />
            <div class="elec-level" />
            <div class="use-rate" />
          </div>
          <div class="left-top-right map">
            <province-map v-if="crntView && crntView.code" :province="crntView" @backToChina="backToChina" />
            <china-map v-else @drilldown="drilldown" />
          </div>
        </div>
        <div class="report-left-bottom">
          <div class="left-bottom-left" />
          <div class="left-bottom-center" />
          <div class="left-bottom-right" />
        </div>
      </div>
      <div class="report-right">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  </div>
</template>

<script>

import ChinaMap from '@/components/Charts/chinamap'
import ProvinceMap from '@/components/Charts/chinamap/province.vue'
import Card from './widgets/card.vue'
export default {
  components: {
    ChinaMap,
    ProvinceMap,
    Card
  },
  data() {
    return {
      dateStart: '',
      dateEnd: '',
      dataTreeRegion: [],
      isloading: true,
      crntView: null, // 中国、区域、场站
      baseInfo: null // 基础信息
    }
  },
  created() {
    this.dataTreeRegion = [{
      label: '风电公司',
      id: '00',
      children: [{
        label: '张北区域',
        id: '01',
        children: [
          { label: '场站A', id: '01-001' },
          { label: '场站B', id: '01-002' },
          { label: '场站C', id: '01-003' }
        ]
      }, {
        label: '新疆区域',
        id: '02',
        children: [
          { label: '场站A', id: '02-001' },
          { label: '场站B', id: '02-002' },
          { label: '场站C', id: '02-003' }
        ]
      }, {
        label: '甘肃区域',
        id: '03',
        children: [
          { label: '场站A', id: '03-001' },
          { label: '场站A', id: '03-002' },
          { label: '场站A', id: '03-003' },
          { label: '场站B', id: '03-004' },
          { label: '场站C', id: '03-005' }
        ]
      }, {
        label: '蒙西区域',
        id: '04',
        children: [
          { label: '场站A', id: '04-001' },
          { label: '场站B', id: '04-002' },
          { label: '场站C', id: '04-003' }
        ]
      }, {
        label: '蒙东区域',
        id: '05',
        children: [
          { label: '场站A', id: '05-001' },
          { label: '场站A', id: '05-001' },
          { label: '场站B', id: '05-002' },
          { label: '场站C', id: '05-003' }
        ]
      }, {
        label: '青海区域',
        id: '06',
        children: [
          { label: '场站A', id: '06-001' },
          { label: '场站B', id: '06-002' },
          { label: '场站C', id: '06-003' }
        ]
      }, {
        label: '西中区域',
        id: '07'
      }, {
        label: '五峰区域',
        id: '08'
      }, {
        label: '甘肃区域',
        id: '09'
      }, {
        label: '甘肃区域',
        id: '10'
      }]
    }]

    // 获取基础信息
    this.baseInfo = [{
      name: '装机容量',
      value: 150.38,
      unit: 'ww'
    }, {
      name: '电站数量',
      value: 30,
      unit: '家'
    }, {
      name: '网站数量',
      value: 1300,
      unit: '台'
    }]
  },
  mounted() {
    this.$refs.treeRegion.setCurrentKey('00')
    this.isloading = false
  },
  methods: {
    treeRegionClicked(node) {
      console.log('treeRegionClicked', node)
    },
    backToChina() {
      this.crntView = null
    },
    drilldown(params) {
      console.log('drilldown', params)
      this.crntView = { ...params }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.wrapper-custom-view{
  height: 100%;
  display: flex;
  font-size: 12px;
  box-sizing: border-box;
  .container-filter{
    width:200px;
    background:#fff;
    color:#333;
    padding:16px;
    font-size: 14px;
    min-height: 832px;
    header{
      padding:0 8px 2px 8px;
      font-weight: 600;
      line-height: 21px;
      letter-spacing: 1px;
    }
    hr{
      margin-bottom: 16px;
      border:none;
      height:1px;
      width:168px;
      background: #e6e6e6;
    }
    .select-date{
      box-sizing: border-box;
      &>div{
        margin: 8px;
        .el-date-editor.el-input{
          width:100%;
        }
      }
    }
    .btn-query{
      padding:8px;
      .el-button{
        width: 100%;
        height: 32px;
        background: #2B5BD6;
        border-radius: 4px;
        font-size: 14px;
        letter-spacing: 2px;
      }
    }
    .tree-region{
      height: calc(100% - 260px);
      overflow-y: auto;
      .el-tree{
        /deep/ .el-tree-node{
          box-sizing: border-box;
          &.is-current > .el-tree-node__content{
            color: #123ECC;
            background: rgba(18, 62, 204, 0.05);
            border-right: 4px solid #123ECC;
          }
          .el-tree-node__content{
            height:2rem;
            .el-tree-node__label{
              font-size: .875rem;
            }
          }
        }
      }
    }
  }
  .container-report{
    background: #EDEFF3;
    height: 100%;
    flex:1;
    display: flex;
    .report-left{
      height: 100%;
      flex:1 0 1248px;
      .report-left-top{
        height:544px;
        display: flex;
        .left-top-left{
          width:432px;
          flex:0 0 432px;
          padding:16px;
          &>div{
            margin-bottom:16px;
            width:100%;
            height:144px;
            border-radius: 8px;
            // border: 1px solid #F4F6F9;
            background: #fff;
            &.elec-level{
              height:192px;
            }
          }
        }
        .left-top-right{
          flex:1;
          margin:16px 0;
          min-width: 816px;
          height: 512px;
          background: #FFFFFF;
          border-radius: 8px;
          // border: 1px solid #F4F6F9;
        }
      }
      .report-left-bottom{
        height:calc(100% - 544px);
        min-height: 320px;
        display: flex;
        flex:1;
        padding:0 0 16px 16px;
        &>div{
          width: 320px;
          height: 304px;
          background: #FFFFFF;
          border-radius: 8px;
          margin-right: 16px;
          // border: 1px solid #F4F6F9;
          &.left-bottom-left{
            width:480px;
          }
          &.left-bottom-right{
            width:400px;
            margin-right:0;
          }
        }
      }
    }
    .report-right{
      width:392px;
      height: 100%;
      &>div{
        width: 360px;
        height: 196px;
        background: #FFFFFF;
        border-radius: 8px;
        // border: 1px solid #F4F6F9;
        margin:16px;
      }
    }
  }
}
.splitpanes.default-theme /deep/ .splitpanes__splitter{
  background-color: transparent;
}
</style>
