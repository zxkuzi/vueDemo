(function(window) {
    var charts = {};
    //通用时间数据
    var timeData = [];
    //阅读时长数据
    var readingTimeCountData = [];
    //阅读量数据
    var wordCountData = [];
    //平均成绩数据
    var readAvgScoreData = [];

    // TODO:数据点点击事件触发有延迟（需停留）
    // 阅读时长
    charts.readingTimeCharts = function(read, data, isReading) {
        var dom = document.getElementById(read);
        var myChart = echarts.init(dom);
        var app = {};
        option = null;
        if(data.length==0)
        {
          // timeData.push(0);
          readingTimeCountData.push(0);
        }
        else {
        data.sort(function(a,b){
            return Date.parse(a.readDate) - Date.parse(b.readDate);//时间正序
        });
        for (var i = 0; i < data.length; i++) {
            var times = data[i].readDate.slice(5);
            timeData.push(times);
            readingTimeCountData.push(parseInt(data[i].readTimeSecondOrNum/60));
        }
}
        var seriesLabel = {
            normal: {
                formatter: "{c}分钟",
                show: true,
                textBorderWidth: 2,
                fontSize: 14,
                color: '#223330'
            }
        };
        option = {
            xAxis: {
                type: 'category',
                data: timeData,
                axisLine: {
                    lineStyle: {
                        color: '#98aca8',
                    },
                    color:'#708782',
                },
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#98aca8',
                    },
                    color:'#708782'
                },
                axisLabel: {
                    formatter: '{value} 分钟',
                }
            },
            tooltip: {
                trigger: "item",
                formatter: "{b}<br>{c}分钟",
                textStyle: {
                    fontSize: '18'
                }
            },
            series: [{
                name: '分钟',
                type: 'line',
                data: readingTimeCountData,
                // data:[10,25,35,30,30,25,40],
                label: seriesLabel,
                markPoint: {
                    symbolSize: 1,
                    symbolOffset: [0, '50%']
                },
                lineStyle: {
                    normal: {
                        color:'#00b596'
                    }
                },
                itemStyle: {
                    normal: {
                        color:'#00b596'
                    }
                }
            }]
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
            timeData.splice(0,timeData.length);
            readingTimeCountData.splice(0,readingTimeCountData.length);
        }
    };
    charts.nowReadLevel = function(read,data){
      alert(44)
      console.log(data+'???????')
      var dom = document.getElementById(read);
      var myChart = echarts.init(dom);
      var app = {};
      option = null;
      var myRegression = ecStat.regression('exponential', data);
      myRegression.points.sort(function(a, b) {
          return a[0] - b[0];
      });
      option = {
    title: {
        text: '1981 - 1998 gross domestic product GDP (trillion yuan)',
        // subtext: 'By ec/Stat.regression',
        // sublink: 'https://github.com/ecomfe/echarts-stat',
        left: 'center'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    xAxis: {
        type: 'value',
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        },
        splitNumber: 20
    },
    yAxis: {
        type: 'value',
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    series: [{
        name: 'scatter',
        type: 'scatter',
        label: {
            emphasis: {
                show: true,
                position: 'left',
                textStyle: {
                    color: 'blue',
                    fontSize: 16
                }
            }
        },
        data: data
    }, {
        name: 'line',
        type: 'line',
        showSymbol: false,
        smooth: true,
        data: myRegression.points,
        markPoint: {
            itemStyle: {
                normal: {
                    color: 'transparent'
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'left',
                    formatter: myRegression.expression,
                    textStyle: {
                        color: '#333',
                        fontSize: 14
                    }
                }
            },
            data: [{
                coord: myRegression.points[myRegression.points.length - 1]
            }]
        }
    }]
};
    }
    // 阅读量
    charts.readWordCountCharts = function(read, data) {
      // alert('3344')
      console.log('此时的数据'+data)
            var dom = document.getElementById(read);
            var myChart = echarts.init(dom);
            var app = {};
            option = null;
            if(data.length==0)
            {
              // timeData.push(0);
              wordCountData.push(0);
            }
            else {
              data.sort(function(a,b){
                  return Date.parse(a.readDate) - Date.parse(b.readDate);//时间正序
              });
              for (var i = 0; i < data.length; i++) {
                  var times = data[i].readDate.slice(5);
                  timeData.push(times);
                  wordCountData.push(data[i].readTimeSecondOrNum);
              }
            }


            var seriesLabel = {
                normal: {
                    formatter: "{c}字",
                    show: true,
                    textBorderWidth: 2,
                    fontSize: 14,
                    color: '#223330'
                }
            };

            option = {
                xAxis: {
                    type: 'category',
                    data: timeData,
                    axisLine: {
                        lineStyle: {
                            color: '#98aca8',
                        },
                        color:'#708782',
                    },
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#98aca8',
                        },
                        color:'#708782'
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: '{value} 字'
                    }
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{b}<br>{c}字",
                    textStyle: {
                        fontSize: '18'
                    }
                },
                series: [{
                    name: '字',
                    type: 'line',
                    data: wordCountData,
                    // data:[5500,5300,6000,4000,4500,5500,6500],
                    label: seriesLabel,
                    markPoint: {
                        symbolSize: 1,
                        symbolOffset: [0, '50%']
                    },
                    lineStyle: {
                        normal: {
                            color:'#00b596'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color:'#00b596'
                        }
                    }
                }]
            };
            if (option && typeof option === "object") {
                myChart.setOption(option, true);
                timeData.splice(0,timeData.length);
                wordCountData.splice(0,wordCountData.length);
            }
        };
        //平均分
    charts.readAvgScoreCharts = function(read, data,isReading) {
        var dom = document.getElementById(read);
        var myChart = echarts.init(dom);
        var app = {};
        option = null;

        for (var i = 0; i < data.length; i++) {
            var times = data[i].time.slice(5);
            timeData.push(times);
            readAvgScoreData.push(isReading ? data[i].avgReadScore: data[i].avgChoiceScore);
        }

        var seriesLabel = {
            normal: {
                formatter: "{c}分",
                show: true,
                textBorderWidth: 2,
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000'
            }
        };
        option = {
            xAxis: {
                type: 'category',
                data: timeData
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLabel: {
                    formatter: '{value} 分'
                }
            },
            tooltip: {
                trigger: "item",
                formatter: "{b}<br>{c}分",
                textStyle: {
                    fontSize: '18'
                }
            },
            series: [{
                name: '分',
                type: 'line',
                data: readAvgScoreData,
                label: seriesLabel,
                // data:[81,75,88,70,75,85,90],
                markPoint: {
                    symbolSize: 1,
                    symbolOffset: [0, '50%']
                },
                lineStyle: {
                    normal: {
                        color:'#8fc31f'
                    }
                },
                itemStyle: {
                    normal: {
                        color:'#8fc31f'
                    }
                }
            }]
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
            timeData.splice(0,timeData.length);
            readAvgScoreData.splice(0,readAvgScoreData.length);
        }
    };
    charts.readingTestRadar = function (read,params) {
        var dom = document.getElementById(read);
        var myChart = echarts.init(dom);
        var app = {};
        var arr1 = params;
        var i = -1;
        var option = null;
        option = {
            radar: {
                name: {
                  textStyle: {
                      fontSize: '13',
                      color: '#a0a0a0',
                      align: 'center',
                  },
                  // label:{
                  //   distance:1,

                  // },
                  rich: {
                      b: {
                          lineHeight: '20',
                          fontSize: '13',
                          align: 'center',
                          color: '#233330',
                      }
                  },
                  formatter: (a,b)=>{
                       i++;
                      //  return `{a|${a}}\n{b|能力值：${arr1[i]}}`
                       return `{a|${a}}\n{b|${arr1[i]}}`
                      }
                },
                splitArea: {
                   show: false
                },
                axisLine: {
                    lineStyle: {
                        // color: 'rgba(238, 197, 102, 0.5)'
                        color:  '#c9c9c9'
                    }
                },
                nameGap:2,
                splitLine: {
                    lineStyle: {
                        color: [
                            // 'rgba(238, 197, 102, 1)', 'rgba(238, 197, 102, 0.2)',
                            // 'rgba(238, 197, 102, 0.4)', 'rgba(238, 197, 102, 0.6)',
                            // 'rgba(238, 197, 102, 0.8)', 'rgba(238, 197, 102, 1)'
                            '#c9c9c9'
                        ].reverse()
                    }
                },
                indicator: [
                    { name: '信息提取', max: 100},
                    { name: '联系推论', max: 100},
                    { name: '分析概括', max: 100},
                    { name: '领悟应用', max: 100},
                    { name: '欣赏评价', max: 100},
                    { name: '创造评估', max: 100}
                ]
            },
            series: [{
                type: 'radar',
                lineStyle: {
                  normal: {
                      width: 1
                  }
                },
                data : [
                    {
                        value : arr1
                    }
                ],
                itemStyle: {
                  normal: {
                      color: '#00b596',
                  }
                },
                label:{
                  distance:10,
                },
                areaStyle: {
                    normal: {
                        opacity: 0.3
                    }
                },
            }]
        };
        myChart.setOption(option);
    };

    window.$charts = charts;
})(window);
