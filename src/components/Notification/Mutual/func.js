import Notification from './mutualNotifier.vue'

export default {
  extends: Notification,
  data() {
    return {
      verticalOffset: 0,
      autoClose: false // 3000
    }
  },
  computed: {
    style() {
      return {
        position: 'fixed',
        right: '20px',
        top: `${this.verticalOffset}px`
      }
    }
  },
  mounted() {
    this.createTimer()
  },
  beforeDestory() {
    this.clearTimer()
  },
  methods: {
    createTimer() {
      if (this.autoClose) {
        this.timer = setTimeout(() => {
          this.visible = false
        }, this.autoClose)
      }
    },
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    }
  }
}
