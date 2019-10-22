(function (window) {
    var growUp = {};
    //用户成长基础信息
    growUp.userGrowupInfo=function(funSuc, funErr){
      $comm.ajaxPost('Growup', 'UserGrowupInfo', {}, funSuc, funErr, 'json', true);
    };
    //用户阅读记录
    growUp.studentReadingLog=function(funSuc, funErr){
      $comm.ajaxPost('Growup', 'StudentReadingLog', {}, funSuc, funErr, 'json', true);
    };
    //用户阅读时长统计
    growUp.studentReadTimeCountLog=function(startTime,endTime,funSuc, funErr){
      var data = {
          StartTime: startTime,
          EndTime: endTime
      };
      $comm.ajaxPost('Growup', 'StudentReadTimeCountLog', data, funSuc, funErr, 'json', true);
    };
    //用户阅读量统计
    growUp.studentReadWordCountLog=function(startTime,endTime,funSuc, funErr){
      var data = {
          StartTime: startTime,
          EndTime: endTime
      };
      $comm.ajaxPost('Growup', 'StudentReadWordCountLog', data, funSuc, funErr, 'json', true);
    };
    //用户平均分统计
    growUp.studentReadAvgScoreLog=function(startTime,endTime,funSuc, funErr){
      var data = {
          StartTime: startTime,
          EndTime: endTime
      };
      $comm.ajaxPost('Growup', 'StudentReadAvgScoreLog', data, funSuc, funErr, 'json', true);
    };
    //报告页能力雷达图信息经验
    growUp.getReadingRadar = function (funSuc, funErr) {
        $comm.ajaxPost('Growup', 'ReadingRadar', {}, funSuc, funErr, 'json', true);
    };
    window.$growService = growUp;
})(window);
