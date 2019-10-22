(function (window) {
    'use strict';
  var comm = {}
  var doublePI = Math.PI * 2;
  var canvas;
  var ctx;

  //画布的高度的一半
  var halfCanvasHeight = 100;
  //水平边距
  var horizontalMargin = 150;

  //衰减系数(越大, 边缘衰减的就越多, 震动宽度相应也越窄)
  var attenuationCoefficient = 2;
  //半波长个数-1
  var halfWaveCount = 3;
  //振幅是画布高度的一般的百分比[0,1]
  var amplitudePercentage = 0.9;
  //每帧增加的弧度[0,2PI](作用于sin曲线, 正值相当于原点右移, 曲线左移)
  var radianStep = -0.05;

  //当前弧度的偏移
  var radianOffset = 0;
  //画布宽度
  var canvasWidth;

  comm.init = function() {
    // alert('123')
      canvas = document.getElementById("canvas");
      ctx = canvas.getContext("2d");
      canvas.height = halfCanvasHeight * 2;
      comm.onResize();
      comm.loop();
  }

  comm.onResize = function() {
      //元素的大小不能加单位, 单位默认就是像素, 而style中的长度要加单位
      canvasWidth = canvas.width = window.innerWidth - horizontalMargin;
  }

  //设K=attenuationCoefficient, 计算信号衰减 (4K/(4K+x^4))^2K<=1 (x belong [-K,K])
  comm.calcAttenuation = function(x) {
      return Math.pow(4 * attenuationCoefficient / (4 * attenuationCoefficient + Math.pow(x, 4)),
          2 * attenuationCoefficient);
  }

  //heightPercentage为振幅的显示比例
  comm.drawAcousticWave = function(heightPercentage, alpha, lineWidth) {
      ctx.strokeStyle = "white";
      ctx.globalAlpha = alpha;
      ctx.lineWidth = lineWidth || 1;
      ctx.beginPath();
      ctx.moveTo(0, halfCanvasHeight);
      var x, y;
      for (var i = -attenuationCoefficient; i <= attenuationCoefficient; i += 0.01) {
          //i是当前位置相对于整个长度的比率( x=width*(i+K)/(2*K))
          x = canvasWidth * (i + attenuationCoefficient) / (2 * attenuationCoefficient);
          //加offset相当于把sin曲线向右平移
          y = halfCanvasHeight + halfCanvasHeight * amplitudePercentage * calcAttenuation(i) * heightPercentage *
              Math.sin(halfWaveCount * i + radianOffset);
          ctx.lineTo(x, y);
      }
      ctx.stroke();
  }

  comm.loop = function() {
      radianOffset = (radianOffset + radianStep) % doublePI;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawAcousticWave(1, 1, 2);
      requestAnimationFrame(loop);
  }

  comm.init();
    //---------------------------------------------------------------------
    window.$mapCanvas = comm;

})(window);
