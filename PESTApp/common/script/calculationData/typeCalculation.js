(function(window) {
    'use strict';
    //数据计算公共类

    var typeCalculation = {};
    /*
    ---功能：秒转化为时间 返回有样式<span>标签
    ---返回：X天X时X分 或 X时X分 或X秒
    --参数msd:秒
    */
    typeCalculation.secondToDate = function(msd) {
            var time =msd
            if (null != time && "" != time) {
                if (time > 60 && time < 60 * 60) {
                    time = parseInt(time / 60.0) + "<span class='span02'>&nbsp;分&nbsp;</span>" + parseInt((parseFloat(time / 60.0) -
                         parseInt(time / 60.0)) * 60) + "<span class='span02'>&nbsp;秒</span>";
                }
                else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                    time = parseInt(time / 3600.0) + "<span class='span02'>&nbsp;时&nbsp;</span>" + parseInt((parseFloat(time / 3600.0) -
                        parseInt(time / 3600.0)) * 60) + "<span class='span02'>&nbsp;分</span>";
                        // +parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                        // parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
                } else if (time >= 60 * 60 * 24) {
                    time = parseInt(time / 3600.0/24) + "<span class='span02'>&nbsp;天&nbsp;</span>" +parseInt((parseFloat(time / 3600.0/24)-
                        parseInt(time / 3600.0/24))*24) + "<span class='span02'>&nbsp;时&nbsp;</span>" + parseInt((parseFloat(time / 3600.0) -
                        parseInt(time / 3600.0)) * 60) + "<span class='span02'>&nbsp;分</span>"
                        // +parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                        // parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
                }
                else {
                    time = parseInt(time) + "<span class='span02'>&nbsp;秒</span>";
                }
            }else{
               time = "0<span class='span02'>&nbsp;秒</span>";
            }
            return time;
        };
        /*
        ---功能：秒转化为时间
        ---返回：X天X时X分 或 X时X分 或X秒
        --参数msd:秒
        */
        typeCalculation.secondToDateNotClass = function(msd) {
                var time =msd
                if (null != time && "" != time) {
                    if (time > 60 && time < 60 * 60) {
                        time = parseInt(time / 60.0) + "分" + parseInt((parseFloat(time / 60.0) -
                             parseInt(time / 60.0)) * 60) + "秒";
                    }
                    else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                        time = parseInt(time / 3600.0) + "时" + parseInt((parseFloat(time / 3600.0) -
                            parseInt(time / 3600.0)) * 60) + "分";
                            // +parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                            // parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
                    } else if (time >= 60 * 60 * 24) {
                        time = parseInt(time / 3600.0/24) + "天" +parseInt((parseFloat(time / 3600.0/24)-
                            parseInt(time / 3600.0/24))*24) + "时" + parseInt((parseFloat(time / 3600.0) -
                            parseInt(time / 3600.0)) * 60) + "分"
                            // +parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                            // parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
                    }
                    else {
                        time = parseInt(time) + "秒";
                    }
                }
                return time;
            };
        /*
        ---功能：数字转化为文字
        ---返回：X万字 或 千字 或字
        --参数msd:秒
        */
        typeCalculation.numToWordText = function(num) {
          if(num)
          {
            if(num>=1000000)
            {
              return (num/1000000).toFixed(2)+"<span class='span02'>&nbsp;百万字</span>";
            }
            // else if(num>=1000)
            // {
            //   return (num/1000).toFixed(2)+"<span class='span02'>&nbsp;千字<span>";
            // }
            else {
              return num+"<span class='span02'>&nbsp;字</span>";
            }
          }
          else {
            return "0<span class='span02'>&nbsp;字</span>";
          }
        };
    window.$typeCalculation = typeCalculation;
})(window);
