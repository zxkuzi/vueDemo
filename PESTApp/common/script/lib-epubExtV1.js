// (function(window) {
    'use strict';
    var epubRead = {}
    epubRead.book=null;
    epubRead.rendition=null;
    epubRead.displayed=null;
    epubRead.singleText = null;
    //服务器端书的相关参数
    epubRead.customchapter={
      spineNames:[],//自定义章节的所有名称列表
      spineStartIndex:0,//自定义当前章节的起始位置
      spineEndIndex:0,//自定义当前章节的结束位置
      spineLastIndex:0,//自定义最后一章的位置
      spineFristIndex:0,//自定义第一章的位置
      boxChapterTocID:''
    };
    //时时产生的书相关参数
   epubRead.newChapter={
     boxChapterTocID:'',
     spineIndex:0,//当前章节的位置
     spineTotalPageNumer:0,//当前章节的总页数
     spinePageNumer:0,//当前章节当前所在的页数
     percentage:0,//当前阅读整书的百分比
     spinePercentage:0,//当前阅读自定义单元的百分比
     pageWorderNumber:0,//当前章节当前页面的字数
     cfi:'',//当前定位的cfi
     contentViewDoc:null//等同于document对象
   };
   epubRead.param={
     bcid:"",//当前单元的ID
     cusTomchapters:[],//自定义书目的json数据
     bookSetParam:{
       bookUri:"",//打开当前书目的URL
       dispayCfi:"1",//定位到书的某个cfi位置
       dispayDiv:"area",//呈现的容器
       smethod:"default",
       sheight:500,
       swidth:200,
       stylesheet:"",//"../../../ipad/css/reader_pad.css"//本地目录样式为什么不行？路径解析变了找不到文件？,// [cssHref],
       flow:"auto"//ginated 分屏显示左边一段右边一段(一屏两页)//scrolled-doc一屏展示//auto
     },
     contentViewjs:""//给书本内容（IFrame）注入的JS htt形式 例如：https://code.jquery.com/jquery-2.1.4.min.js

   };
   epubRead.touchendPageX=0;
   epubRead.touchendPageY=0;
    epubRead.gesturesDirection='';
    epubRead.startX=0;
    epubRead.startY=0;
    epubRead.moveEndX=0;
    epubRead.moveEndY=0;
    //是否允许翻页
  epubRead.isNextEpubPage=true;
  //是否允许强制向左翻页，已经是自定义单元最后一章最后一页后是否允许继续翻页
  epubRead.isLastCurrCallLeft=false;

    //======================================初始化图书===========================================//
    epubRead.readBook = function(parms, callback) {
      // alert(epubRead.param.bookSetParam.dispayCfi+'shui')
      // console.log('打印传入对象'+JSON.stringify(parms))
      if(!parms){console.error("传入图书参数不能为空");return false;}
       if(!parms.bookSetParam.bookUri){console.error("传入图书路径不能为空");return false;}
         epubRead.param=parms;//设置图书参数方便候卖使用

         //console.log("--------------"+JSON.stringify( epubRead.param))
         //加载图书路径
         epubRead.book = ePub(epubRead.param.bookSetParam.bookUri);
         //设置图书容器
         epubRead.rendition=epubRead.book.renderTo(epubRead.param.bookSetParam.dispayDiv,{
           method:epubRead.param.bookSetParam.smethod,//continuous
           width:epubRead.param.bookSetParam.swidth,//uiInfo.content_w - 160,
           height:epubRead.param.bookSetParam.sheight, //uiInfo.content_h - 190,
 					stylesheet:epubRead.param.bookSetParam.stylesheet,//"../../../ipad/css/reader_pad.css"//本地目录样式为什么不行？路径解析变了找不到文件？,// [cssHref],
 					flow: epubRead.param.bookSetParam.flow//Pa-100,ginated 分屏显示左边一段右边一段(一屏两页)//scrolled-doc一屏展示//auto
           //spread: "always"
         });
        //  console.log('1='+epubRead.param.bookSetParam.dispayDiv+
        //  ' 2='+epubRead.param.bookSetParam.smethod+
        //        ' 3='+epubRead.param.bookSetParam.swidth+
        //      ' 4='+epubRead.param.bookSetParam.sheight+
        //    ' 5='+epubRead.param.bookSetParam.stylesheet+
        //  ' 6='+epubRead.param.bookSetParam.flow)
         //显示图书
         if(epubRead.param.bookSetParam.dispayCfi){
 					  epubRead.displayed=epubRead.rendition.display(epubRead.param.bookSetParam.dispayCfi);
             //console.log('7='+epubRead.param.bookSetParam.dispayCfi)
 				}
        else {
          console.error('没有设置图书定位，至少设置0或1吧');return false;
        }
        //解析自定义章节
        epubRead.getCusTomchapters();
        //console.log('___自定义章节完成')
      //   //初始化自定义相关事件
        epubRead.initEpubExt(callback);
        //console.log('自定义相关事件完成');
  };
  //======================================是否允许翻页=============================================//
  epubRead.isEpubNextPage=function(isNext){
    epubRead.isNextEpubPage=isNext;
  };
  //======================================是否强制允许向左翻页，场景：已经是自定义单元最后一章最后一页后了（默认不允许翻页）调用此方法允许继续翻页=============================================//
  epubRead.isLastCurrCallLeftPage=function(isPage){
    epubRead.isLastCurrCallLeft=isPage;
  };
  //======================================跳转到指定章节=============================================//
  epubRead.goCfi=function(cfi,callback) {
      // var cfi = 'epubcfi('+cfi+'!/4/1:0)';
      // alert(epubRead.newChapter.contentViewDoc)
      try {
          if (epubRead.rendition) {
            //console.log('执行到这一步了'+cfi)
              epubRead.displayed = epubRead.rendition.display(cfi);
              // return epubRead.newChapter.contentViewDoc
              callback('gocfi',epubRead.newChapter);
              // alert(epubRead.newChapter.contentViewDoc)
              //console.log(epubRead.displayed)
          } else {
              console.error('请先加载图书');
          }
      } catch (e) {
          console.error('跳转图书时异常：' + e);
      } finally {

      }

  }
  //======================================解析自定义章节对象===========================================//
   epubRead.getCusTomchapters = function() {
     //console.log('01开始解析章节');
         if (!epubRead.param.cusTomchapters) {console.error("严重错误自定义章节为空");return false;}
         try {
           //解析完成做缓存，只是第一次打开时解析 应该缓存没意义内存中小遍历理论上比存如内存 占用设备内存小
             var pageListData = JSON.parse($storage.getStorage("pagelist_1"+epubRead.param.bcid));
             if(pageListData){
              //  console.log('-------------012缓存中有此章节读取缓存----------')
              //  console.log(JSON.stringify(pageListData))
                 epubRead.customchapter = pageListData;
             }
             else{
                // console.log('-------------012缓存中没有此章节时时计算----------')
                epubRead.customchapter.spineLastIndex=epubRead.param.cusTomchapters[epubRead.param.cusTomchapters.length-1].spinePosTo;//最后一章的索引
                epubRead.customchapter.spineFristIndex=epubRead.param.cusTomchapters[0].spinePosFrom;//起始章的索引
             epubRead.param.cusTomchapters.forEach(function(item, index) {

                         if (item.chapterID == epubRead.param.bcid) {
                          //  console.log('isHere')
                             epubRead.customchapter.spineStartIndex = item.spinePosFrom;
                             epubRead.customchapter.spineEndIndex = item.spinePosTo;
                             epubRead.customchapter.spineNames=item.spineIds;
                            //  epubRead.customchapter.boxChapterTocID=item.boxChapterTocID;
                             $storage.setStorage("pagelist_"+epubRead.param.bcid, epubRead.customchapter);
                        //      console.log('item.spinePosFrom='+item.spinePosFrom
                        //    +'item.spinePosTo='+item.spinePosTo
                        //  +'item.spineids='+item.spineIds)
                             return;
                         }
                        //  console.log('hereIs')
                     });
                 }
         } catch (e) {
           console.error('解析接口返回章节时严重异常：'+e);
         } finally {

         }

     };
   //======================================初始化图书的cif===========================================//
   epubRead.initEpubExt=function(callback){
    //  console.log(callback)
    //  console.log('02初始化书的CFI----解析开始')s
     //console.log(epubRead.book)
     if(!epubRead.book||!epubRead.rendition){console.error("严重错误图书没加载出来");  return false;}
     epubRead.book.ready.then(function(){
              // 默认为150个字符进行分出cif的个数
              // console.log('默认为150个字符进行分出cif的个数')
              return epubRead.book.locations.generate(500);
      }).then(function(locations){
        //console.log('021成功为图书分割Cfi，初始化事件开始')
        // //Rendition.location.start.displayed|Rendition.currentLocation().start.displayed|Rendition.reportLocation() 获取当前章节的页数
        //======================================初始化数据==========================
        let currentSpine=epubRead.rendition.currentLocation().start;
        let currentSpineEnd=epubRead.rendition.currentLocation().end;
        // console.log(JSON.stringify(epubRead.newChapter));
        epubRead.newChapter.spineIndex=currentSpine.index;//当前章节的位置
        //console.log(epubRead.newChapter.spineIndex)
        //console.log('____'+JSON.stringify(epubRead.param.chapterTocList)+'_____');
        epubRead.param.chapterTocList.forEach(function(v,i){
          // console.log(v.boxChapterTocID+'哈哈')
          if(parseInt(v.spinePoses)==parseInt(epubRead.newChapter.spineIndex)){
            epubRead.newChapter.boxChapterTocID = v.boxChapterTocID
            // console.log(v.boxChapterTocID)
          }
        })
        //console.log('原生章节id'+epubRead.newChapter.boxChapterTocID)
        epubRead.newChapter.spineTotalPageNumer=currentSpine.displayed.total;//当前章节的总页数
        epubRead.newChapter.spinePageNumer=currentSpine.displayed.page;//当前章节当前所在的页数
        epubRead.newChapter.percentage=currentSpine.percentage;//当前阅读整书的百分比
        //console.log('当前阅读整书的百分比'+currentSpine.percentage)
        //计算自定义阅读单元的百分比
        epubRead.getSpinePercentage(currentSpine.href);
        //计算文字
        // console.log('计算文章'+currentSpine.cfi+'______'+currentSpineEnd.cfi)
        epubRead.getPageCfiWordNum(currentSpine.cfi.toString(),currentSpineEnd.cfi.toString());
        //  console.log('2222222222222222222222222222222222222222222222222222222222222222');
        // console.log(JSON.stringify(epubRead.newChapter));
        epubRead.bookEvent(locations,callback);
      });

      try {
              //console.log('怎么回事')
              //注入单个JS并返回ifarame的doc对象
              epubRead.rendition.hooks.content.register(function(contents){
                //console.log('什么鬼')
                var doc=contents.document;

                btnArray = doc.getElementsByTagName('p');

                var arr = [];
                for(var i=0; i<btnArray.length; i++){
                  // alert(btnArray[i].innerHTML)
                  if(btnArray[i].children.length<=5 && btnArray[i].innerText!='' && btnArray[i].innerHTML!='<br>'){
                    var isChoose = 'isChoose'+i;
                    // btnArray[i].innerHTML='<input type="checkbox" name="" id="'+isChoose+'" style="display:none;"/><label class="wrap" for="'+isChoose+'" style="-webkit-tap-highlight-color : rgba (255, 255, 255, 0);-webkit-tap-highlight-color:transparent;width:20px;height:20px;display:inline-block;visibility:hidden;vertical-align:middle;visibility:visible;background-repeat:no-repeat;background-size:15px;"></label><span>'+btnArray[i].innerHTML+'</span>';
                    // btnArray[i].innerHTML='<input type="checkbox" name="" id="'+isChoose+'" style="display:none;"/><label class="wrap" for="'+isChoose+'" style="-webkit-tap-highlight-color : rgba (255, 255, 255, 0);-webkit-tap-highlight-color:transparent;width:20px;height:20px;display:inline-block;visibility:hidden;vertical-align:middle;visibility:visible;background-repeat:no-repeat;background-size:20px;"></label>'+btnArray[i].innerHTML;
                    btnArray[i].innerHTML='<input type="checkbox" name="" style="display:none;"/><label class="wrap" for="'+isChoose+'" style="-webkit-tap-highlight-color : rgba (255, 255, 255, 0);-webkit-tap-highlight-color:transparent;width:20px;height:20px;display:inline-block;visibility:hidden;vertical-align:middle;visibility:visible;background-repeat:no-repeat;background-size:20px;"></label>'+btnArray[i].innerHTML;
                    //JS注入不能直接用覆盖innerHtml的方式（会破坏掉本插件拆分cfi的规范并且影响到所有操作cfi的方法例如epubRead.book.getRange）,
                    //应该使用节点操作方法是插件的钩子函数能正常执行下去
                    //btnArray[i].innerHTML='<input type="checkbox" name="" id="'+isChoose+'" style="display:none;"/><label class="wrap" for="'+isChoose+'" style="-webkit-tap-highlight-color : rgba (255, 255, 255, 0);-webkit-tap-highlight-color:transparent;width:20px;height:20px;display:inline-block;visibility:hidden;vertical-align:middle;visibility:visible;background-repeat:no-repeat;background-size:15px;"></label><span>'+btnArray[i].innerHTML+'</span>';
                    // var input=doc.createElement('input');
                    // input.type="checkbox";
                    // input.id=isChoose;
                    //doc.insertBefore(btnArray[i],input);
//                     btnArray[i].appendChild(input);
// >>>>>>> .r74
                  }
                }
                // alert(btnArray[2].innerHTML)
                epubRead.newChapter.contentViewDoc=doc;
                //console.log(epubRead.newChapter.contentViewDoc+'文本')
                callback('loadContentView',doc);
                if(epubRead.param.contentViewjs)
                {
                  return contents.addScript("https://code.jquery.com/jquery-2.1.4.min.js")
                 .then(function(){
                   //JS注入成功!
                 });
               }
            });
          }catch (e) {
       console.error('注入单个JS并返回ifarame的doc对象时严重异常:'+e);
     }
    //console.log('判断是否成功')
   };
   //======================================初始化图书的相关事件===========================================//
   epubRead.bookEvent = function(locations, callback) {
     //console.log('03初始化相关事件----------');
     //在渲染新章节之后触发
     epubRead.rendition.on("rendered", function(section) {
         //range = section.document.createRange();
         epubRead.newChapter.spineIndex = section.index; //记录当前所在章节的位置
         epubRead.param.chapterTocList.forEach(function(v,i){
           // console.log(v.boxChapterTocID+'哈哈')
           if(parseInt(v.spinePoses)==parseInt(epubRead.newChapter.spineIndex)){
             epubRead.newChapter.boxChapterTocID = v.boxChapterTocID
             // console.log(v.boxChapterTocID)
           }
         })
         //console.log('原生章节id'+epubRead.newChapter.boxChapterTocID)
         //console.log("031下一章"+epubRead.newChapter.spineIndex);
        //  epubRead.allPrpos(section);
         // var nextSection = section.next();
         // var prevSection = section.prev();
     });
    //  console.log('0312初始化rendered事件完成')
     //根据cfi监控页面文字编号 这里的文字是每页的起始段落到末尾断了
     epubRead.rendition.on("relocated", function(location) {
         //记录阅读足迹
         epubRead.newChapter.spinePageNumer=location.start.displayed.page;
         epubRead.newChapter.spineTotalPageNumer=location.end.displayed.total;
         epubRead.newChapter.percentage=location.end.displayed.percentage;
         epubRead.newChapter.spineIndex = location.start.index; //记录当前所在章节的位置
         epubRead.newChapter.cfi=location.start.cfi;
         epubRead.param.chapterTocList.forEach(function(v,i){
           // console.log(v.boxChapterTocID+'哈哈')
           if(parseInt(v.spinePoses)==parseInt(epubRead.newChapter.spineIndex)){
             epubRead.newChapter.boxChapterTocID = v.boxChapterTocID
             // console.log(v.boxChapterTocID)
           }
         })
         //console.log('原生章节id'+epubRead.newChapter.boxChapterTocID)
        //  epubRead.newChapter.cfi=location.start.cfi.substring(1);
         //计算自定义阅读单元的百分比
         epubRead.getSpinePercentage(location.start.href);
         //计算文字
         epubRead.getPageCfiWordNum(location.start.cfi.toString(),location.end.cfi.toString());

        //  console.log('最后一章：'+epubRead.customchapter.spineLastIndex)
      //    console.log('032翻页 当前页数=' + epubRead.newChapter.spinePageNumer
      //    + ';当前章总页数=' + epubRead.newChapter.spineTotalPageNumer
      //  +"; index="+location.start.index);
       //================================================================翻页完成回调事件=========================
       switch (epubRead.gesturesDirection) {
         case 'right':
               callback('rightScreen',epubRead.newChapter);
           break;
           case 'left':
            // console.log('uuuu')
             callback('leftScreen',epubRead.newChapter);
           break;
       }
         // var page = Book.locations.locationFromCfi(location.end.cfi);
         // console.log(page)
         //epubRead.allPrpos(Book.spine.spineItems[3] )所有书脊个数
         // epubRead.allPrpos(location.start.displayed);
         // // console.log('-----------------------------------------------------')
         // epubRead.allPrpos(location.end.displayed); //这里面终于有当前章节的分页总数和当前页数了
     });
    //  epubRead.rendition.on("locationChanged", function(location){
    //     console.log('位置改变--'+location);
    //     epubRead.allPrpos(location);
    // });
     //选择事件
      epubRead.rendition.on("selected", (cfiRange, contents) => {
        // console.log('选择时间')
                   epubRead.book.getRange(cfiRange).then((range) => {
                      if (range) {
                        callback('selectWordText',range.toString());
                        }
                      });
                    });
        // console.log('0313初始化relocated事件完成')
     //手指离开事件
                   epubRead.rendition.on("touchend", event=> {
                   //  console.log('滑动')
                     epubRead.bookOnTouchend(event,callback);
                   });
                   //手指触摸屏幕
                   epubRead.rendition.on("touchstart", function(event) {
                      //  console.log('点击开始')
                     epubRead.bookOnTouchStart(event);
                   });
                   //手指滑动屏幕
                   epubRead.rendition.on("touchmove", function(event) {
                       // console.log('点击离开')
                     epubRead.bookOnTouchMove(event);
                   });
                   callback("disPlayBook",epubRead.newChapter);
 };

 //======================================手指离开事件===========================================//
 epubRead.bookOnTouchend=function(e,callback){
   try {
     epubRead.touchendPageX=e.changedTouches[0].pageX;
       epubRead.touchendPageY=e.changedTouches[0].pageY;
       var iscall=false;
      //   console.log("touchendPageX="+epubRead.touchendPageX+";touchendPageY="+epubRead.touchendPageY
      // +" epubRead.gesturesDirection="+epubRead.gesturesDirection)
     switch (epubRead.gesturesDirection) {
       case 'right':
       //如果是本书的第一章第一页
           if(epubRead.customchapter.spineFristIndex==epubRead.newChapter.spineIndex
           &&epubRead.newChapter.spinePageNumer==1)
           {
             callback("bookFristPage",epubRead.newChapter);
             iscall=true;
           }
           //如果是自定义单元的第一章第一页
           if(epubRead.customchapter.spineStartIndex==epubRead.newChapter.spineIndex
           &&epubRead.newChapter.spinePageNumer==1)
           {
             callback("fristPage",epubRead.newChapter);
             iscall=true;
           }
           //console.log("右"+epubRead.isNextEpubPage)
           if(!iscall && epubRead.isNextEpubPage) {
             epubRead.rendition.prev();
           }
         break;
         case 'left':
         //如果是最后一章的最后一页，回调一次数据
         if(epubRead.customchapter.spineLastIndex==epubRead.newChapter.spineIndex
         &&epubRead.newChapter.spinePageNumer==epubRead.newChapter.spineTotalPageNumer)
         {
          //  console.log('1111')
          epubRead.newChapter.percentage=1;//设置本书阅读进度为100%
           callback("bookLastPage",epubRead.newChapter);
           iscall=true;
         }
         //如果是自定义章节的最后一章最后一页
         if(epubRead.customchapter.spineEndIndex==epubRead.newChapter.spineIndex
          &&epubRead.newChapter.spinePageNumer==epubRead.newChapter.spineTotalPageNumer)
          {
            // console.log('22222')
            epubRead.newChapter.spinePercentage=1;//设置自定义单元进度为100%
            callback("lastPage",epubRead.newChapter);
            iscall=true;
          }
          //console.log("左"+epubRead.isNextEpubPage)
         if(
           (!iscall && epubRead.isNextEpubPage)
       ||epubRead.isLastCurrCallLeft) {
           epubRead.rendition.next();
          //  var time = new Date().getTime();
          //  arr.push(time);
          //  if(arr.length>=2){
          //    if(arr[arr.length-1]-arr[arr.length-2]<5000){
          //      api.toast({
          //          msg: '翻书太快将不记录阅读量哦~',
          //          duration: 2000,
          //          location: 'bottom'
          //      });
          //      arr = [];
          //    }
          //  }
          //  callback('leftScreen');
         }
         break;
         case 'noMove':
         callback('noMoveScreen',epubRead.newChapter);
         break;
     }
   } catch (e) {
     console.error('手指离开时严重异常：'+e);
   } finally {

   }
 };
 //======================================手指触摸屏幕===========================================//
 epubRead.bookOnTouchStart=function(e,callback){
   try {
     // console.log("触摸屏幕");
      //e.stopPropagation();
      epubRead.gesturesDirection = 'noMove';
      //e.preventDefault();
      epubRead.startX = e.touches[0].pageX;
      epubRead.startY = e.touches[0].pageY;
      epubRead.touchendPageX=epubRead.startX;
      epubRead.touchendPageY=epubRead.startY;
      // console.log("touchendPageX="+touchendPageX+";touchendPageY="+touchendPageY)
   } catch (e) {
     console.error('手指触摸屏幕严重异常：'+e);
   } finally {

   }
 };
 //======================================手指滑动屏幕===========================================//
 epubRead.bookOnTouchMove=function(e,callback){
   try {
     // console.log("滑动屏幕");
    epubRead.moveEndX = e.changedTouches[0].pageX;
    epubRead.moveEndY = e.changedTouches[0].pageY;
    epubRead.touchendPageX=epubRead.moveEndX;
    epubRead.touchendPageY=epubRead.oveEndY;
    // console.log("touchendPageX="+touchendPageX+";touchendPageY="+touchendPageY)
    var cX = epubRead.moveEndX - epubRead.startX;
    var cY = epubRead.moveEndY - epubRead.startY;
    if ( Math.abs(cX) > Math.abs(cY) && cX > 0 ) {
              epubRead.gesturesDirection = 'right';
    } else if ( Math.abs(cX) > Math.abs(cY) && cX < 0 ) {
              epubRead.gesturesDirection = 'left';
    } else if ( Math.abs(cY) > Math.abs(cX) && cY > 0) {
    } else if ( Math.abs(cY) > Math.abs(cX) && cY < 0 ) {
          } else{
              epubRead.gesturesDirection = 'noMove';
    }
   } catch (e) {
     console.error('手指滑动图书时严重异常：'+e);
   } finally {

   }

 };
  //======================================计算自定义单元的阅读百分比=====================================
  epubRead.getSpinePercentage=function(href){
    //console.log('自定义阅读百分比了')
    //console.log('epubRead.getSpinePercentage')
    //href = chapter003.html
    if(!href){return false;}
    if(!epubRead.customchapter.spineNames){return false;}
    try {
      var arr=href.split(".");
      //console.log('arr'+arr)
      if(arr.length>1)
      {
        var currIndex=1;
        var currSpineCount=epubRead.customchapter.spineNames.length;
        //console.log('长度'+currSpineCount)
        var avgPercentage=1/currSpineCount;

        //计算是自定义章节列表中的第几个
        // console.log(JSON.stringify(epubRead.customchapter.spineNames)+'jjjkkk')
          epubRead.customchapter.spineNames.forEach(function(item,index){
            if(item==arr[0])
            {
              currIndex=index+1;
            }
          });
          let spineAvgPercentage=(avgPercentage/epubRead.newChapter.spineTotalPageNumer)*epubRead.newChapter.spinePageNumer;
          // console.log('spineAvgPercentage:'+spineAvgPercentage+'=(avgPercentage:'+avgPercentage
          // +'/epubRead.newChapter.spineTotalPageNumer:'+epubRead.newChapter.spineTotalPageNumer+
          // ')*epubRead.newChapter.spinePageNumer:'+epubRead.newChapter.spinePageNumer);
          //之前阅读过的百分比+当前进度百分比
          //console.log(avgPercentage+'666666')
          //console.log(spineAvgPercentage+'666666')
          //console.log(currIndex+'666666')
        epubRead.newChapter.spinePercentage=(avgPercentage*(currIndex-1))+spineAvgPercentage;
        // console.log('epubRead.newChapter.spinePercentage:'+epubRead.newChapter.spinePercentage
        // +'=(avgPercentage:'+avgPercentage+'*(currIndex:'+currIndex+'-1))+spineAvgPercentage:'+spineAvgPercentage);
      }

    } catch (e) {
      console.error('严重错误未解析到当前自定义单元的百分比具体请调试：'+e);
    } finally {

    }

  }
  //======================================获取当前页面的文字=====================================
  epubRead.getPageCfiWordNum=function(startcfi,endcfi){
    //console.log('获取文字')
    if(!startcfi||!endcfi){return false;}
    try {
      //console.log(startcfi+"  "+endcfi)
      var arrstar=startcfi.split('!');
      var arrend=endcfi.split('!');
      if(arrstar.length>1&&arrend.length>1)
      {
        var cfi=arrstar[0]+"!,"+arrstar[1].replace(')','')+","+arrend[1];

        //console.log('解析文字合并CFI范围='+cfi);
        epubRead.book.getRange(cfi).then((range) => {
           if (range) {
             epubRead.singleText = '';
             var node=range.cloneContents();
            //  var node = range.selectNodeContents('p')
             var div = document.createElement('div');
             div.appendChild(node);
                // console.log('-----------------计算到文字range.cloneContents().innerHTML='+ div.innerHTML);
            //  console.log(range.cloneContents()+'------=====-------')

             epubRead.singleText += div.innerHTML.replace(/h1/g,'p').replace(/h3/g,'p').replace(/h4/g,'p');
             console.log('得到的文本'+epubRead.singleText.replace(/h1/g,'p'))
             //console.log('计算到文字：'+range);
             epubRead.newChapter.pageWorderNumber=epubRead.getWordNumber(range.toString());
             //console.log('文字个数='+epubRead.newChapter.pageWorderNumber);
             }
           });
      }
      else{console.error('无法解析的cfi导致无法获取当前文字'+startcfi+" "+endcfi)}
    } catch (e) {
        console.error('无法解析的cfi导致无法获取当前文字'+e);
    } finally {

    }
  }
 //======================================字符串的汉字个数=====================================
 epubRead.getWordNumber=function(wordText){
   try {
   var re = /[\u4E00-\u9FA5]/g; //测试中文字符的正则
  if (re.test(wordText)) //使用正则判断是否存在中文
  {
    return wordText.match(re).length
  }
   } catch (e) {
     console.error("计算文字正则不匹配："+e);
   } finally {

   }

}
//=======================================获取本页的内容
 //======================================自动列出对象相关属性定义===========================================//
 epubRead.allPrpos = function(obj) {
     // 用来保存所有的属性名称和值
     var props = "";
     // 开始遍历
     for (var p in obj) {
         // 方法
         if (typeof(obj[p]) == " function ") {
             obj[p]();
         } else {
             // p 为属性名称，obj[p]为对应属性的值
             //console.log(p + " = " + obj[p]);
         }
     }
 };
    window.$epubExt = epubRead;
// })(window);
