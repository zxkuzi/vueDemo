
(function () {
  var matchText={};
  //去除"了"驰声能判读对
  matchText.wordData="阿,腌,挨,拗,熬,扒,把,蚌,薄,堡,暴,背,奔,臂,辟,扁,便,膀,磅,绷,骠,瘪,屏,剥,泊,伯,簸,膊,卜,伧,藏,曾,噌,差,禅,颤,孱,裳,场,嘲,车,称,澄,铛,乘,匙,冲,臭,处,畜,创,绰,伺,兹,跐,枞,攒,撮,处,揣,椎,答,大,沓,逮,单,当,倒,叨,提,得,的,钿,钉,都,掇,度,囤,垛,发,坊,分,缝,服,菲,否,脯,轧,杆,扛,膏,咯,搁,葛,革,合,给,更,颈,供,红,枸,估,呱,骨,谷,鹄,括,莞,纶,冠,桧,过,虾,哈,咳,汗,巷,吭,号,和,貉,喝,横,虹,哄,划,晃,会,混,豁,豁,奇,缉,几,济,纪,偈,系,稽,亟,诘,茄,夹,假,间,将,嚼,侥,角,脚,剿,教,校,解,结,芥,藉,节,禁,尽,矜,仅,劲,龟,咀,矩,据,菌,卡,看,坷,壳,可,克,空,溃,蓝,烙,勒,肋,擂,累,蠡,俩,量,踉,潦,燎,淋,馏,镏,碌,遛,溜,笼,偻,搂,露,捋,绿,络,落,抹,脉,埋,蔓,氓,闷,没,蒙,眯,靡,秘,泌,模,摩,缪,难,泥,宁,弄,疟,娜,排,迫,胖,刨,炮,跑,喷,劈,便,片,缥,撇,仆,朴,瀑,曝,栖,蹊,稽,荨,欠,抢,强,呛,戗,悄,翘,切,趄,亲,曲,雀,圈,阙,任,散,丧,色,塞,煞,厦,杉,苫,汤,折,舍,拾,什,葚,识,似,属,熟,刷,说,数,忪,宿,遂,踏,沓,趟,苔,调,帖,通,吐,褪,拓,瓦,圩,委,尾,尉,遗,纹,乌,吓,鲜,纤,相,行,省,削,血,熏,兴,旋,哑,殷,咽,约,钥,掖,耶,叶,艾,迤,应,佣,熨,与,吁,予,晕,咋,载,脏,择,扎,轧,炸,粘,涨,占,爪,着,蜇,症,正,殖,只,中,种,轴,著,拽,转,幢,缴,综,仔,钻,柞,作";
  //======================================是否多音字===========================================//
 matchText.isPolyWord=function(word)
 {
     if(word)
     {
       //筛选对象
      //  var wdata = matchText.wordData.filter(function (e) { return e.wordText == word; });
       if(matchText.wordData.indexOf(word)>=0)
       {
         return true;
       }
       else {
         return false;
       }
     }
     else {
       return false;
     }
 };
    matchText.textWordPinYinStyle= function (str, arrIndex) {
        //console.log(str)
        //console.log('数组'+JSON.stringify(arrIndex))
        var subReg22 = /\n/g;
        var subReg23 = /\r/g;
        var subReg24 = /\t/g;
        str = str.join('|').replace(subReg22, '').replace(subReg23, '').replace(subReg24, '');
        //console.log('转化之后的数组'+str);
        var reg = /^[\u4e00-\u9fa5]+$/;
        var result = '';
        var dotObj = {};
        var wordObj = {};
        var dotArr = [];
        var wordArr = [];
        var arrTemp = str.split('');
        arrTemp.forEach(function (item, index) {
            if (!reg.test(item)) {
                dotObj = {
                    dotIndex: index,
                    dot: item
                };
                dotArr.push(dotObj)
            } else {
                wordObj = {
                    wordIndex: index,
                    word: item
                };
                wordArr.push(wordObj)
            }
        });
        arrIndex.forEach(function (item, index) {
            if (!wordArr[index]) {
                return;
            }
            //判断是否多音字
            var isDuoYinWord=matchText.isPolyWord(wordArr[index].word);
            if (item.type === 3&&!isDuoYinWord) {
              console.log(wordArr[index].word+"--红色===="+isDuoYinWord);
                wordArr[index].word = '<span><ruby style="color:red;">' + wordArr[index].word +'<rt style="color:red;">'+item.char+'</rt></ruby></span>';
            } else if (item.type === 1&&!isDuoYinWord) {
                wordArr[index].word = '<span style="color:#00B596">' + wordArr[index].word + '</span>';
            } else {
                wordArr[index].word = '<span style="color:rgba(51,51,51,1)">' + wordArr[index].word + '</span>';
            }
        });
        var textWordArr = [];
        dotArr.forEach(function (item) {
            textWordArr[item.dotIndex] = item.dot
        });
        wordArr.forEach(function (item) {
            textWordArr[item.wordIndex] = item.word
        });
        var arrText = textWordArr.join('').split('|')
        // console.log('arrText'+arrText)
        // console.log('arrText'+arrText.length);
        var strText = '';
        arrText.forEach(function(item,index){
          strText+='<p>'+item+'</p>'
        })
        // var strText = textWordArr.join('');
        // console.log(strText)
        return strText;
    };

    // comm.pinyin = function(char,tone,icon){
    //   // 动态创建一个span,将拼音的每个字母放在span里
    //
    // }

    window.$matchText = matchText;
})();
