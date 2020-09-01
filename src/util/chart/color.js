/*
 * @Description:颜色处理工具类
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-08-31 11:47:03
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-09-01 12:26:31
 */
// convert #hex notation to rgb array
var parseColor = function(hexStr) {
  return hexStr.length === 4 ? hexStr.substr(1).split('').map(function(s) { return 0x11 * parseInt(s, 16) }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function(s) { return parseInt(s, 16) })
}

// zero-pad 1 digit to 2
var pad = function(s) {
  return (s.length === 1) ? '0' + s : s
}

// gradientColors('#00ff00', '#ff0000', 100)) gradientColors('#000', '#fff', 100, 2.2))
var gradientColors = function(start, end, steps, gamma) {
  var i; var j; var ms; var me; var output = []; var so = []
  gamma = gamma || 1
  var normalize = function(channel) {
    return Math.pow(channel / 255, gamma)
  }
  start = parseColor(start).map(normalize)
  end = parseColor(end).map(normalize)
  for (i = 0; i < steps; i++) {
    ms = i / (steps - 1)
    me = 1 - ms
    for (j = 0; j < 3; j++) {
      so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16))
    }
    output.push('#' + so.join(''))
  }
  return output
}

export default gradientColors
