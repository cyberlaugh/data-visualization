function drag_insert(el,binding) {
  if (!el.dataset.sizeRatio && el.offsetHeight) {
    el.dataset.sizeRatio = el.offsetWidth / el.offsetHeight
  }
  if (!el.dataset.origWidth) {
    el.dataset.origWidth = el.style.width
    el.dataset.origHeight = el.style.height
    el.dataset.origPadding = el.style.padding
  }
  if(binding.modifiers.simple){
    let origHeight = el.style.height
    let origWidth = el.style.width
    if(origHeight.indexOf('px')>0){
      origHeight = origHeight.slice(0, origHeight.length-2)
    }
    if(origWidth.indexOf('px')>0){
      origWidth = origWidth.slice(0, origWidth.length-2)
    }

    el.style.position = 'fixed'
    el.style.top = `calc(50% - ${origHeight/2}px)`
    el.style.left = `calc(50% - ${origWidth/2}px)`
    el.style.boxShadow = 'rgba(60, 60, 60, 0.2) 1px 1px 4px'
    el.style.borderRadius = '10px'
    el.style.zIndex = '9999';
    el.style.backgroundColor = '#ffffff';
  }
  console.log('inserted')
}
function drag_update(el, binding) {
  let draggor
  let closor
  console.log('binding update')
  if (!binding.value) {
    draggor = el.querySelector('.drag-handle-canberemoved')
    if (draggor) {
      el.style.bottom = null
      el.style.right = null
      el.style.left = null
      el.style.top = null
      const origWidth = el.dataset.origWidth
      const origHeight = el.dataset.origHeight
      const origPadding = el.dataset.origPadding
      if (origWidth) { el.style.width = origWidth }
      if (origHeight) { el.style.height = origHeight }
      if (origPadding) { el.style.padding = origPadding }
      draggor.remove()
    }
    closor = el.querySelector('.css-drag-closor')
    if(closor){
      closor.remove()
    }
    if(!binding.modifiers.simple) return
  }

  draggor = el.querySelector('.drag-handle')
  if (!draggor) {
    if(!binding.modifiers.simple){
      el.style.padding = '30px'
      el.style.height = '100vh'
      el.style.width = el.dataset.sizeRatio ? `${100 * el.dataset.sizeRatio}vh` : '100vh'
    }

    draggor = document.createElement('div')
    // draggor.classList.add('drag-handle')
    draggor.setAttribute('draggable', true)
    
    draggor.className = 'drag-handle drag-handle-canberemoved'
    if(!binding.modifiers.simple){
      const wEl = `calc(${el.style.width} - 80px)`
      draggor.setAttribute('style', 'cursor:move;height:20px;width:' + wEl +
      ';margin-left:40px;border-radius:0 0 30px 30px; position:absolute;top:0;left:0;')
    }else{
      draggor.setAttribute('style', 'cursor:move;height:20px;width:100%;'+
      ';border-radius:0 0 30px 30px; position:absolute;top:0;left:0;')
    }
    if(binding.modifiers.closable){
      closor = document.createElement('span')
      closor.className = 'css-drag-closor iconfont icon-close'
      closor.setAttribute('style', 'cursor:pointer;position:absolute;top:12px;right:20px;z-index:20;')
      el.appendChild(closor)
      closor.addEventListener('click', function() {
        el.remove()
      }, false)
    }
    el.appendChild(draggor)
  }
  let isDrag = false
  let hasResetBottom = false

  const drag_position = {}

  // 开始拖拽
  draggor.addEventListener('dragstart', function(e) {
    if (e.target === draggor) {
      isDrag = true
      const { left, top } = el.getBoundingClientRect()
      drag_position.left = e.clientX - left
      drag_position.top = e.clientY - top
    }
  }, false)

  draggor.addEventListener('drag', function(e) {
    debounce(Fn)(e, el, document.documentElement, drag_position)
  }, false)
  // 拖拽结束
  draggor.addEventListener('dragend', function() {
    isDrag = false
  }, false)

  function debounce(fn, interval = 50) {
    var t = null
    return function(...args) {
      clearTimeout(t)
      t = setTimeout(() => {
        fn.apply(this, args)
      }, interval)
    }
  }

  // 防抖执行的函数
  function Fn(e, el, de, drag_position) {
    e.preventDefault()
    if (isDrag && e.clientX !== 0) {
      let left = e.clientX - drag_position.left
      let top = e.clientY - drag_position.top

      if (left > de.clientWidth - el.offsetWidth) {
        left = de.clientWidth - el.offsetWidth
      }
      if (left < 0) {
        left = 0
      }

      if (top > de.clientHeight - el.offsetHeight) {
        top = de.clientHeight - el.offsetHeight
      }
      if (top < 0) {
        top = 0
      }
      el.style.left = left + 'px'
      el.style.top = top + 'px'
      if (!hasResetBottom) {
        el.style.bottom = 'auto'
        el.style.right = 'auto'
        hasResetBottom = true
      }
    }
  }
}
export default {
  inserted: drag_insert,
  bind: drag_update,
  update: drag_update
}
