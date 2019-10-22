(function (window) {
    'use strict';
    //驰声语音评测云的结果解析
    var comm = {};

    //---------------------------------------------------------------------
    //转换驰声语音评测云的结果（100分制）,其中成绩中的总分是自定义计算产生的
    comm.parse = function (ret) {
        var result = {};
        if (ret && ret.value && ret.value.result) {
            //总体得分
            //result.overall = ret.value.result.overall;
            result.overall = comm.calcTotalScore(ret);
            //声调得分
            result.tone = ret.value.result.tone;
            //无调发音得分
            result.phn = ret.value.result.phn;
            //流利度得分
            if (ret.value.result.fluency) {
                result.foverall = ret.value.result.fluency.overall;
            }
            //音频质量信息
            result.tipmsg = comm.convertTipMsg(ret.value.result);
            //评分异常错误
            result.errmsg = comm.convertErrMsg(ret.value.result);
            //录音时间（秒）
            result.wavetime = ret.value.result.wavetime / 1000;
            //评分耗时（秒）
            result.systime = ret.value.result.systime / 1000;
            //每个字的细节评分结果
            result.details = [];
            if (ret.value.result.details) {
                for (var i = 0; i < ret.value.result.details.length; i++) {
                    //音节整体得分，带调发音得分，无调发音得分，声调得分
                    result.details.push({
                        overall: ret.value.result.details[i].overall,
                        pron: ret.value.result.details[i].pron,
                        phn: ret.value.result.details[i].phn,
                        tonescore: ret.value.result.details[i].tonescore
                    });
                }
            }
        }
        return result;
    };
    //无调阈值，单字总分超过90认为读的准确
    comm.precisionThreshold = 90;
    //是否朗读阀值，单字总分超过10认为该字有朗读过
    comm.readedThreshold = 10;
    //单位时间（每分钟）的标准朗读字数基准（180字/分）
    comm.completeBase = 200;
    //准确率得分权重
    comm.precisionWeight = 50;
    //完整度得分权重
    comm.completeWeight = 50;
    //计算自定义驰声得分
    comm.calcTotalScore = function (ret, userGrade) {
        var totalscore = 0;
        if (ret && ret.value && ret.value.result) {
            var chivoxRes = ret.value.result;
            //总字数
            var totalWords = chivoxRes.details.length;
            //无调字数
            var phnWords = 0;
            //有调字数
            var pronWords = 0;
            //无调分值;
            var phnScore = 0;
            //有调分值
            var pronScore = 0;
            //流利度分值
            var fluency = ret.value.result.fluency.speed;

            //计算流利度分值
            var fluencyScore = 0;
            var precisionCount = 0;
            //进行朗读的字数（符合完整度判断的字数）
            var readedCount = 0;
            for (var i = 0; i < chivoxRes.details.length; i++) {
                var item = chivoxRes.details[i];
                if (item.phn >= comm.precisionThreshold) {
                    phnWords++;
                }
                if (item.pron >= comm.readedThreshold) {
                    pronWords++;
                }
            }
            phnScore = (phnWords / totalWords) * 100;
            pronScore = (pronWords / totalWords) * 100;
            fluencyScore = comm.calcFluencyScore(fluency, userGrade);
            totalscore = phnScore * 0.55 + pronScore * 0.2 + fluencyScore * 0.25;
            totalscore = Math.floor(totalscore);
        }
        var objScore = {
            totalscore: totalscore,
            phnScore: phnScore,
            pronScore: pronScore
        };
        return objScore;
    };
    /*
      0：本次录音没有异常
       10000，音频数据为 0，可提示未录音；
       10001，用户发音不完整如"我很喜欢吃蛋糕"，可能只发了"我很喜欢"，可
     提示发音不完整；
       10002 ， 10003 ，识别不完整，出现这种情况大部分是静音，及音频偏短，可
     提示发音不完整；
       10004，音量偏低，可能位置太远，可建议用户调整麦克风位置；
       10005，音频截幅，可能位置太近，可建议用户调整麦克风位置；
       10006，音频质量偏差（由录音环境嘈杂或语音不明显引起的信噪比低，或
     麦克风质量偏差), 可提示语音不明显。
     * */

    comm.calcFluencyScore = function (fluency, userGrade) {
        var score;
        var grade = parseInt(userGrade);
        if (userGrade  === 1 ) {
            score = (fluency / 150) *100
        } else if (userGrade  === 2) {
            score = (fluency / 160) *100
        } else if (userGrade  === 3) {
            score = (fluency / 180) *100
        } else if (userGrade  === 4) {
            score = (fluency / 200) *100
        } else if (userGrade  === 5) {
            score = (fluency / 200) *100
        } else if (userGrade  === 6) {
            score = (fluency / 220) *100
        }
        return score > 100 ? 100 : score
    };
    comm.convertTipMsg = function (result) {
        var tipMsg = '';
        if (result && result.info && result.info.tipId) {
            switch (result.info.tipId) {
                case 0:
                    break;
                case 10000:
                    tipMsg = '音频过短，请确认是否正确录音';
                    break;
                case 10001:
                case 10002:
                case 10003:
                    tipMsg = '识别不完整，请确认是否完整朗读';
                    break;
                case 10004:
                    tipMsg = '音量偏低，请调整麦克风位置';
                    break;
                case 10005:
                    tipMsg = '音频截幅，请调整麦克风位置';
                    break;
                case 10006:
                    tipMsg = '音频质量偏差，录音环境嘈杂或麦克风质量偏差';
                    break;
                default:
                    break;
            }
        }
        return tipMsg;
    };
    comm.convertErrMsg = function (result) {
        var errMsg = '';
        if (result && result.errID) {
            switch (result.errID) {
                case 40092:
                    errMsg = '传输的音频时长超限';
                    break;
                case 41030:
                    errMsg = '身份授权验证未通过';
                    break;
                case 51000:
                    errMsg = '初始化内核错误';
                    break;
                default:
                    errMsg = '评分失败 errID:' + result.errID;
                    break;
            }
        }
        return errMsg;
    };
    //---------------------------------------------------------------------
    window.$chivox = comm;

})(window); 