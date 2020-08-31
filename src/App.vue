<template>
  <div id="app">
    <!-- <v-select-rich /> -->
    <!-- <v-line /> -->
    <!-- <mutual-notifier content="静态通知。。。" /> -->
    <!-- <horizontal-stackbar height="800px" /> -->
    <VScatter height="800px" />
    <scatter3d />
    <!-- <input type="text" value="" placeholder="请输入" /> -->
    <!-- <drag-test /> -->
    <!-- <TransferTest /> -->
  </div>
</template>

<script>
// import VLine from './views/line.vue'
// import VSelectRich from './views/widgets/vSelectRich.vue'
// import HorizontalStackbar from './components/HorizontalStackbar'
import scatter3d from './views/charts/scatter3d'
// import vTypeSelect from './views/widgets/typeSelect.vue'
import VScatter from './views/charts/scatter'
// import DragTest from './views/interop/dragtest'
// import TransferTest from './views/transferTest'

export default {
  name: 'App',
  components: {
    // VSelectRich,
    VScatter,
    scatter3d
     // TransferTest
    },    
  mounted() {
    // this.$mutualNotify({
    //   autoClose: false, // true,
    //   content: '动态信息通知。。。',
    //   btn: '确定'
    // }, {
    //   onClose: function() { this.visible = false },
    //   onStateChange: function(status) {
    //     console.log('stateUpdate...', status)
    //     // 更新store状态
    //   }
    // })
    // var notify2 = this.$mutualNotify({
    //   // autoClose: false,
    //   content: '动态信息通知222222222222222',
    //   btn: '确定'
    // }, {
    //   onClose: function() {},
    //   onStateChange: function(status) {
    //     console.log('stateUpdate...', status)
    //     // 更新store状态
    //   }
    // })
    // var notify3 = this.$mutualNotify({
    //   // autoClose: false,
    //   doneRouter: { linkText: '立即查看', url: '', param: null },
    //   content: '动态信息通知333333333333333',
    //   btn: '确定'
    // }, {
    //   onClose: function() {},
    //   onStateChange: function(status) {
    //     console.log('stateUpdate...', status)
    //     // 更新store状态
    //   },
    //   onRedirect: function(rout) {
    //     this.visible = false
    //     console.log(this.state, rout)
    //   }
    // })

    // setTimeout(() => {
    //   notify2.updateStatus('fail', '出错了！！！！')
    //   notify3.updateStatus('done', '保存成功！')
    // }, 5000)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding:20px;
}
</style>
