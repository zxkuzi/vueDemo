(function () {
    var comm = {};
    //分享入学测证书url
    comm.shareEntranceCertificate = function (funSuc, funErr) {
        var data = {
            SharedType: 1,
            TestID: '00000000-0000-0000-0000-000000000000',
            Days: 0
        };
        $comm.ajaxPost('Share', 'SharedUrl', data, funSuc, funErr)
    };

    //获取阅读测朗读成绩的分享URL
    comm.shareReadBlockScore = function (testId, funSuc, funErr) {
        var data = {
            SharedType: 2,
            TestID: testId,
            Days: 0
        };
        $comm.ajaxPost('Share', 'SharedUrl', data, funSuc, funErr)
    };

    //获取阅读测成绩的分享URL
    comm.shareChoiceScore = function (testId, funSuc, funErr) {
        var data = {
            SharedType: 3,
            TestID: testId,
            Days: 0
        };
        $comm.ajaxPost('Share', 'SharedUrl', data, funSuc, funErr)
    };

    //获取连续朗读天数的分享URL
    comm.shareSerialReadDays = function (days, funSuc, funErr) {
        var data = {
            SharedType: 4,
            TestID: '00000000-0000-0000-0000-000000000000',
            Days: days
        };
        $comm.ajaxPost('Share', 'SharedUrl', data, funSuc, funErr)
    };

    //获取连续阅读天数的分享URL
    comm.shareSerialReadingDays = function (days, funSuc, funErr) {
        var data = {
            SharedType: 5,
            TestID: '00000000-0000-0000-0000-000000000000',
            Days: days
        };
        $comm.ajaxPost('Share', 'SharedUrl', data, funSuc, funErr)
    };

    //获取任务完成-每日朗读的分享URL
    comm.shareDailyReadTask = function (funSuc, funErr) {
        $comm.ajaxPost('Share', 'DailyReadTask', {}, funSuc, funErr)
    };

    //获取任务完成-15分钟读书的分享URL
    comm.shareDailyReadingQuarterTask = function (funSuc, funErr) {
        $comm.ajaxPost('Share', 'DailyReadingQuarterTask', {}, funSuc, funErr)
    };

    //获取任务完成-30分钟读书的分享URL
    comm.shareDailyReadingHalfHourTask = function (funSuc, funErr) {
        $comm.ajaxPost('Share', 'DailyReadingHalfHourTask', {}, funSuc, funErr)
    };

    //分销 {"Activitys":[{"ID":"bf06962f-d1c6-4c13-a16e-814c8c81df26","ActivityName":"第一批分销活动","Rules":"分销规则","DefaultTime":"2000-01-01T00:00:00"}],"errCode":0,"errMsg":"","DefaultTime":"2000-01-01T00:00:00"}
    comm.shareFeedBack = function (type, funSuc, funErr) {
        var data = {
            UserType: type
        };
        $comm.ajaxPost('Activity', 'ActivityDistribution', data, funSuc, funErr)
    };

    comm.activityUsers = function (guid, funSuc, funErr) {
        $comm.ajaxPost('Activity', 'ActivityInvites', {ActivityID: guid}, funSuc, funErr)
    };
    //阅读代言人
    comm.getSpokesmanInfo = function (funSuc, funErr) {
        $comm.ajaxPost('Activity', 'ActivityReadEndorsement', {}, funSuc, funErr, 'json', true)
    };

    window.$weChatShare = comm;
})();