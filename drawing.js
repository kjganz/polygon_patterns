window.onload = function() {

  var c;
  var canvasSize;
  var polygon = [];
  var numVertices = 5;
  var verticesChanged = true;
  var maxDepth = 3;
  var lineWidth = 1;

  var init = function() {
    c = document.getElementById("canvas");
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
    var ctx=c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    ctx.arc(canvasSize/2, canvasSize/2, 0.9 * canvasSize/2, 0, 2*Math.PI);
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    if (verticesChanged == true) {
      calculateVertices();
      verticesChanged = false;
    }
    drawPattern(polygon, 0, maxDepth);
  };

  var calculateVertices = function() {
    polygon = [];
    for (var i = 0; i < numVertices; i++) {
      polygon.push( {x: (0.45*canvasSize * Math.cos(i * (2*Math.PI/numVertices))) + canvasSize/2,
                     y: (0.45*canvasSize * Math.sin(i * (2*Math.PI/numVertices))) + canvasSize/2} );
    }
  };

  var drawPattern = function(v, depth, maxDepth) {
    
    if (depth < maxDepth) {
      
      var newV = [];
      for (var i = 0; i < v.length; i++) {
        newV.push( {x: (v[i].x + v[index(i+1)].x) / 2, 
                    y: (v[i].y + v[index(i+1)].y) / 2});
    
        // if ((i % 2 === 0) && ((depth < 3) || (depth % 2 === 0))) {
        // beginShape();
        // vertex(newV[i].x, newV[i].y);
        // vertex(v[index(i+1)].x, v[index(i+1)].y);
        // vertex((v[index(i+1)].x + v[index(i+2)].x) / 2, 
        //       (v[index(i+1)].y + v[index(i+2)].y) / 2);
        // endShape(CLOSE);

        var ctx = c.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(newV[i].x, newV[i].y);
        ctx.lineTo(v[index(i+1)].x, v[index(i+1)].y);
        ctx.lineTo((v[index(i+1)].x + v[index(i+2)].x) / 2, 
                   (v[index(i+1)].y + v[index(i+2)].y) / 2);
        ctx.closePath();
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        // }
      }
      drawPattern(newV, depth + 1, maxDepth);
    } else {
      // beginShape();
      // for (var i = 0; i < v.length; i++) {
      //   vertex(v[i].x, v[i].y);
      // }
      // endShape(CLOSE);
    }

    // if (depth >= maxDepth) {
    //   beginShape();
    //   for (var i = 0; i < vertices.length; i++) {
    //     vertex(vertices[i].x, vertices[i].y);
    //   }
    //   endShape(CLOSE);
    //   return;
    // }
    
    // if (depth % 2 == 0) {
    //   fill(0, 0, 0);
    // } else {
    //   fill(255, 255, 255);
    // }
    
    // var newVertices = [];
    // for (var i = 0; i < vertices.length; i++) {
    //   newVertices.push({x: (vertices[i].x + vertices[index(i+1)].x) / 2, 
    //                     y: (vertices[i].y + vertices[index(i+1)].y) / 2});

    //   if ((i % 2 === 0) && ((depth < 3) || (depth % 2 === 0))) {
    //     beginShape();
    //     vertex(newVertices[i].x, newVertices[i].y);
    //     vertex(vertices[index(i+1)].x, vertices[index(i+1)].y);
    //     vertex((vertices[index(i+1)].x + vertices[index(i+2)].x) / 2, 
    //           (vertices[index(i+1)].y + vertices[index(i+2)].y) / 2);
    //     endShape(CLOSE);
    //   }
    // }
  };

  var index = function(num) {
    if (num < 0) {
      return numVertices - num;
    } else {
      return num % numVertices;
    }
  };

  var fetchParams = function() {
    params = ['num-vert', 'depth', 'line-width'];
    for (var i = 0; i < params.length; i++) {
      updateParam( params[i], parseFloat($('#' + params[i]).val()) );
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
        if (value < 0) { value = 0 }
        maxDepth = value;
        break;

      case 'line-width':
        if (value < 1) { value = 1 }
        lineWidth = value;
        break;
    }

    $('#' + param).val(value);
  };

  $('.increment').click(function(e) {
    param = $(this).attr('param');
    // updateParam(param, parseFloat(document.getElementById(param).value) + 1);
    updateParam(param, parseFloat($('#' + param).val()) + 1);
  });

  $('.decrement').click(function(e) {
    param = $(this).attr('param');
    updateParam(param, parseFloat($('#' + param).val()) - 1);
  });

  $('#draw').click(function() {
    draw();
  });

  init();
}