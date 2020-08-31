import Vue from 'vue'
import App from './App.vue'

import VCharts from 'v-charts'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import MutualNotification from './components/Notification/Mutual'
import SvgIcon from '@/components/SvgIcon'
import elDragDialog from './directives/el-dragDialog'
import './assets/myicons/iconfont.css'

Vue.use(VCharts)
Vue.use(Element)
Vue.use(MutualNotification)
// el-dialog可拖拽指令
Vue.use(elDragDialog)

// 全局注册svg-icon组件
Vue.component('svg-icon', SvgIcon)
const req = require.context('./assets/icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
