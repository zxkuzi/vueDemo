(function (window) {
    var home = {};
    //获取一年图书列表
    home.getMyBooks = function (funSuc, funErr) {
        $comm.ajaxPost('Shelf', 'MyBooks', {}, funSuc, funErr, 'json', true);
    };
    //解锁图书
    home.unlockBook = function (bid, funSuc, funErr) {
        var data = {
            bid: bid
        };
        $comm.ajaxPost('Shelf', 'Checkout', data, funSuc, funErr, 'json', true);
    };
    //按自然年筛选图书
    home.screeningBookInYear = function (year, first, funSuc, funErr) {
        var data = {
            year: year,
            first: first
        };
        $comm.ajaxPost('Shelf', 'MyBooksInYear', data, funSuc, funErr, 'json', true);
    };
    //可替换的图书列表
    home.changeAllBooks = function (funSuc, funErr) {
        $comm.ajaxPost('Shelf', 'AllBooks', {}, funSuc, funErr, 'json', true);
    };
    //共度读训练营
    home.getTrainBooks = function (funSuc, funErr) {
        $comm.ajaxPost('Shelf', 'GongDuBooks', {}, funSuc, funErr, 'json', true);
    };
    //替换图书
    home.changeBook = function (fromId, tobId, funSuc, funErr) {
        var data = {
            frombid: fromId,
            tobid: tobId
        };
        $comm.ajaxPost('Shelf', 'ChangeBook', data, funSuc, funErr, 'json', true);
    };
    //图书概况
    home.bookInformation = function (bid, funSuc, funErr) {
        var data = {
            bid: bid
        };
        $comm.ajaxPost('Reading', 'BookInfo', data, funSuc, funErr, 'json', true);
    };
    //VIP购买
    home.buyVIP = function () {
        $comm.ajaxPost('Payment', 'VipMember', {}, funSuc, funErr, 'json', true);
    };
    //下载图书
    home.downloadBook = function (bid, funSuc, funErr) {
        var data = {
            bid: bid
        };
        $comm.ajaxPost('Reading', 'DownloadBook', data, funSuc, funErr, 'json', true);
    };
    //开启本次阅读
    home.readingStartCurrent = function (bcId, funSuc, funErr) {
        var data = {
            bcid: bcId
        };
        $comm.ajaxPost('Reading', 'StartCurrent', data, funSuc, funErr, 'json', true)
    };
    //完成本次阅读
    home.readingFinishCurrent = function (bcId, testId, behavior, funSuc, funErr) {
        var data = {
            bcid: bcId,
            behavior: behavior,
            testid: testId
        };
        console.log('-------123----->>' + JSON.stringify(data));
        $comm.ajaxPost('Reading', 'FinishCurrent', data, funSuc, funErr, 'json', true)
    };
    //图书菜单
    home.getBookMenu = function (bid, funSuc, funErr) {
        var data = {
            bid: bid
        };
        $comm.ajaxPost('Reading', 'MyChapters', data, funSuc, funErr, 'json', true);
    };
    //图书菜单详情
    home.getBookChapterInfo = function (bcid, funSuc, funErr) {
        var data = {
            bcid: bcid
        };
        $comm.ajaxPost('Reading', 'MyChapter', data, funSuc, funErr, 'json', true);
    };//图书菜单详情
    home.getBookChapterInfo = function (bcid, funSuc, funErr) {
        var data = {
            bcid: bcid
        };
        $comm.ajaxPost('Reading', 'MyChapter', data, funSuc, funErr, 'json', true);
    };
    //阅读单元
    home.getReadingTestPaper = function (bcid,testId, funSuc, funErr) {
        var data = {
            bcid: bcid,
            testid: testId
        };
        $comm.ajaxPost('Reading', 'ReadblockPaper', data, funSuc, funErr, 'json', true);
    };
    //提交朗读测成绩
    home.postReadingScore = function (testId, qid, qscore, chivoxResult, complete, correct, fluency, funSuc, funErr) {
        var data = {
            testid: testId,
            qid: qid,
            qscore: qscore,
            chivoxResult: chivoxResult,
            complete: complete,
            correct: correct,
            fluency: fluency
        };
        $comm.ajaxPost('Reading', 'ReadblockScore', data, funSuc, funErr, 'json', true);
    };
    //提交朗读声音
    home.postReadingAudio = function (data, funSuc, funErr) {
        var data = {
            testid: data.testid,
            qid: data.qid,
            audioFile: data.audioFile
        };
        $comm.ajaxPost('Reading', 'ReadblockAudio', data, funSuc, funErr, 'json', true);
    };
    //开始单元朗读
    home.startReading = function (testId, funSuc, funErr) {
        var data = {
            testid: testId
        };
        $comm.ajaxPost('Reading', 'StartReading', data, funSuc, funErr, 'json', true);
    };
    //完成单元朗读
    home.finishReading = function (testId, readingPercentage, funSuc, funErr) {
        var data = {
            testid: testId,
            readingPercentage: readingPercentage
        };
        $comm.ajaxPost('Reading', 'FinishReading', data, funSuc, funErr, 'json', true);
    };
    //翻页
    home.pageChanging = function (data, funSuc, funErr) {
        var data = {
            testid: data.testId,
            cfi: data.cfi,
            percentage: Math.round(data.percentage),
            bookpercentage: Math.round(data.bookpercentage)
        };
        $comm.ajaxPost('Reading', 'PageChanging', data, funSuc, funErr, 'json', false);
    };
    //打开图书字数记录(BeginRecordWordCount)
    home.BeginRecordWordCount = function (data, funSuc, funErr) {
        var data = {
            BID: data.bid,
            BCID: data.bcid
        };
        $comm.ajaxPost('Reading', 'BeginRecordWordCount', data, funSuc, funErr, 'json', false);
    };
    //记录读书字数(RecordWordCount)
    home.RecordWordCount = function (data, funSuc, funErr) {
        var data = {
            RecordID: data.recordID,
            WordCount: data.wordCount
        };
        $comm.ajaxPost('Reading', 'RecordWordCount', data, funSuc, funErr, 'json', false);
    };
    //阅读测阅读理解题
    home.getReadChoicePaper = function (bcid, testId, funSuc, funErr) {
        var data = {
            bcid: bcid,
            testid: testId
        };
        $comm.ajaxPost('Reading', 'ChoicePaper', data, funSuc, funErr, 'json', true);
    };
    //提交阅读理解成绩
    home.postChoiceScore = function (data, funSuc, funErr) {
        var data = {
            testid: data.testid,
            bcid: data.bcid,
            questions: data.questions
           };
        $comm.ajaxPost('Reading', 'ChoiceScore', data, funSuc, funErr, 'json', true);
    };
    //vip微信支付
    home.payVipProducts = function (data,funSuc, funErr) {
        //todo: 根绝用户信息传值
        var data = {
            viptype:data.viptype,
            productnumber: data.productnumber,
            cashprice: data.cashprice,
            cashpaytype: data.cashpaytype,
            couponprice: data.couponprice,
            couponids: []
        };
        $comm.ajaxPost('Pay', 'VipPreOrder', data, funSuc, funErr, 'json', true);
    };
    //获取图书点赞数
    home.getBookHeartCount = function (bid, funSuc, funErr) {
        var data = {
            BookID: bid
        };
        $comm.ajaxPost('Book', 'GetBookHeartCount', data, funSuc, funErr, 'json', true);
    };
    //图书点赞
    home.giveBookHeart = function (bid, type, funSuc, funErr) {
        var data = {
            BookID: bid,
            MethodAction: type
        };
        $comm.ajaxPost('Book', 'BookHeart', data, funSuc, funErr, 'json', true);
    };
    //换书图书概况
    home.getChangeBookInfo = function (bid, funSuc, funErr) {
        var data = {
            BookID: bid
        };
        $comm.ajaxPost('Book', 'BookInfoByChangeBook', data, funSuc, funErr, 'json', true);
    };
    //书房首页
    home.studyHome= function () {
      $comm.socket(1003,data,fun)
    }
    window.$homeService = home;
})(window);
