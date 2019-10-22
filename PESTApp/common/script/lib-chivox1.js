(function (window) {
    'use strict';
    //驰声语音评测云的结果解析
    var comm = {};

    //---------------------------------------------------------------------
    //转换驰声语音评测云的结果（100分制）,其中成绩中的总分是自定义计算产生的
    comm.parse = function (ret,type) {
        // console.log(dataLength)
        var result = {};
        if (ret && ret.value && ret.value.result) {
            console.log(99)
            //总体得分
            //result.overall = ret.value.result.overall;
            // result.overall = comm.calcTotalScore(ret);
            // console.log(result.overall)

            //声调得分
            result.tone = ret.value.result.tone;
            //无调发音得分
            result.phn = ret.value.result.phn;
            //流利度得分
            if (ret.value.result.fluency) {
                result.overall = ret.value.result.fluency.overall;
            }
            //音频质量信息
            if(type=="cn.pred.raw"){
              result.tipmsg = comm.convertTipMsg(ret.value.result);
            }else if(type=="cn.sent.score"){
              // result.tipmsg = comm.convertTipMsgg(ret.value.result);
            }

            console.log('弹出的信息'+result.tipmsg)
            //评分异常错误
            // result.errmsg = comm.convertErrMsg(ret.value.result);
            //录音时间（秒）
            // result.wavetime = ret.value.result.wavetime / 1000;
            //评分耗时（秒）
            // result.systime = ret.value.result.systime / 1000;
            //每个字的细节评分结果
            result.details = [];
            result.tipMsg = '';
            if (ret.value.result.details) {
                if(type=='cn.sent.score'){
                  for (var i = 0; i < ret.value.result.details.length; i++) {
                      //音节整体得分，带调发音得分，无调发音得分，声调得分
                      result.details.push({
                          overall: ret.value.result.details[i].overall,
                          pron: ret.value.result.details[i].pron,
                          phn: ret.value.result.details[i].phn,
                          tonescore: ret.value.result.details[i].tonescore,
                          char:ret.value.result.details[i].char,
                          tone:ret.value.result.details[i].tone,
                          cnword:ret.value.result.details[i].cnword
                      });
                  }
                }else if(type==='cn.pred.raw'){
                  // alert(ret.value.result.details.every(comm.checkAdult));
                  // if(!ret.value.result.details.every(comm.checkAdult)){
                  //   api.toast({
                  //       msg: '好像出了点问题，再试一次吧',
                  //       duration: 2000,
                  //       location: 'bottom'
                  //   });
                  //   // return;
                  // }
                  for(let i=0; i<ret.value.result.details.length; i++){
                    if(ret.value.result.details[i].words!=undefined){
                      for(var j=0;j<ret.value.result.details[i].words.length;j++){
                        result.details.push({
                            overall: ret.value.result.details[i].words[j].overall,
                            pron: ret.value.result.details[i].words[j].pron,
                            phn: ret.value.result.details[i].words[j].phn,
                            tonescore: ret.value.result.details[i].words[j].tonescore,
                            char:ret.value.result.details[i].words[j].char,
                            tone:ret.value.result.details[i].words[j].tone,
                            cnword:ret.value.result.details[i].words[j].chn_char
                        });
                      }
                    }else{
                      result.tipMsg = '朗读的内容不完整，无法打分啊';
                      // for(var m=0;m<ret.value.result.details[i].chn_text.split('').length;m++){
                      //   result.details.push({
                      //       overall: 0,
                      //       // pron: '',
                      //       // phn: ret.value.result.details[i].words[j].phn,
                      //       // tonescore: ret.value.result.details[i].words[j].tonescore,
                      //       // char:ret.value.result.details[i].words[j].char,
                      //       // tone:ret.value.result.details[i].words[j].tone,
                      //       cnword:ret.value.result.details[i].chn_text.split('')[m]
                      //   });
                      // }
                    }
                  }
                }

            }
        }
        return result;
    };
    comm.checkAdult = function(a){
      return a.words!=undefined
    }
    //无调阈值，无调字数超过80认为读的准确
    comm.precisionThreshold = 80;
    //准确度值，单字总分
    //是否朗读阀值，单字总分超过10认为该字有朗读过
    comm.readedThreshold = 10;
    //单位时间（每分钟）的标准朗读字数基准（180字/分）
    comm.completeBase = 200;
    //准确率得分权重
    comm.precisionWeight = 50;
    //完整度得分权重
    comm.completeWeight = 50;
    //计算自定义驰声得分
    comm.calcTotalScore = function (ret, userGrade, dataLength, codeSw) {
      try{
      console.log('内核'+codeSw)
        //驰声原始得分
        var grade = parseInt(userGrade);
        var oldScore = ret.value.result.overall;
        console.log('原始得分'+oldScore);
        var totalscore = 0;
        if (ret && ret.value && ret.value.result) {
            var chivoxRes = ret.value.result;
            //总字数
            // var totalWords = chivoxRes.details.length;
            //不含标点符号与数字的字数
            var totalWords=0;
            // console.log(98);
            // console.log(JSON.stringify(chivoxRes.details))
            if(codeSw==='cn.pred.raw'){
              chivoxRes.details.map((v,i)=>{
                if(v.words){
                  // console.log(v.words.length)
                  totalWords += v.words.length;
                  // return totalWords
                }
              })
            }else if(codeSw==='cn.sent.score'){
              totalWords = chivoxRes.details.length;
            }

            console.log('去除标点总字数'+totalWords);

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
            var fluency1 = ret.value.result.fluency.overall
            console.log('流利度分值'+fluency);

            //计算流利度分值
            var fluencyScore = 0;
            var precisionCount = 0;
            //进行朗读的字数（符合完整度判断的字数）
            var readedCount = 0;
            // console.log('_______'+JSON.stringify(chivoxRes.details));
            // chivoxRes.details
            if(codeSw==='cn.pred.raw'){//中文段落
              for(var i=0; i<chivoxRes.details.length; i++){
                // console.log(chivoxRes.details[i].words)
                if(chivoxRes.details[i].words!=undefined){
                  // alert(1)
                  for(var j=0; j<chivoxRes.details[i].words.length; j++){
                    if(chivoxRes.details[i].words[j].phn >= comm.precisionThreshold){
                      phnWords++;//正确字数
                    }
                    if(chivoxRes.details[i].words[j].overall <80){
                      console.log(chivoxRes.details[i].words[j].chn_char)
                      pronWords++;//错误字数
                    }
                  }
                }
              }
            }else if(codeSw==='cn.sent.score'){//中文句子
              for(var i=0; i<chivoxRes.details.length; i++){
                if(chivoxRes.details[i].phn >= comm.precisionThreshold){
                  phnWords++;//正确字数
                }
                if(chivoxRes.details[i].overall <80){
                  // console.log(chivoxRes.details[i].words[j].chn_char)
                  pronWords++;//错误字数
                }
              }

            }else if(type===3){

            }

            console.log('有调字数'+phnWords)
            console.log('错误字数'+pronWords)
            //错误扣分
            var errorScore = 0;
            //错误字数
            var errorWords = pronWords
            if(grade===1 || grade===2){
              errorScore = errorWords;
            }else if(grade===3){
              errorScore = errorWords * 1.2;
            }else if(grade===4){
              errorScore = errorWords * 1.4;
            }else if(grade===5){
              errorScore = errorWords * 1.6;
            }else if(grade===6){
              errorScore = errorWords * 1.8;
            }
            console.log('错误得分'+errorScore);
            //错误扣分
            var finalc = errorScore>=oldScore*0.3 ? 0.3*errorScore :errorScore;
            console.log('错误扣分'+finalc);
            //正确度得分
            var correctScore = Math.floor(oldScore - finalc);
            console.log('正确度得分：'+correctScore)
            //全文完整度得分
            phnScore = (phnWords / totalWords) * 100;
            console.log('不含标点字数：'+totalWords)
            console.log('完整度得分:'+phnScore+'有调字数：'+phnWords+'字数'+dataLength)
            // 全文有调得分
            pronScore = (pronWords / totalWords) * 100;
            //自定义流利度得分
            fluencyScore = comm.calcFluencyScore(fluency, userGrade);
            console.log('自定义流利度分'+fluencyScore)
            //全文流利度得分（目前算法不完善，依旧取驰声的返回结果）
            var freq = fluencyScore >100 ? 100 : fluencyScore;
            console.log('全文流利度得分'+freq)
            // 总分
            totalscore = phnScore * 0.3 + correctScore * 0.5 + freq * 0.2;
            totalscore = Math.floor(totalscore);
            console.log('总分'+totalscore)
        }
        var objScore = {
            // 总分
            totalscore: totalscore,
            phnScore: Math.floor(phnScore),
            pronScore: Math.floor(correctScore),
            newFluency:Math.floor(fluency1)
        };
        return objScore;
      }
      catch(ex)
      {
        console.error('解析驰声结果异常'+ex);
        var objScore = {
            // 总分
            totalscore: 0,
            phnScore: 0,
            pronScore:0,
            newFluency:0
        };
        return objScore;
      }
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
            score = (fluency / 220) *100
        } else if (userGrade  === 6) {
            score = (fluency / 220) *100
        }
        return score
        // return score > 100 ? 100 : score
    };
    comm.convertTipMsg = function (result) {
        var tipMsg = '';
        if (result && result.error && result.error.errID) {
            switch (result.error.errID) {
                case 0:
                    break;
                case 10000:
                    tipMsg = '没有听见声音啊，麦克风打开了吗？';
                    break;
                case 10001:
                case 10002:
                case 10003:
                    tipMsg = '朗读的内容不完整，无法打分啊';
                    break;
                case 10004:
                    tipMsg = '音量太小了，我听不太清啊';
                    break;
                case 10005:
                    tipMsg = '音量太小了，我听不太清啊';
                    break;
                case 10006:
                    tipMsg = '太吵了，换个安静的环境吧';
                    break;
                default:
                    tipMsg = '评分失败了，再试一次吧';
                    break;
            }
        }
        return tipMsg;
    };
    comm.convertTipMsgg = function (result) {
        var tipMsg = '';
        if (result && result.info && result.info.tipId) {
            switch (result.info.tipId) {
                case 0:
                    break;
                case 10000:
                    tipMsg = '没有听见声音啊，麦克风打开了吗？';
                    break;
                case 10001:
                case 10002:
                case 10003:
                    tipMsg = '朗读的内容不完整，无法打分啊';
                    break;
                case 10004:
                    tipMsg = '音量太小了，我听不太清啊';
                    break;
                case 10005:
                    tipMsg = '音量太小了，我听不太清啊';
                    break;
                case 10006:
                    tipMsg = '太吵了，换个安静的环境吧';
                    break;
                default:
                    tipMsg = '评分失败了，再试一次吧';
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
