import Vue from 'vue'
import Component from './func'

const NotificationConstructor = Vue.extend(Component)
const instances = []
let seed = 1
// computed height
let verticalOffset = 70
const OFFSET_START = 70
const OFFSET_GAP = 24

const removeNotifier = (ins) => {
  const idxItem = instances.indexOf(ins)
  if (idxItem >= 0) {
    instances.splice(idxItem, 1)
  }
}

const relayItems = () => {
  verticalOffset = OFFSET_START
  instances.forEach((item) => {
    // component gap
    if (item.visible) {
      item.verticalOffset = verticalOffset
      verticalOffset += item.$el.offsetHeight + OFFSET_GAP
    }
  })
}

const notify = (options, events) => {
  if (Vue.prototype.$isServer) return

  const {
    autoClose,
    autoCloseOnSuccess,
    ...rest
  } = options

  const {
    onClose,
    onStateChange,
    onRedirect
  } = events

  const instance = new NotificationConstructor({
    propsData: {
      ...rest
    },
    data: {
      autoClose: autoClose === undefined ? false : autoClose,
      autoCloseOnSuccess: autoCloseOnSuccess === undefined ? false : autoCloseOnSuccess
    }
  })

  instance.id = `mutualnotification_${seed++}`
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)

  verticalOffset = OFFSET_START
  instances.forEach((item) => {
    verticalOffset += item.$el.offsetHeight + OFFSET_GAP
  })

  instance.verticalOffset = verticalOffset

  instance.$on('close', (vm) => {
    vm.visible = false
    vm.$nextTick(() => {
      relayItems()
    })
    if (typeof onClose === 'function') {
      onClose.call(vm)
      console.log(vm)
      if (vm.state !== 'running') {
        removeNotifier(instance)
      }
      console.log('instances', instances)
    }
  }).$on('stateChange', (vm, status) => {
    vm.visible = true
    vm.$nextTick(() => {
      relayItems()
    })
    if (typeof onStateChange === 'function') {
      onStateChange.call(vm, status)
    }
  }).$on('redirect', (vm, rout) => {
    vm.visible = false
    if (typeof onRedirect === 'function' && rout) {
      onRedirect.call(vm, rout)
      removeNotifier(instance)
    }
  })

  instances.push(instance)
  return instance.vm
}

export default notify
