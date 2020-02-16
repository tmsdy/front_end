
// var shapeType = { triangle: 'Triangle'}; //区分各种形状
const shapeType = { //可以这么写，表示独一无二的三角形类
  triangle: Symbol()
};

function getArea(shape, options) { //计算三角形面积
    var area = 0; 
    switch (shape) { 
      case shapeType.triangle:
      area = .5 * options.width * options.height; 
      break; 
    } 
    return area;
}

getArea(shapeType.triangle, { width: 100, height: 100 });