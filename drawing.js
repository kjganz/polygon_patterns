window.onload = function() {

  var c;
  var canvasSize;
  var polygon = [];
  var numVertices = 5;
  var verticesChanged = true;
  var maxDepth = 3;
  var lineWidth = 1;
  var offset = 0.5;
  var redraw = false;
  var drawAsLines = false;
  var fillWithColor = false;
  var color = ['#000000'];
  var ctx;
  var skipDepth = 0;
  var skipDepthCount = 1;
  var skipSide = 0;

  var init = function() {
    c = document.getElementById("canvas");
    ctx = c.getContext('2d');
    setCanvasSize();
    draw();
  };

  var setCanvasSize = function() {
    canvasSize = 4000;
    c.width = canvasSize;
    c.height = canvasSize;
  };

  var draw = function() {
    fetchParams();
    // Draw the circumscribed circle
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    ctx.arc(canvasSize/2, canvasSize/2, 0.9 * canvasSize/2, 0, 2*Math.PI);
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    if (verticesChanged === true) {
      calculateVertices();
      verticesChanged = false;
    }
    drawPattern(polygon, 1, maxDepth);
  };

  var calculateVertices = function() {
    polygon = [];
    for (var i = 0; i < numVertices; i++) {
      polygon.push( {x: (0.45*canvasSize * Math.cos(i * (2*Math.PI/numVertices))) + canvasSize/2,
                     y: (0.45*canvasSize * Math.sin(i * (2*Math.PI/numVertices))) + canvasSize/2} );
    }
  };

  var shouldDrawLevel = function(depth) {
    if (depth % skipDepth === 0) {
      return false;
    }

    if (depth % skipDepth < skipDepthCount) {
    // if (depth > skipDepth && depth % skipDepth < skipDepthCount) {
      return false;
    }

    return true;
  };

  var drawPattern = function(v, depth, maxDepth) {
    
    if (depth <= maxDepth) {
      
      var newV = [];
      var drawLevel = shouldDrawLevel(depth);
      for (var i = 0; i < v.length; i++) {
        newV.push( {x: (v[i].x * (1 - offset)) + (v[index(i+1)].x * offset),
                    y: (v[i].y * (1 - offset)) + (v[index(i+1)].y * offset)});
    
        var drawSide = i % skipSide !== 0 ? true : false;
        if (drawLevel && drawSide) {

          if (drawAsLines) {
            ctx.beginPath();
            ctx.moveTo(v[i].x, v[i].y);
            ctx.lineTo(v[index(i+1)].x, v[index(i+1)].y);
            ctx.lineWidth = lineWidth;
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.moveTo(newV[i].x, newV[i].y);
            ctx.lineTo(v[index(i+1)].x, v[index(i+1)].y);
            ctx.lineTo((v[index(i+1)].x * (1-offset)) + (v[index(i+2)].x * offset),
                       (v[index(i+1)].y * (1-offset)) + (v[index(i+2)].y * offset));
            ctx.closePath();
            if (fillWithColor) {
              ctx.lineWidth = 0;
              ctx.fillStyle = color[0];
              ctx.fill();
            } else {
              ctx.lineWidth = lineWidth;
              ctx.stroke();
            }
          }
        }
      }
      
      drawPattern(newV, depth + 1, maxDepth);
    }
  };

  var index = function(num) {
    if (num < 0) {
      return numVertices - num;
    } else {
      return num % numVertices;
    }
  };

  var fetchParams = function() {
    // params = ['num-vert', 'depth', 'line-width', 'offset'];
    redraw = false;
    var params = [];
    $('[id]').each(function() {
      params.push($(this).attr("id"));
    });
    for (var i = 0; i < params.length; i++) {
      updateParam( params[i], Number($('#' + params[i]).val()) );
    }
  };

  var updateParam = function(param, value) {
    switch (param) {
      case 'num-vert':
        if (value < 3) { value = 3; }
        if (value != numVertices) {
          verticesChanged = true;
          numVertices = value;
        }
        break;

      case 'depth':
        if (value < 0) { value = 0; }
        maxDepth = value;
        break;

      case 'line-width':
        if (value < 1) { value = 1; }
        lineWidth = value;
        break;

      case 'offset':
        if (value < 0) { value = 0; }
        if (value > 1) { value = 1; }
        offset = value;
        break;

      case 'skip-depth':
        if (value < 0) { value = 0; }
        skipDepth = value;
        break;

      case 'skip-depth-count':
        if (value >= skipDepth) { value = skipDepth - 1; }
        if (value < 1) { value = 1; }
        skipDepthCount = value;
        break;

      case 'skip-side':
        if (value < 0) { value = 0; }
        skipSide = value;
        break;

      default:
        return;
    }

    $('#' + param).val(value);
    if (redraw === true) {
      draw();
    }
  };

  var cycleParam = function(param) {
    switch (param) {
      case 'line-or-triangle':
        drawAsLines = drawAsLines ? false : true;
        value = drawAsLines ? 'Lines' : 'Triangles';
        break;

      case 'fill':
        fillWithColor = fillWithColor ? false : true;
        value = fillWithColor? 'Fill' : 'No Fill';
        break;

      default:
        return;
    }

    $('#' + param).html(value);
    draw();
  };

  $('.decrement').click(function() {
    param = $(this).attr('param');
    value = Number($('#' + param).val()) - Number($('#' + param).attr('step'));
    redraw = true;
    updateParam(param, value);
  });

  $('.increment').click(function() {
    param = $(this).attr('param');
    value = Number($('#' + param).val()) + Number($('#' + param).attr('step'));
    redraw = true;
    updateParam(param, value);
  });

  $('.cycle').click(function() {
    cycleParam($(this).attr('id'));
  });

  $('#draw').click(function() {
    draw();
  });

  // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

  init();
};