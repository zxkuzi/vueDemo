(function(){
    //封装的诸葛模块
    // var comm = {};
    // // var commzhuGe = null;
    // var isdebug = true;
    // // 初始化zhuge
    // function initZhuge () {
    //     if (!commzhuGe) {
    //         commzhuGe = api.require('zhuge');
    //         //诸葛实时调试日志
    //         commzhuGe.openLog();
    //         //zhuge.openDebug();
    //         commzhuGe.initZhuge();
    //     }
    // }
    // //绑定点击事件
    comm.bindEvent = function (el, evName, callback, eventName, eventProperty) {
        if (isdebug && arguments.length > 3) {
            el.addEventListener(evName, function (e) {
                // initZhuge();
                callback(e);
                var evObject = {
                    eventName: eventName
                };
                if (eventProperty) {
                    evObject.eventPro = eventProperty;
                }
                // commzhuGe.track(evObject)
            })
        } else {
            el.addEventListener(evName, function (e) {
                callback(e);
            })
        }
    };
    // //绑定诸葛
    // comm.bindZhuge = function (eventName, eventProperty) {
    //     if (!isdebug) {
    //         return;
    //     }
    //     initZhuge();
    //     var evObject = {
    //         eventName: eventName
    //     };
    //     if (eventProperty) {
    //         evObject.eventPro = eventProperty;
    //     }
    //     commzhuGe.track(evObject)
    // };
    //
    // //标示用户
    // comm.identify = function (uid, userInfo) {
    //     if (!isdebug) {
    //         return;
    //     }
    //     initZhuge();
    //     var evObject = {
    //         uid: uid
    //     };
    //     if (userInfo) {
    //         evObject.userPro = userInfo
    //     }
    //     commzhuGe.identify(evObject)
    // };
    //
    // //上传所有信息并退出
    // comm.flush = function () {
    //     if (isdebug) {
    //         return;
    //     }
    //     initZhuge();
    //     commzhuGe.flush();
    // };
    //
    // window.$analysis = comm;
})();
