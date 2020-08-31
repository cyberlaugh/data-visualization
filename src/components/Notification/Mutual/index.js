import Notification from './mutualNotifier.vue'
import notify from './install'

export default (Vue) => {
  Vue.component(Notification.name, Notification)
  Vue.prototype.$mutualNotify = notify
}
