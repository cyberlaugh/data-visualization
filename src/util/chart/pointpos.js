export var isInPolygon = (checkPoint, polygonPoints) => {
    var counter = 0;
    var i;
    var xinters;
    var p1, p2;
    var pointCount = polygonPoints.length;
    p1 = polygonPoints[0];

    for (i = 1; i <= pointCount; i++) {
      p2 = polygonPoints[i % pointCount];
      if (
        checkPoint[0] > Math.min(p1[0], p2[0]) &&
        checkPoint[0] <= Math.max(p1[0], p2[0])
      ) {
        if (checkPoint[1] <= Math.max(p1[1], p2[1])) {
          if (p1[0] != p2[0]) {
            xinters =
              ((checkPoint[0] - p1[0]) * (p2[1] - p1[1])) / (p2[0] - p1[0]) +
              p1[1];
            if (p1[1] == p2[1] || checkPoint[1] <= xinters) {
              counter++;
            }
          }
        }
      }
      p1 = p2;
    }
    if (counter % 2 == 0) {
      return false;
    } else {
      return true;
    }
  }

    /**
   * @description 判断点是否在矩形内部
   * @param {Array} p 待判断点[x,y]
   * @param {Array} rect 矩形，[[x1,x2],[y1,y2]]
   * @param {bool} excludeOn 落在矩形的点是否包括在内
   * @return {bool} 点 p 是否在矩形的内部
   */
  var isInRect = (p,rect,excludeOn = false) =>{
    var px = p[0], py = p[1]
    if(!excludeOn){
        return px>rect[0][0] && px<rect[0][1] && py>rect[1][0] && py<rect[1][1]
    }
    return px>=rect[0][0] && px<=rect[0][1] && py>=rect[1][0] && py<=rect[1][1]
  }

  /**
   * @description 判断点是否在多边形内部
   * @param {Array} p 待判断点[x,y]
   * @param {Array} poly 多边形顶点，[[p1x,p1y],[p2x,p2y],[p3x,p3y]...]
   * @param {bool} excludeOn 落在多边形上的点是否包括在内
   * @return {bool} 点 p 是否在 poly的内部
   */
   var isInPloy = (p, poly, excludeOn = false) => {
    var px = p[0],
        py = p[1],
        flag = false

    for(var i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
      // 多边形的一个边
      var sourceX = poly[i][0],
          sourceY = poly[i][1],
          targetX = poly[j][0],
          targetY = poly[j][1]
      // 点是多边形的一个顶点
      if((sourceX === px && sourceY === py) || (targetX === px && targetY === py)) {
        return !excludeOn
      }

      // 判断线段两端点是否在射线两侧
      if((sourceY < py && targetY >= py) || (sourceY >= py && targetY < py)) {
        // 边与射线 Y 坐标相同的点的 X 坐标 （射线与边交叉点x坐标）
        var x = sourceX + (py - sourceY) * (targetX - sourceX) / (targetY - sourceY)

        // 点在多边形的边上
        if(x === px) {
          return !excludeOn
        }

        // 射线穿过多边形
        if(x > px) {
          // 循环奇数时点在多边形内
          flag = !flag
        }
      }
    }   
    return flag
  }
  /**
   * @description 获取点
   * @param {Array} arrP 所有的待判定点 [[x1,y1],[x2,y2],...]
   * @param {Array} shape 多边形顶点，任意多边形：[[p1x,p1y],[p2x,p2y],[p3x,p3y]...] 矩形[[x1,x2],[y1,y2]]
   * @param {string}} type 多边形类型'rect'或者'polygon'
   * @return {Array} 返回所有多边形内部的点
   */
  export var getAllInPoints = (arrP,shape,type)=>{
      if(type === 'rect'){
          return arrP.filter(c=>{
              return isInRect(c,shape)
          })
      }
      // 先确定多边形区域，覆盖的矩形范围，初步筛选点
      let minRegionX = Math.min.apply(Math, shape.map(c=>c[0]))
      let maxRegionX = Math.max.apply(Math, shape.map(c=>c[0]))
      let minRegionY = Math.min.apply(Math, shape.map(c=>c[1]))
      let maxRegionY = Math.max.apply(Math, shape.map(c=>c[1]))
      let polygonRegionData = arrP.filter(c=>{
          return isInRect(c,[[minRegionX,maxRegionX],[minRegionY,maxRegionY]])
      })
     return polygonRegionData.filter(c=>{
        return isInPloy(c,shape)
    })
  }
    /**
   * @description 获取多选区的选中点
   * @param {Array} arrP 所有的待判定点 [[x1,y1],[x2,y2],...]
   * @param {Array[Object]} shapes 多边形数组：[{type:'polygon',range:[[p1x,p1y],[p2x,p2y],[p3x,p3y]...]},{type:'rect',range:[[x1,x2],[y1,y2]]}]
   * @return {Array} 返回所有多边形内部的点
   */
  export var getAllSelectedPoints = (arrp, shapes)=>{
      if(shapes.length === 0) return []
      return arrp.filter(c=>{
          let flag = false, shape
          for(let i=0,len=shapes.length;i<len;i++){
              shape = shapes[i]
              if(shape.type === 'rect' && isInRect(c,shape.range) 
              || shape.type === 'polygon' && isInPloy(c,shape.range)){
                  flag = true
                  break
              }
          }
          return flag
      })
  }