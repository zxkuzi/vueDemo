(function (window) {
    var gradingTest = {};
    //获取入学测的数量
    gradingTest.getTestUserCount = function (funSuc, funErr) {
        $comm.ajaxPost('Entrance', 'TestCount', {}, funSuc, funErr, 'json', true);
    };
    //获取入学测试卷
    gradingTest.getTestPaper = function (grade, month, funSuc, funErr) {
        var data = {
            grade: grade,
            month: month
        };
        $comm.ajaxPost('Entrance','Paper', data, funSuc, funErr, 'json', true);
    };
    //提交朗读测成绩
    gradingTest.submitReadResults = function (testId, paperId, qid, qscore, readResult, complete, correct, fluency, funSuc, funErr) {
        var data = {
            testid: testId,
            paperid: paperId,
            qid: qid,
            qscore: qscore,
            complete: complete,
            correct: correct,
            fluency: fluency,
            chivoxResult: readResult
        };
        $comm.ajaxPost('Entrance','ReadblockScore', data, funSuc, funErr, 'json', true);
    };
    //提交朗读测录音
    gradingTest.submitReadAudio = function (testId, paperId, qid, autoFile, funSuc, funErr) {
        var data = {
            testid: testId,
            paperid: paperId,
            qid: qid,
            autoFile: autoFile
        };
        $comm.ajaxPost('Entrance','ReadblockAudio', data, funSuc, funErr, 'json', true);
    };
    //提交朗读理解成绩
    gradingTest.submitReadQuestions = function (data, funSuc, funErr) {
        var thisdata = {
            testid: data.testId,
            isfinal: data.isfinal,
            paperid: data.paperId,
            reviewtimes: data.reviewTimes,
            qscores: JSON.stringify(data.questions)
        };
        $comm.ajaxPost('Entrance','ChoiceScore', thisdata, funSuc, funErr, 'json', true);
    };
    //入学测最终结果
    gradingTest.entranceTestResults = function (testId, funSuc, funErr) {
        var data = {
            testid: testId
        };
        $comm.ajaxPost('Entrance','TotalScore', data, funSuc, funErr, 'json', true);
    };
    //图书推荐
    gradingTest.recommendBook = function (numbers, funSuc, funErr) {
        var data = {
            numbers: numbers
        };
        $comm.ajaxPost('Entrance','RecommendBooks', data, funSuc, funErr, 'json', true);
    };
    //开始阅读之旅
    gradingTest.startReadingTravel = function (funSuc, funErr) {
        $comm.ajaxPost('Entrance','EnterIntoShelf', {}, funSuc, funErr, 'json', true);
    };
    //读书数量
    gradingTest.surveyBookCount = function (bookCount, funSuc, funErr) {
        var data = {
            booknumber: bookCount
        };
        $comm.ajaxPost('Login', 'ReadComplete', data, funSuc, funErr, 'json', true)
    };
    //完善用户名称
    gradingTest.completeName = function (name, funSuc, funErr) {
        var data = {
            username: name
        };
        $comm.ajaxPost('Login', 'NameComplete', data, funSuc, funErr, 'json', true)
    };
    window.$GradingTest = gradingTest;
})(window);