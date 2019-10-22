(function(window) {
    'use strict';
    //EPUB.JS辅助功能

    var comm = {};
    comm.bookInfo = {
        pageList: [],
        totalPage: 0,
        currCfi: '',
        currPage: 0,
        currPercentage: 0,
        currPageRange: '',
        currPercentageInChapter: 0,
        currLangChapter: null,
        spinePages: [],
        langChapterPages: []
    };
    comm.langChapters = [];
    //---------------------------------------------------------------------
    //初始化EPUB扩展JS
    comm.initEpubExt = function(bid, Book, langChapters, callback,callbackReadWord
    ,bookOnTouchend,bookOnTouchStart,bookOnTouchMove) {
        var pageListData = JSON.parse($storage.getStorage("pagelist_"+bid));
        comm.langChapters = langChapters;

        Book.ready.all.then(function() {
            Book.generatePagination();
        });
        if(!pageListData){
            Book.pageListReady.then(function(pageList) {
                pageListData = {
                    func: 'pagelist',
                    success: true,
                    pageList: pageList
                };
                $storage.setStorage("pagelist_"+bid, pageListData);
                callback(pageListData);
                comm.initPagesToBook(pageListData.pageList, langChapters);
            });
        } else {
            callback(pageListData);
            comm.initPagesToBook(pageListData.pageList, langChapters);
        }
        Book.on('book:pageChanged', function(location) {
            comm.pageChanged(location, callback);
        });
        //locationChanged 发生然后visibleRangeChanged事件发生  然后pageChanged事件发生
        Book.on('renderer:locationChanged', function(locationCfi) {
            comm.locationChanged(locationCfi);
        });
        //根据cfi监控页面文字编号 这里的文字是每页的起始段落到末尾断了
        Book.on("renderer:visibleRangeChanged", function(cfirange) {
          try{
              var text = '';
              var cfi = new EPUBJS.EpubCFI();
              var startRange = cfi.generateRangeFromCfi(cfirange.start, Book.renderer.render.document);
              var endRange = cfi.generateRangeFromCfi(cfirange.end, Book.renderer.render.document);

              // Create a new range to handle full cfi range (this should be fixed in v0.3)
              var fullRange = document.createRange();

              if (startRange) {
                fullRange.setStart(startRange.startContainer, startRange.startOffset);
              }

              if (endRange) {
                fullRange.setEnd(endRange.startContainer, endRange.endOffset);
              }

              text = fullRange.toString();
              var data={
                word:text,
                cfi:comm.bookInfo.currCfi
              }
              callbackReadWord(data);//回调获取到的文字
            }
            catch(ex)
            {}
            });
          //手指离开事件
            Book.on("renderer:touchend", function(event) {
              bookOnTouchend(event);
            });
            //手指触摸屏幕
            Book.on("renderer:touchstart", function(event) {
              bookOnTouchStart(event);
            });
            //手指滑动屏幕
            Book.on("renderer:touchmove", function(event) {
              bookOnTouchMove(event);
            });
    };
    //按章节分解Page
    comm.initPagesToBook = function(pageList, langChapters) {
        comm.bookInfo.pageList = pageList;
        comm.bookInfo.totalPage = Book.pagination.totalPages;
        comm.splitPagesToSpine(pageList);
        comm.splitPagesToLangChapter(langChapters);
        // Here you can save the result
    };
    //从cfi中解析出书脊信息
    comm.resolveSpineIdFromCfi = function(cfi) {
        cfi = cfi.substring(cfi.indexOf('[') + 1);
        var spineId = cfi.substring(0, cfi.indexOf(']'));
        return spineId;
    };
    //按原书章节分解Page
    comm.splitPagesToSpine = function(pageList) {
        for (var i = 0; i < pageList.length; i++) {
            //"epubcfi(/6/10[id10]!/4/2[a004]/1:0)",中括号中的就是书脊ID
            //epub.js在解析目录时，起始CFI为"/6/10[idXXX]",并在管理后台处理时记为阅读单元起始CFI
            var spineId = comm.resolveSpineIdFromCfi(pageList[i].cfi);
            var spineItem = null;
            for (var j = 0; j < comm.bookInfo.spinePages.length; j++) {
                if (comm.bookInfo.spinePages[j].spineId === spineId) {
                    spineItem = comm.bookInfo.spinePages[j];
                    break;
                }
            }
            if (spineItem === null) {
                spineItem = {
                    spineId: spineId,
                    pages: [pageList[i].page]
                };
                comm.bookInfo.spinePages.push(spineItem);
            } else {
                spineItem.pages.push(pageList[i].page);
            }
        }
    };
    //按Lang阅读单元分解Page
    comm.splitPagesToLangChapter = function(langChapters) {
        for (var i = 0; i < langChapters.length; i++) {
            var langChapterId = langChapters[i].bcid;
            var chapterSpineIds = comm.getLangChapterSpineIds(langChapterId);
            var fromTag = false;
            var toTag = false;

            var langChapterPages = [];
            for (var j = 0; j < chapterSpineIds.length; j++) {
                for (var k = 0; k < comm.bookInfo.spinePages.length; k++) {
                    if (chapterSpineIds[j] === comm.bookInfo.spinePages[k].spineId) {
                        for (var q = 0; q < comm.bookInfo.spinePages[k].pages.length; q++) {
                            langChapterPages.push(comm.bookInfo.spinePages[k].pages[q]);
                        }
                        break;
                    }
                }
            }
            var chapterItem = {
                bcid: langChapterId,
                pages: langChapterPages
            };
            comm.bookInfo.langChapterPages.push(chapterItem);
        }
    };
    //翻页时记录当前页的页码，百分比等信息
    comm.pageChanged = function(location, callback) {
        comm.bookInfo.currPercentage = location.percentage * 100;
        comm.bookInfo.currPage = location.anchorPage;
        comm.bookInfo.currPageRange = location.pageRange;

        comm.calcCurrPercentageInChapter(location.anchorPage);
        var ret = {
            func: 'pagechange',
            success: true,
            cfi: comm.bookInfo.currCfi,
            bookPercentage: comm.bookInfo.currPercentage,
            chapterPercentage: comm.bookInfo.currPercentageInChapter
        };

        callback(ret);
    };
    //按页码计算当前页在LANG阅读单元中的百分比
    comm.calcCurrPercentageInChapter = function(anchorPage) {
        var currLangChapter = comm.getCurrLangChapter(anchorPage);
        var langChapterPages = [];
        if (currLangChapter) {
            for (var i = 0; i < comm.bookInfo.langChapterPages.length; i++) {
                if (currLangChapter.bcid === comm.bookInfo.langChapterPages[i].bcid) {
                    langChapterPages = comm.bookInfo.langChapterPages[i].pages;
                    break;
                }
            }
        }
        var currPageIndex = 0;
        for (var i = 0; i < langChapterPages.length; i++) {
            if (langChapterPages[i] === anchorPage) {
                currPageIndex = i;
                break;
            }
        }
        var percentage = langChapterPages.length === 0 ? 0 : (1.0 * currPageIndex / langChapterPages.length) * 100;
        comm.bookInfo.currPercentageInChapter = percentage;
    };
    //按页码计算当前页在LANG阅读单元中的百分比
    comm.getCurrLangChapter = function(anchorPage) {
        var langChapterId = '';
        for (var i = 0; i < comm.bookInfo.langChapterPages.length; i++) {
            var pages = comm.bookInfo.langChapterPages[i].pages;
            if (pages[0] <= anchorPage && pages[pages.length - 1] >= anchorPage) {
                langChapterId = comm.bookInfo.langChapterPages[i].bcid;
                break;
            }
        }
        var currLangChapter = null;
        for (var i = 0; i < comm.langChapters.length; i++) {
            if (comm.langChapters[i].bcid === langChapterId) {
                currLangChapter = comm.langChapters[i];
                break;
            }
        }
        comm.bookInfo.currLangChapter = currLangChapter;
        return currLangChapter;
    };
    //按LANG阅读单元ID获取对应的原书书脊ID列表
    comm.getLangChapterSpineIds = function(langChapterId) {
        var langChapter = {};
        for (var i = 0; i < comm.langChapters.length; i++) {
            if (comm.langChapters[i].bcid === langChapterId) {
                langChapter = comm.langChapters[i];
                break;
            }
        }
        return langChapter.spineids;
    };
    //翻页时计录新页的CFI
    //该事件的发生早于'book:pageChanged'
    comm.locationChanged = function(locationCfi) {
        comm.bookInfo.currCfi = locationCfi;
    };
    //---------------------------------------------------------------------
    comm.printObject=function(obj)
    {
      var des = "";
        for(var name in obj){
    	     des = name + "  :  " + obj[name] + ";";
           console.log(des);
         }
    }
    window.$epubExt = comm;
})(window);
