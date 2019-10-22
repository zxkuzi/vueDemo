(function () {
    var comm = {};
    var isInstallWeChatApp = false;
    comm.show = function (params, callback) {
        if (!weChat) {
            var weChat = api.require('wx');
        }
        console.log(12)
        weChat.isInstalled(function (ret, err) {
            if (ret.installed) {
              alert('安装了微信客户端')
            } else {
                isInstallWeChatApp = true;
                alert('当前设备未安装微信客户端,请扫码分享');
            }
        });
        var wrapDom = '<div id="wechat" class="wechat-share">\n' +
        '                   <div id="wechatChild" class="wechat">\n' +
        '                       <span id="cardpopup_btn" class="close">\n' +
        '                            <svg class="icon" aria-hidden="true">\n' +
        '                                 <use xlink:href="#icon-tongyongban_guanbianniu_moren"></use>\n' +
        '                            </svg>\n' +
        '                       </span>\n' +
        '                       <div class="line"></div>\n' +
        '                       <div class="wechat-title">分享到</div>\n' +
        '                       <div id="wechatFriend2" class="wechat-btn">\n' +
        '                            <svg class="icon" aria-hidden="true">\n' +
        '                                 <use xlink:href="#icon-weixin"></use>\n' +
        '                            </svg>\n' +
        '                            <span>微信好友</span>\n' +
        '                       </div>\n' +
        '                       <div id="wechatMoments1" class="wechat-btn">\n' +
        '                            <svg class="icon" aria-hidden="true">\n' +
        '                                 <use xlink:href="#icon-pengyouquan"></use>\n' +
        '                            </svg>\n' +
        '                            <span>微信朋友圈</span>\n' +
        '                       </div>\n' +
        '                       <div id="wechatQrCode" class="wechat-btn">\n' +
        '                            <svg class="icon" aria-hidden="true">\n' +
        '                                 <use xlink:href="#icon-saoma"></use>\n' +
        '                            </svg>\n' +
        '                            <span>手机扫码分享</span>\n' +
        '                       </div>\n' +
        '                   </div>\n' +
        '               </div>';
        document.body.insertAdjacentHTML('beforeEnd', wrapDom);
        document.getElementById('wechatFriend2').addEventListener('touchend', function () {
          console.log('----------------------------------------')
            if (isInstallWeChatApp) {
                return alert('当前设备未安装微信客户端,请扫码分享');
            } else {
              // alert(88888888888888)
                if(params.readerPresent){
                  weChat.shareImage({
                      apiKey: '',
                      scene: 'session',
                      thumb: 'widget://common/image/shares.png',
                      // contentUrl: 'widget://common/image/shares.png'
                      contentUrl: params.realShareImageUrl
                  }, function(ret, err){
                    comm.hide();
                    callback('wechatFriend2', ret);
                      if(ret.status){
                          // alert('分享成功');
                      }else{
                          // alert(err.code);
                      }
                  });
                }else{
                  weChat.shareWebpage({
                      apiKey: '',
                      scene: 'session',
                      title: params.desc,
                      description: params.desc,
                      thumb: 'widget://common/image/weChat.png',
                      contentUrl: params.url
                  }, function(ret, err) {
                      comm.hide();
                      callback('wechatFriend2', ret);
                  });
                }
            }
        });
        document.getElementById('wechatMoments1').addEventListener('touchend', function () {
          console.log('999999999999999999999999999999')
            if (isInstallWeChatApp) {
                return alert('当前设备未安装微信客户端,请扫码分享');
            } else {
                if(params.readerPresent){
                  weChat.shareImage({
                      apiKey: '',
                      scene: 'timeline',
                      thumb: 'widget://common/image/shares.png',
                      // contentUrl: 'widget://common/image/shares.png'
                      contentUrl: params.realShareImageUrl
                  }, function(ret, err){
                    comm.hide();
                    callback('wechatMoments1', ret);
a                  });
                }else{
                  weChat.shareWebpage({
                      apiKey: '',
                      scene: 'timeline',
                      title: params.title,
                      description: params.desc,
                      thumb: 'widget://common/image/weChat.png',
                      contentUrl: params.url
                  }, function(ret, err) {
                      comm.hide();
                      callback('wechatMoments1', ret);
                  });
                }
            }
        });
        document.getElementById('wechatQrCode').addEventListener('touchend', function () {
          console.log(77777777777777)
            document.getElementById('wechat').innerHTML = '<div id="share-qrCode" class="share-qrCode">\n' +
                '        <img style="width: 100%; height: 100%" src=" '+ params.shareQrcode +' " alt="shareQrCode">\n' +
                '    </div>';
            document.getElementById('share-qrCode').addEventListener('touchstart', function (e) {
                e.stopPropagation();
            });
        });
        document.getElementById('wechatChild').addEventListener('touchstart', function (e) {
            e.stopPropagation();
        });
        document.getElementById('wechat').addEventListener('touchstart', function (e) {
            comm.hide();
        });
        document.getElementById('cardpopup_btn').addEventListener('touchstart', function () {
            comm.hide();
        });
    };
    comm.hide = function () {
        if (document.getElementById("wechat")) {
            document.getElementById("wechat").parentNode.removeChild(document.getElementById("wechat"));
        }
    };
    window.$wechatShareAlert = comm
})();
