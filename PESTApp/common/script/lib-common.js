(function(window) {
    'use strict';
    // Get a regular interval for drawing to the screen
    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimaitonFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var comm = {};
    var isCanAgain = true;
    comm.device = $storage.getStorage('device');
    comm.token = $storage.getStorage('token') ? $storage.getStorage('token') : 'init';
    //comm.wsUri = "http://didaapi.123langlang.com/api/v1.0/" + comm.device + "/" + comm.token;
    // comm.resUri = "http://didaapi.123langlang.com";
    comm.wsAdressUri = "http://47.93.214.37:9746/api/v1.0/" + comm.device + "/" + comm.token;
    comm.resUri =  $storage.getStorage('imageUrl')?"http://"+$storage.getStorage('imageUrl'):"http://47.93.214.37:9746"
    comm.wsUri =  $storage.getStorage('imageUrl')//"http://47.93.214.37:9746/api/v1.0/" + comm.device + "/" + comm.token;
    comm.resquestUrl=  $storage.getStorage('infaceUrl')?$storage.getStorage('infaceUrl'):"http://47.93.214.37"
    comm.isdebug = true;
    //------------------------------设置接口地址---------------------------------------
    comm.getRequestUrl=function(infaceUrl,imageUrl)
    {
      $storage.setStorage('infaceUrl',infaceUrl);
      $storage.setStorage('imageUrl',imageUrl);
    }
    //---------------------------------------------------------------------
    comm.getToken = function() {
      return $storage.getStorage('token');
    }
    comm.getServerAddress = function (fnSuc, fnErr) {
        var url = comm.wsAdressUri + '/System/ServerAddress' + '?timestamp=' + new Date().getTime();
        //服务地址
        api.ajax({
            url: url,
            method: 'post',
            dataType: 'json',
            data: {
                values: {ServerType: 2}
            }
        }, function(ret, err) {
            if (ret) {
                fnSuc(ret);
            } else {
                fnErr(err);
            }
        });
    };
    comm.offLine = function() {
      api.addEventListener({
          name: 'offline'
      }, function(ret, err){
          if( ret ){
               alert( JSON.stringify( ret ) );
          }else{
               alert( JSON.stringify( err ) );
          }
      });
    };
    //vim /System/Library/Frameworks/Tk.framework/Versions/Current/Resources/Wish.app/Contents/Info.plist
    comm.listenExitApp = function() {
        //Android:设备 back 键被点击事件
        api.addEventListener({
            name: 'keyback'
        }, function(ret, err) {
            api.toast({
                msg: '再按一次返回键退出' + api.appName,
                duration: 2000,
                location: 'bottom'
            });

            api.addEventListener({
                name: 'keyback'
            }, function(ret, err) {
                //从设备上登出
                comm.exitApp();
            });

            var fnTimeOut = function() {
                comm.listenExitApp();
            };
            setTimeout(fnTimeOut, 2000);
        });
    };
    comm.listen = function() {
        //IOS/Android:应用从前台切换为后台
        api.addEventListener({
            name: 'pause'
        }, function(ret, err) {
            console.log('应用进入后台');
        });
        //IOS/Android:应用从后台切换回前台
        api.addEventListener({
            name: 'resume'
        }, function(ret, err) {
            console.log('应用回到前台');
        });
        //IOS:用户截屏了
        api.addEventListener({
            name: 'takescreenshot'
        }, function(ret, err) {
            console.log('用户截屏了');
        });
        //IOS/Android:应用多长时间不操作屏幕后触发的事件
        api.addEventListener({
            name: 'appidle',
            extra: {
                timeout: 300 //设置经过多长时间不操作屏幕时触发，单位秒，数字类型
            }
        }, function(ret, err) {
            console.log('已闲置');
        });
    };
    //关闭app
    comm.exitApp = function() {
        //从设备上登出
        api.closeWidget({
            id: api.appId, //这里改成自己的应用ID
            retData: {
                name: 'closeWidget'
            },
            silent: true
        });
    };
    //在debug情况下，console输出debug信息
    comm.debug = function(title, obj, style) {
        if (comm.isdebug === true) {
            var logAction = function(ret) {
                //console.log(ret);
            };
            if (style) {
                switch (style) {
                    case 'log':
                        logAction = function(ret) {
                            //console.log(ret);
                        };
                        break;
                    case 'debug':
                        logAction = function(ret) {
                          //  console.log(ret);
                        };
                        break;
                    case 'warn':
                        logAction = function(ret) {
                            console.warn(ret);
                        };
                        break;
                    case 'error':
                        logAction = function(ret) {
                            console.error(ret);
                        };
                        break;
                }
            }

            if (comm.isObject(obj)) {
                logAction(title + '\t' + $api.jsonToStr(obj));
            } else if (comm.isNullOrUndefined(obj) === false) {
                logAction(title + '\t' + obj);
            } else {
                logAction(title);
            }
        }
    };
    //拼音音调正确标注位置
    comm.getNewTone = function(str,tone){
      var arr3 = ['a','o','e','i','u','v'];
      var arr2 = [tone];
      var str1 = str;
      var arr1 = str.split('');
      var newArr = [];
      var falg = false;
      var m;
      if(str1.indexOf(arr3[3])!=-1 && str1.indexOf(arr3[4])!=-1){
          falg = true;
        }
        // console.log(falg)
      for(let i=0; i<arr3.length; i++){
        if(str1.indexOf(arr3[i])!=-1 && !falg){
          for(var j=0;j<str.length;j++){
            if(str[j]===arr3[i]){
              // console.log(j)
              newArr.push(j);
            }
          }
        }else{
          m = str.length-1;
        }
      }
      var m1 = newArr[0]>=0 ? newArr[0] : m;
      arr2.unshift(m1+1, 0);
      Array.prototype.splice.apply(arr1, arr2);
      // console.log(arr1.join(''));
      return arr1.join('')
    };
    //合并对象,目标对象在前,源对象在后;对目标对象已存在的属性不进行覆盖
    comm.extend = function(target, source) {
        for (var obj in source) {
            if (!target[obj]) {
                target[obj] = source[obj];
            }
        }
        return target;
    };
    comm.guid = function(withsplit) {
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        if (withsplit === false) {
            guid = guid.replace(/\-/g, '');
        }
        return guid;
    };
    //---------------------------------------------------------------------
    /*类型判断*/
    //字串型
    comm.isString = function(obj) {
        return obj && (typeof(obj) === "string");
    };
    //数字型
    comm.isNumber = function(obj) {
        return obj && (typeof(obj) === "number");
    };
    //布尔型
    comm.isBoolean = function(obj) {
        return obj && (typeof(obj) === "boolean");
    };
    //值类型(仿C#)
    comm.isValueType = function(obj) {
        return comm.isString(obj) || comm.isNumber(obj) || comm.isBoolean(obj);
    };
    //对象型
    comm.isObject = function(obj) {
        return obj && (typeof(obj) === "object");
    };
    //函数方法
    comm.isFunction = function(obj) {
        return obj && (typeof(obj) === "function");
    };
    //数组排序
    comm.compare = function(pro){
            return function(a,b){
                var value1 = a[pro];
                var value2 = b[pro];
                return value1 - value2;
      }
    };
    //数组
    comm.isArray = function(obj) {
        return obj && ((obj instanceof Array) === true);
    };
    //为空或undefined
    comm.isNullOrUndefined = function(obj) {
        if (obj) {
            return false;
        } else {
            return true;
        }
    };
    //---------------------------------------------------------------------
    /*图片函数,缓存方式处理网络图片*/
    //本地或网络获取图片
    comm.tryLoadImg = function(imgSrc, onload) {
        var fs = api.require('fs');

        var internetImgSrc = comm.picUri + imgSrc.replace(/ /g, '%20');
        var localImgSrc = 'fs://' + imgSrc.replace(".png", ".ll");
        //按网络图片方式处理
        var fnLoadInternetImg = function() {
            api.download({
                url: internetImgSrc,
                savePath: localImgSrc,
                report: true,
                cache: true,
                allowResume: true
            }, function(ret, err) {
                // if (ret.state == 1) {
                //     onload(localImgSrc);
                // } else if (err) {
                //     onload(internetImgSrc);
                // }
            });
            //下载完成时直接调本地图片不成功,可能是还没有保存完,故此还是直接调远程路径,但同时异步下载保存图片
            onload(internetImgSrc);
        };
        //按本地图片方式处理
        var fnLoadLocalImg = function() {
            fs.open({
                path: localImgSrc,
                flags: 'read_write'
            }, function(ret, err) {
                if (ret.status === true) {
                    onload(ret.fd);
                }
            });
        };
        //判断本地图片是否存在
        fs.exist({
            path: localImgSrc
        }, function(ret, err) {
            if (ret.exist === true && ret.directory === false) {
                fnLoadLocalImg();
            } else {
                fnLoadInternetImg();
            }
        });
    };
    //---------------------------------------------------------------------
    /*数组函数*/
    //乱序数组
    comm.shuffleArray = function(arr) {
        var len = arr.length;
        for (var i = 0; i < len - 1; i++) {
            var idx = Math.floor(Math.random() * (len - i));
            var temp = arr[idx];
            arr[idx] = arr[len - i - 1];
            arr[len - i - 1] = temp;
        }
        return arr;
    };
    //数组去重
    comm.qc = function(ary){
    var obj = {}
    var arr = []
    for (let i = 0; i < ary.length; i++) {
    if(!obj[ary[i]]){
      obj[ary[i]]="abc"
      arr.push(ary[i])
    }
    }
    return arr
  }
    //数组取重
    comm.getRepeatItems = function(arr) {
        var repeats = [];
        var nary = arr.sort();
        for (var i = 0; i < (nary.length - 1); i++) {
            if (nary[i] == nary[i + 1]) {
                repeats.push(nary[i]);
            }
        }
        return repeats;
    };
    //按列数对数组进行拆解，当最后一组数据量小于列数，进行补全
    comm.splitAndCompleteArray = function(inputArr, columnCount, added) {
        var list = [];
        for (var i = 0; i < inputArr.length; i++) {
            list.push(inputArr[i]);
        }
        var count = list.length % columnCount;
        if (count > 0) {
            for (var j = 0; j < (columnCount - count); j++) {
                list.push(added);
            }
        }
        var result = [];
        for (var ii = 0; ii < list.length; ii = ii + columnCount) {
            var subList = [];
            for (var jj = ii; jj < (ii + columnCount); jj++) {
                subList.push(list[jj]);
            }
            result.push(subList);
        }
        return result;
    };
    comm.getMaxLengthInTwoDimensionalArray = function(ary) {
        var length = 0;
        for (var i = 0; i < ary.length; i++) {
            length = length <= ary[i].length ? ary[i].length : length;
        }
        return length;
    }
    comm.getMinLengthInTwoDimensionalArray = function(ary) {
            var length = 25535;
            for (var i = 0; i < ary.length; i++) {
                length = length >= ary[i].length ? ary[i].length : length;
            }
            return length;
        }
        //---------------------------------------------------------------------
        /*基础转换函数*/
        //日期比较
    comm.getDateDiff = function(sTime, eTime, diffType) {
        diffType = diffType.toLowerCase();
        //作为除数的数字
        var divNum = 1;
        switch (diffType) {
            case 'second':
                divNum = 1000;
                break;
            case 'minute':
                divNum = 1000 * 60;
                break;
            case 'hour':
                divNum = 1000 * 3600;
                break;
            case 'day':
                divNum = 1000 * 3600 * 24;
                break;
            default:
                break;
        }
        return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
    };
    //json日期转换为js日期
    comm.jsonDateConvert = function(jsondate) {
        var dateInt = parseInt(jsondate.replace(/\D/igm, ''));
        var date = new Date(dateInt);
        return date;
    };
    //json日期格式化(yyyy-MM-dd)
    comm.jsonDateFormat = function(jsondate, format) {
        var jsdate = comm.jsonDateConvert(jsondate);

        return comm.jsDateFormat(jsdate, format);
    };
    //js日期格式化(yyyy-MM-dd)
    comm.jsDateFormat = function(jsdate, format) {
        var paddNum = function(num) {
            num += '';
            return num.replace(/^(\d)$/, '0$1');
        }
        format = (format === undefined || format === null || format.length === 0) ? 'yyyy-MM-dd' : format;

        var year = jsdate.getFullYear();
        var month = paddNum(jsdate.getMonth() + 1);
        var date = paddNum(jsdate.getDate());
        var hour = paddNum(jsdate.getHours());
        var minute = paddNum(jsdate.getMinutes());
        var second = paddNum(jsdate.getSeconds());

        var ret = format;
        ret = ret.replace(/yyyy/, year);
        ret = ret.replace(/MM/, month);
        ret = ret.replace(/dd/, date);
        ret = ret.replace(/HH/, hour);
        ret = ret.replace(/mm/, minute);
        ret = ret.replace(/ss/, second);
        return ret;
    };

    comm.timeStamp = function(date) {
        date = new Date(Date.parse(date.replace(/-/g, "/")));
        date = date.getTime();
        return date;
    };
    //将js毫秒转化为00：00的格式
    comm.getReadTime = function(times){
      var result = '00:00:00';
      var hour,minute,second;
      if (times > 0) {
        hour = Math.floor(times / 3600);
        if (hour < 10) {
          hour = "0"+hour;
        }
        minute = Math.floor((times - 3600 * hour) / 60);
        if (minute < 10) {
          minute = "0"+minute;
        }

        second = Math.floor((times - 3600 * hour - 60 * minute) % 60);
        if (second < 10) {
          second = "0"+second;
        }
        // result = hour+':'+minute+':'+second;
        result = minute+':'+second;
      }
      return result;
    };
    //将js日期时间差的总毫秒数切换为（Ｎ分）（Ｍ秒）方式显示
    comm.getTimeDisplay = function(totalSecs) {
        //var totalSecs = (new Date() - comm.forwardTime) / 1000;
        var days = Math.floor(totalSecs / 3600 / 24);
        var hours = Math.floor((totalSecs - days * 24 * 3600) / 3600);
        var mins = Math.floor((totalSecs - days * 24 * 3600 - hours * 3600) / 60);
        var secs = Math.floor((totalSecs - days * 24 * 3600 - hours * 3600 - mins * 60));
        if (mins > 0) {
            if (secs > 0) {
                return mins + '分' + secs + '秒';
            } else {
                return mins + '分';
            }
        } else {
            return secs + '秒';
        }
    };
    //将（Ｎ分）（Ｍ秒）方式显示的时间字符串转换为总的js总秒数
    comm.getTotalSecs = function(timeDisplay) {
        var mins = 0;
        var secs = 0;
        if (timeDisplay.indexOf('分') >= 0) {
            mins = parseInt(timeDisplay.substring(0, timeDisplay.indexOf('分')), 10);
            timeDisplay = timeDisplay.substring(timeDisplay.indexOf('分') + 1);
        }
        if (timeDisplay.indexOf('秒') >= 0) {
            secs = parseInt(timeDisplay.substring(0, timeDisplay.indexOf('秒')), 10);
        }
        return mins * 60 + secs;
    };
    //数字转汉字数字（每个数字独立转换，不按整数据方式转换）
    comm.toChsNumber = function(number) {
        var chs = '';
        var numbers = (number + '').split('');
        for (var i = 0; i < numbers.length; i++) {
            chs += comm.convertToChsNumber(numbers[i]);
        }
        return chs;
    };
    comm.chsNumbersArray = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    //单个数字转汉字数字（０～９）
    comm.convertToChsNumber = function(intVal) {
        if (intVal >= 0 && intVal < 10) {
            return comm.chsNumbersArray[intVal];
        } else {
            return intVal + '';
        }
    };
    //取最小值
    comm.min = function() {
        var numbers = [].slice.apply(arguments);

        if (comm.isArray(numbers) && numbers.length > 0) {
            var min = numbers[0];
            for (var i = 1; i < numbers.length; i++) {
                min = numbers[i] < min ? numbers[i] : min;
            }
            return min;
        }
        return null;
    };
    //取最大值
    comm.max = function() {
        var numbers = [].slice.apply(arguments);

        if (comm.isArray(numbers) && numbers.length > 0) {
            var max = numbers[0];
            for (var i = 1; i < numbers.length; i++) {
                max = numbers[i] > max ? numbers[i] : max;
            }
            return max;
        }
        return null;
    };
    //---------------------------------------------------------------------
    //event.bind
    comm.bindList = [];
    comm.bind = function(el, action, func) {
        for (var i = 0; i < comm.bindList.length; i++) {
            if (comm.bindList[i].el === el && comm.bindList[i].action === action) {
                comm.unbind(el, action);
                break;
            }
        }
        $api.addEvt(el, action, func);
        comm.bindList.push({
            el: el,
            action: action,
            func: func
        });
    };
    comm.unbind = function(el, action) {
        for (var i = 0; i < comm.bindList.length; i++) {
            if (comm.bindList[i].el === el && comm.bindList[i].action === action && comm.bindList[i].func) {
                $api.rmEvt(el, action, comm.bindList[i].func);
                comm.bindList.splice(i, 1);
                break;
            }
        }
    };
    //---------------------------------------------------------------------
    //ajax.get
    comm.ajaxGet = function(ctrl, act, data, fnSuc, fnErr, dataType, showLoading) {
        var url = comm.wsUri + '/' + ctrl + '/' + act + '?timestamp=' + new Date().getTime();
        var opt = comm.tidyParams(data, fnSuc, fnErr, dataType, showLoading);
        if (showLoading) {
            comm.showLoading();
        }
        api.ajax({
            url: url,
            method: 'get',
            dataType: opt.dataType,
            data: {
                values: opt.data
            },
        }, function(ret, err) {
            if (ret) {
                opt.fnSuc(ret);
            } else {
                opt.fnErr(err);
            }
        });
    };

    //ajax.post
    comm.ajaxPost = function(ctrl, act, data, fnSuc, fnErr, dataType, showLoading, adress) {
        comm.getServerAddress(function (resp) {
            if (resp.errCode === 0) {
                comm.wsUri = resp.ServerUrl + '/api/v1.0/' + "/" + comm.device + "/" + comm.token;
                comm.resUri = resp.ServerUrl + "/";
                var url;
                if (adress) {
                    url = comm.wsAdressUri + '/' + ctrl + '/' + act + '?timestamp=' + new Date().getTime();
                } else {
                    url = comm.wsUri + '/' + ctrl + '/' + act + '?timestamp=' + new Date().getTime();
                }
                var opt = comm.tidyParams(data, fnSuc, fnErr, dataType, showLoading);
                if (showLoading) {
                    comm.showLoading();
                }
                api.ajax({
                    url: url,
                    method: 'post',
                    dataType: opt.dataType,
                    timeout: 30,
                    data: {
                        values: opt.data
                    }
                }, function(ret, err) {
                    if (ret) {
                        opt.fnSuc(ret);
                    } else {
                        opt.fnErr(err);
                    }
                });
            }
        }, function (err) {
            fnErr(err);
        });
    };
    // comm.reconnect = function(post,port,newData){
    //   alert('***********')
    //   var rews = new WebSocket("ws://"+host+":"+port);
    //   alert(2)
    //   // rews.onopen = function(){
    //   //   rews.send(newData);
    //   //   alert('shujufasongzhong')
    //   // }
    //   rews.onmessage = function(evt){
    //     alert(8)
    //     //dosomthing
    //     var received_msg = evt.data;
    //     if(received_msg){
    //       callback(received_msg)
    //     }
    //   };
    //   rews.onclose = function(){
    //       //dosomthing
    //   };
    // };
    //去除\n\n,\r\n, \n
    //基于原生socket
    comm.socket = function(OpCode,JsonData,callback){
        if(!isCanAgain){
          // return;
        }
        isCanAgain = false;
        if(api.systemType=='ios'){
          var ClientType = 1
        }else if(api.systemType=='android'){
          var ClientType = 2;
        }
        var host = comm.resquestUrl;
        var SessionId = '00000000-0000-0000-0000-000000000000';
        // var port = 8888;
        var port = 8866;
        var userInfoToken =$storage.getStorage('token') ? $storage.getStorage('token') : 'init';;
        var DeviceId = api.deviceId;
        var DeviceVersion = api.systemType + api.systemVersion;
        var data = {
          Key:'',
          OpCode:OpCode,
          SessionId:SessionId,
          ClientType:ClientType,
          // DeviceVersion:1,
          DeviceVersion:DeviceVersion,
          DeviceId:DeviceId,
          Token:userInfoToken,
          JsonData:JSON.stringify(JsonData)
        }
        var newData = 'WebSocketProcessor '+JSON.stringify(data);

        var websocket_connected_count = 0;

        // var ws = new WebSocket("ws://192.168.3.168:8866");
        //WebSocket莫名原因导致浏览器崩溃（app闪退）加入setTimeout解决
        setTimeout(function() {
        var ws = null;
        var ws = new WebSocket("ws://"+host+":"+port);
               ws.onopen = function()
               {
                  // Web Socket 已连接上，使用 send() 方法发送数据
                  ws.send(newData);
                  // comm.showLoading();
                  // alert("数据发送中..."+JSON.stringify(newData));
                  console.log("数据发送中..."+newData)
               };

               ws.onmessage = function (evt)
               {
                //  alert(777)
                  var received_msg = evt.data;
                  if(received_msg){
                    // alert(88)
                    callback(received_msg)
                    isCanAgain = true
                  }

                  // comm.hideLoading();
                  // alert("数据已接收..."+received_msg);
                  // console.log("数据已接收..."+received_msg);
               };
               ws.onerror = function(){
                //  websocket_connected_count++;
                //  if(websocket_connected_count <= 5){
                //   //  alert('hahah')
                //     //  comm.socket(OpCode,JsonData,callback);
                //     //  alert('kk')
                //  }else{
                //   //  alert('end')
                //    ws.close()
                //  }

                //  setInterval(function(){
                //   // comm.reconnect(host,port,newData)
                //  },2000)
                 //网络出现错误的情况，参数进行重置
                //  isCanAgain = true;
               };
               ws.onclose = function()
               {
                //  setInterval(function(){
                //   //  alert(88)
                //  },2000)

                  // 关闭 websocket
                  // alert("连接已关闭...");
               };
             }.bind(this), 5);
    };
    // comm.socket = function(OpCode,JsonData,callback){
    //   var socketManager = api.require('socketManager');
    //   if(api.systemType=='ios'){
    //     var ClientType = 1
    //   }else if(api.systemType=='android'){
    //     var ClientType = 2;
    //   }
    //   var DeviceVersion = api.systemType + api.systemVersion;
    //   var str = '';
    //   var arr = [];
    //   var data = {};
    //   var host = '47.93.214.37';
    //   // var host = '192.168.3.168';
    //   var SessionId = '00000000-0000-0000-0000-000000000000';
    //   var port = 8888;
    //   // var port = 8887;
    //   var Token = comm.token;
    //   var DeviceId = '123';
    //   socketManager.createSocket({
    //       host: host,
    //       port: port,
    //       timeout:60,
    //       bufferSize:1024*1024
    //   }, function(ret, err) {
    //       if (ret) {
    //         if(ret.state===101){
    //           console.log('创建成功');
    //           console.log('DidaChongQingRequestProcessor '+ClientType+' '+OpCode+' '+SessionId+' '+DeviceVersion+' '+DeviceId+' '+Token+' '+JSON.stringify(JsonData)+'\r\n')
    //         }else if(ret.state===102){
    //           socketManager.write({
    //               sid:ret.sid,
    //               data:'DidaChongQingRequestProcessor '+ClientType+' '+OpCode+' '+SessionId+' '+DeviceVersion+' '+DeviceId+' '+Token+' '+JSON.stringify(JsonData)+'\r\n'
    //           },function(ret,err){
    //           })
    //         }else if(ret.state==103){
    //
    //           str += ret.data;
    //           // arr.push(str);
    //           // data.name = str;
    //         }else if(ret.state==205){
    //           // console.log(str+'_______')
    //           callback(str)
    //           console.log('发生未知错误断开')
    //         }
    //       } else {
    //           alert(JSON.stringify(err));
    //       }
    //
    //   });
    // },
    //基于socketManager模块封装的socket请求方法
    // comm.socket = function(host, port, ClientType, OpCode, SessionId, DeviceId, Token, JsonData,callback){
    //   var socketManager = api.require('socketManager');
    //   var str = '';
    //   var arr = [];
    //   socketManager.createSocket({
    //       host: host,
    //       port: port,
    //   }, function(ret, err) {
    //       if (ret) {
    //         switch (ret.state) {
    //           case 101:
    //               console.log('创建成功')
    //             break;
    //           case 102:
    //               socketManager.write({
    //                   sid:ret.sid,
    //                   data:'HttpRequestProcessor '+ClientType+' '+OpCode+' '+SessionId+' '+DeviceId+' '+Token+' '+JSON.stringify(JsonData)+'\r\n'
    //               },function(ret,err){
    //                 // console.log(JSON.stringify(ret)+'99999');
    //                 // console.log('HttpRequestProcessor '+ClientType+' '+OpCode+' '+SessionId+' '+DeviceId+' '+Token+' '+JSON.stringify(JsonData)+'\r\n')
    //               })
    //             break;
    //           case 103:
    //               // var name = 'zhangsan'
    //               console.log('接受到数据了');
    //
    //               str += ret.data;
    //               arr.push(str)
    //               // console.log(JSON.stringify(ret.data));
    //             break;
    //           case 201:
    //               console.log('创建失败')
    //             break;
    //           case 201:
    //               console.log('链接失败');
    //             break;
    //           case 203:
    //               console.log('异常断开');
    //             break;
    //           case 204:
    //               console.log('正常断开');
    //             break;
    //           case 205:
    //               console.log('发生未知错误断开');
    //             break;
    //           default:
    //               console.log('不可知原因')
    //         }
    //           // var sid = ret.sid
    //           // console.log(JSON.stringify(ret))
    //           // if(ret.state === 102){
    //           //   console.log('链接成功')
    //           //   socketManager.write({
    //           //       sid:ret.sid,
    //           //       data:'HttpRequestProcessor '+ClientType+' '+OpCode+' '+SessionId+' '+DeviceId+' '+Token+' '+JsonData+'\r\n'
    //           //   },function(ret,err){
    //           //     console.log(JSON.stringify(ret)+'99999');
    //           //     console.log(8888)
    //           //   })
    //           // }
    //
    //           // return name;
    //           if(callback){
    //             // console.log(str)
    //             callback(str,arr);
    //             // console.log(arr[1])
    //           }
    //       } else {
    //           alert(JSON.stringify(err));
    //       }
    //   });
    //
    // },
    //整理ajax参数
    comm.tidyParams = function(data, fnSuc, fnErr, dataType, showLoading) {
        if (data === undefined || data === null) {
            data = {};
        }
        if (fnSuc === undefined || fnSuc === null) {
            fnSuc = function() {};
        }
        if (fnErr === undefined || fnErr === null) {
            fnErr = function(req, err, obj) {};
        }
        if (dataType === undefined || dataType === null) {
            dataType = 'json';
        }
        var fnSuccess = function(data) {
            if (showLoading) {
                comm.hideLoading();
            }
            fnSuc(data);
        };
        var fnError = function(req, err, obj) {
            if (showLoading) {
                comm.hideLoading();
            }
            fnErr(req, err, obj);
        };
        return {
            data: data,
            fnSuc: fnSuccess,
            fnErr: fnError,
            dataType: dataType
        };
    };
    //---------------------------------------------------------------------
    /*显示加载提示*/
    comm.showLoading = function(title, text) {
        if (title === undefined || title === null) {
            title = '正在读取内容';
        }
        if (text === undefined || text === null) {
            text = '请稍等';
        }
        api.showProgress({
            style: 'default',
            animationType: 'fade',
            title: title,
            text: text,
            modal: true
        });
    };
    /*关闭加载提示*/
    comm.hideLoading = function() {
        api.hideProgress();
    };
    //---------------------------------------------------------------------
    /*显示或隐藏元素*/
    //显示元素
    comm.show = function(el) {
        $api.removeCls(el, "aui-hide");
        $api.removeCls(el, "aui-invisible");
        $api.removeCls(el, "aui-inline");
        $api.addCls(el, "aui-show");
    };
    comm.inline = function(el) {
        $api.removeCls(el, "aui-hide");
        $api.removeCls(el, "aui-invisible");
        $api.removeCls(el, "aui-show");
        $api.addCls(el, "aui-inline");
    };
    //隐藏同时保留元素位置
    comm.hide = function(el) {
        $api.removeCls(el, "aui-show");
        $api.removeCls(el, "aui-invisible");
        $api.removeCls(el, "aui-inline");
        $api.addCls(el, "aui-hide");
    };
    //隐藏同时不保留元素位置
    comm.invisible = function(el) {
        $api.removeCls(el, "aui-show");
        $api.removeCls(el, "aui-hide");
        $api.removeCls(el, "aui-inline");
        $api.addCls(el, "aui-invisible");
    };
    //---------------------------------------------------------------------
    /*项目倒计时*/
    comm.forwardTimingMap = [];
    comm.reverseTimingMap = [];

    comm.checkTimingMap = function(el, timingType) {
        timingType = timingType ? 'reverse' : timingType;
        var map = timingType === 'forward' ? comm.forwardTimingMap : comm.reverseTimingMap;
        var timingItem = null;
        for (var i = 0; i < map.length; i++) {
            if (map[i].el === el) {
                timingItem = map[i];
                break;
            }
        }
        if (timingItem === null) {
            timingItem = {
                el: el,
                timerId: -1,
                seconds: 0,
                status: false,
                timeout: null,
                timestep: null
            };
            map.push(timingItem);
        }
        return timingItem;
    };
    comm.setTimingMap = function(el, seconds, status, timeoutEvt, timestepEvt, timingType) {
        var timing = comm.checkTimingMap(el, timingType);
        timing.seconds = seconds;
        timing.status = status;
        timing.timeout = timeoutEvt ? timeoutEvt : function() {};
        timing.timestep = timestepEvt ? timestepEvt : function() {};
        return timing;
    };
    comm.removeTimingMap = function(el, timingType) {
        timingType = timingType ? 'reverse' : timingType;
        var map = timingType === 'forward' ? comm.forwardTimingMap : comm.reverseTimingMap;
        var index = -1;
        for (var i = 0; i < map.length; i++) {
            if (map[i].el === el) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            map = map.splice(index, 1);
        }
    };
    comm.startForwardTiming = function(el, totalSecs, timeoutEvt, forwardEvt) {
        var forwardTiming = comm.checkTimingMap(el, 'forward');
        if (forwardTiming.status === false) {
            var showTime = function() {
                if (forwardTiming.seconds === 0) {
                    if (forwardTiming.timeout) {
                        comm.stopForwardTiming(forwardTiming.el);
                        forwardTiming.timeout();
                        forwardTiming.timeout = null;
                        forwardTiming.timestep = null;
                    }
                } else {
                    forwardTiming.seconds -= 1;
                    if (forwardTiming.timestep) {
                        forwardTiming.timestep();
                    }
                    $api.html(el, comm.getTimeDisplay(forwardTiming.seconds));
                }
            };
            //el.style.visibility = 'visible';
            $api.html(el, comm.getTimeDisplay(totalSecs));
            comm.setTimingMap(el, totalSecs, true, timeoutEvt, forwardEvt, 'forward');
            forwardTiming.timerId = setInterval(showTime, 1000);
        }
    };
    comm.stopForwardTiming = function(el) {
        var forwardTiming = comm.checkTimingMap(el, 'forward');
        if (forwardTiming.status === true) {
            //el.style.visibility = 'hidden';
            $api.html(el, '');
            forwardTiming.status = false;
            clearInterval(forwardTiming.timerId);
            comm.removeTimingMap(el, 'forward');
        }
    };
    comm.startReverseTiming = function(el, totalSecs, timeoutEvt, reverseEvt) {
        var reverseTiming = comm.checkTimingMap(el, 'reverse');
        if (reverseTiming.status === false) {
            var showTime = function() {
                if (reverseTiming.seconds === 0) {
                    if (reverseTiming.timeout) {
                        comm.stopReverseTiming(reverseTiming.el);
                        reverseTiming.timeout();
                        reverseTiming.timeout = null;
                        reverseTiming.timestep = null;
                    }
                } else {
                    reverseTiming.seconds -= 1;
                    if (reverseTiming.timestep) {
                        reverseTiming.timestep();
                    }
                    $api.html(el, comm.getTimeDisplay(reverseTiming.seconds));
                }
            };
            //el.style.visibility = 'visible';
            $api.html(el, comm.getTimeDisplay(totalSecs));
            comm.setTimingMap(el, totalSecs, true, timeoutEvt, reverseEvt, 'reverse');
            reverseTiming.timerId = setInterval(showTime, 1000);
        }
    };
    comm.stopReverseTiming = function(el) {
        var reverseTiming = comm.checkTimingMap(el, 'reverse');
        if (reverseTiming.status === true) {
            //el.style.visibility = 'hidden';
            $api.html(el, '');
            reverseTiming.status = false;
            clearInterval(reverseTiming.timerId);
            comm.removeTimingMap(el, 'reverse');
        }
    };
    //---------------------------------------------------------------------
    comm.PhotoUrl = function(imgEle, picUri) {
        var url = picUri.replace(".png", ".ll");
        var Photourl = 'fs://' + url;
        var fs = api.require('fs');
        var fnDrawImg = function(fs, Photourl, imgEle) {
            fs.open({
                path: Photourl,
                flags: 'read_write'
            }, function(ret, err) {
                imgEle.src = ret.fd;
            });
        }
        fs.exist({
            path: Photourl
        }, function(ret, err) {
            if (ret.exist === true && ret.directory === false) {
                fnDrawImg(fs, Photourl, imgEle);
            } else {
                api.download({
                    url: comm.picUri + picUri.replace(/ /g, '%20'),
                    savePath: Photourl,
                    report: true,
                    cache: true,
                    allowResume: true
                }, function(ret, err) {
                    if (ret.state == 1) {
                        //下载成功
                        fnDrawImg(fs, Photourl, imgEle);
                    } else if (err) {
                        imgEle.src = comm.picUri + picUri;
                    }
                });
            }
        });
    };
    //---------------------------------------------------------------------
    //将全角转换为半角
    comm.ToCDB = function(str) {
        var tmp = "";
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) == 12288) {
                tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
                continue;
            }
            if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
                tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
            } else {
                tmp += String.fromCharCode(str.charCodeAt(i));
            }
        }
        return tmp
    };

    //去除字符串中的空格
    comm.Trim = function(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    };
    //---------------------------------------------------------------------
    //判断电话号码是否有效
    comm.isPoneAvailable = function(str) {
        console.log('diaoyongle')
        var myReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (!myReg.test(str)) {
            return false;
        } else {
            return true;
        }
    };
    //判断密码格式是否正确
    comm.isCorrectPassword = function(str) {
        var myReg = /^[a-zA-Z\d]{6,8}$/;
        if (!myReg.test(str)) {
            return false;
        } else {
            return true;
        }
    };
    //---------------------------------------------------------------------
    //尝试设置创建目录
    comm.tryCreateFolder = function(folder) {
        var fs = api.require('fs');
        fs.exist({
            path: 'fs://' + folder
        }, function(ret, err) {
            if (!(ret && ret.directory && ret.exist)) {
                fs.createDir({
                    path: 'fs://' + folder
                }, function(ret, err) {
                    if (ret && ret.status) {
                        comm.debug('create folder ' + folder + ' succeed', null, 'debug');
                    } else {
                        comm.debug('create folder ' + folder + ' failed', null, 'error');
                    }
                });
            }
            if (err && err.code !== 0) {
                comm.debug('create folder ' + folder + ' error ', err, 'error');
            }
        });
    };
    comm.tryReadFolder = function(folder, callback) {
        var fs = api.require('fs');
        fs.readDir({
            path: 'fs://' + folder
        }, function(ret, err) {
            if (ret && ret.status) {
                comm.debug('reader folder [' + folder + '] result ', ret, 'debug');
            }
            if (err && err.code !== 0) {
                comm.debug('reader folder [' + folder + '] error ', err, 'error');
            }
            if (callback && comm.isFunction(callback)) {
                callback(ret, err);
            }
        });
    };
    comm.tryRemoveFolder = function(folder, callback) {
        var fs = api.require('fs');
        fs.rmdir({
            path: 'fs://' + folder
        }, function(ret, err) {
            if (ret && ret.status) {
                comm.debug('remove folder [' + folder + '] succeed ', ret, 'debug');
            }
            if (err && err.code !== 0) {
                comm.debug('remove folder [' + folder + '] error ', err, 'error');
            }
            if (callback && comm.isFunction(callback)) {
                callback(ret, err);
            }
        });
    };
    comm.tryDownloadFile = function(url, localpath, callback) {
        api.download({
            url: url,
            savePath: localpath,
            report: true,
            cache: true,
            allowResume: true
        }, function(ret, err) {
            if (ret && ret.state === 1) {
                comm.debug('download file [' + url + '] succeed ', ret, 'debug');
            }
            if (err && err.code !== 0) {
                comm.debug('download file [' + url + '] error ', err, 'error');
            }
            if (callback && comm.isFunction(callback)) {
                callback(ret, err);
            }
        });
    };
    comm.checkFileExist = function(localpath, callback) {
        var fs = api.require('fs');
        fs.exist({
            path: localpath
        }, function(ret, err) {
            if (ret) {
                if (ret.exist) {
                    ret.directory && comm.debug('directory [' + localpath + '] exist ', ret, 'debug');
                    (!ret.directory) && comm.debug('file [' + localpath + '] exist ', ret, 'debug');
                } else {
                    comm.debug('file or directory [' + localpath + '] not exist ', ret, 'debug');
                }
            }
            if (err) {
                comm.debug('check file [' + localpath + '] exist error ', err, 'error');
            }
            if (callback && comm.isFunction(callback)) {
                callback(ret, err);
            }
        });
    };
    comm.tryReadFolder = function(folder, callback) {
        var fs = api.require('fs');
        fs.readDir({
            path: 'fs://' + folder
        }, function(ret, err) {
            if (ret && ret.status) {
                comm.debug('read folder [' + folder + '] succeed ', ret, 'debug');
            }
            if (err && err.code !== 0) {
                comm.debug('read folder [' + folder + '] error ', err, 'error');
            }
            if (callback && comm.isFunction(callback)) {
                callback(ret, err);
            }
        });
    };
    comm.resetFsUri = function(filePath) {
        var path = filePath.replace(/fs:\/\//g, '');
        path = 'file:' + api.fsDir + '/' + path;
        return path;
    };
    //--------------------------------------------------------------------
    //添加正方形图层,居中图片
    comm.fillImgToSquare = function(blob, onsucceed) {
        blob = (typeof blob === 'string') ? blob : URL.createObjectURL(blob);

        var img = new Image();
        var canvas = document.createElement('canvas');

        img.onload = function() {
            var iCurWidth = img.width,
                iCurHeight = img.height;
            var iLine = Math.max(iCurWidth, iCurHeight);

            var iLeft = (iLine - iCurWidth) / 2;
            var iTop = (iLine - iCurHeight) / 2;
            canvas.width = iLine;
            canvas.height = iLine;

            var ctx = canvas.getContext('2d');
            ctx.width = iLine;
            ctx.height = iLine;
            // 设置为白色背景，jpg是不支持透明的，所以会被默认为canvas默认的黑色背景。
            //ctx.fillStyle = 'transparent';
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, iLine, iLine);

            ctx.drawImage(img, iLeft, iTop, iCurWidth, iCurHeight);
            var resizeImg = canvas.toDataURL('image/jpeg');

            onsucceed(resizeImg);
        }
        img.src = blob;
    };
    //以图片中心剪裁为正方形
    comm.cutImgToSquare = function(blob, onsucceed) {
        blob = (typeof blob === 'string') ? blob : URL.createObjectURL(blob);

        var img = new Image();
        var canvas = document.createElement('canvas');

        img.onload = function() {
            var iCurWidth = img.width,
                iCurHeight = img.height;
            var iLine = Math.min(iCurWidth, iCurHeight);

            var iLeft = (iCurWidth - iLine) / 2;
            var iTop = (iCurHeight - iLine) / 2;
            canvas.width = iLine;
            canvas.height = iLine;

            var ctx = canvas.getContext('2d');
            ctx.width = iLine;
            ctx.height = iLine;
            // 设置为白色背景，jpg是不支持透明的，所以会被默认为canvas默认的黑色背景。
            //ctx.fillStyle = 'transparent';
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, iLine, iLine);

            ctx.drawImage(img, iLeft, iTop, iLine, iLine, 0, 0, iLine, iLine);
            var resizeImg = canvas.toDataURL('image/jpeg');

            onsucceed(resizeImg);
        }
        img.src = blob;
    };
    //缩放图片
    comm.resizeImg = function(blob, line, onsucceed) {
        blob = (typeof blob === 'string') ? blob : URL.createObjectURL(blob);

        var img = new Image(),
            canvas = document.createElement('canvas');

        img.onload = function() {
            var iCurWidth = img.width,
                iCurHeight = img.height;
            var iLine = Math.min(iCurWidth, iCurHeight);

            if (line < iLine) {
                var vote = line / iLine;
                iCurWidth = iCurWidth * vote;
                iCurHeight = iCurHeight * vote;
                iLine = line;
            }

            canvas.width = iCurWidth;
            canvas.height = iCurHeight;

            var ctx = canvas.getContext('2d');
            ctx.width = iCurWidth;
            ctx.height = iCurHeight;
            // 设置为白色背景，jpg是不支持透明的，所以会被默认为canvas默认的黑色背景。
            //ctx.fillStyle = 'transparent';
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, iCurWidth, iCurHeight);

            ctx.drawImage(img, 0, 0, iCurWidth, iCurHeight);
            var resizeImg = canvas.toDataURL('image/jpeg');

            onsucceed(resizeImg);
        }
        img.src = blob;
    };
    //剪裁为正方形并缩放图片
    comm.cutAndResizeImg = function(blob, line, onsucceed) {
        comm.cutImgToSquare(blob, function(resizeBlob) {
            comm.resizeImg(resizeBlob, line, onsucceed)
        });
    };
    //居中图片在正方形容器中并缩放图片
    comm.fillAndResizeImg = function(blob, line, onsucceed) {
        comm.fillImgToSquare(blob, function(resizeBlob) {
            comm.resizeImg(resizeBlob, line, onsucceed)
        });
    };
    comm.clearAllData = function() {
        $storage.clearStorage();
        //comm.tryRemoveFolder('book');
        // comm.tryRemoveFolder('chivox');
        // comm.tryRemoveFolder('audio');
        // comm.tryRemoveFolder('reader');
        // comm.tryRemoveFolder('');
    };
    //---------------------------------------------------
    window.$comm = comm;
})(window);
