(function (window) {
    var toast = function () {

    };
    var isShow = false;
    toast.prototype ={
        create: function (params,callback) {
            var self = this;
            var toastHtml = '';
            switch (params.type) {
                case "success":
                    var iconHtml = '<i class="iconfont font_family iconfont-toast">&#xe6db;</i>';
                    break;
                case "fail":
                    var iconHtml = '<i class="iconfont font_family iconfont-toast">&#xe6dc;</i>';
                    break;
            }

            var titleHtml = params.title ? '<div class="custom-title">'+params.title+'</div>' : '';
            toastHtml = '<div class="toast-content"><div class="iconfont-wrap">'+iconHtml+titleHtml+'</div></div>';
            if(document.querySelector(".toast-content")){
                return;
            }
            document.body.insertAdjacentHTML('beforeend', toastHtml);
            var duration = params.duration ? params.duration : "1500";
            self.show();
            setTimeout(function(){
                self.hide();
            }, duration)
        },

        createAlert: function (params,callback,warn) {
            var self = this;
            var toastHtml = '';
            var buttonHtml = '';
            var iconHtml = params.iconHtml ? params.iconHtml : '';
            var titleHtml = params.title ? '<div class="custom-title">'+params.title+'</div>' : '';
            var chooseHtml = params.warn ? '<div class="custom-warn-div"><label for="awesome"><input class="custom-warn" type="checkbox" id="awesome"/>'+params.warn+'</label></div>': '';
            var titleMsgHtml = params.msg ? '<div class="custom-msg">' + params.msg + iconHtml + '</div>' : '';
            var buttons = params.buttons ? params.buttons : [];
            if (buttons.length > 1) {
                buttonHtml = "<div class='custom-buttons-wrap'><button class='custom-button-A' id='customButtonA'> " + buttons[0].name + "</button> <button class='custom-button-B' id='customButtonB'>  " + buttons[1].name + " </button></div>"
            } else if (buttons.length = 1) {

                buttonHtml = "<div class='custom-buttons-wrap'><button id='customButtonC' class='custom-button-A'> "+ buttons[0].name + " </button></div> "
            }
            toastHtml = '<div class="toast-content"><div class="iconfont-wrap-button">' + titleHtml  + titleMsgHtml  +chooseHtml + buttonHtml + ' </div></div>';
            if(document.querySelector(".toast-content")){
                return;
            }

            document.body.insertAdjacentHTML('beforeend', toastHtml);

            if (buttons.length > 1) {
                document.getElementById('customButtonA').addEventListener('touchend',function () {
                    buttons[0].onclick();
                });
                document.getElementById('customButtonB').addEventListener('touchend',function () {
                    buttons[1].onclick();
                });
            } else if (buttons.length = 1) {
                document.getElementById('customButtonC').addEventListener('touchend',function () {
                    buttons[0].onclick();
                });
            }

            var duration = params.duration ? params.duration : "1500";
            self.show();
            setTimeout(function(){
                //self.hide();
            }, duration);
        },
        show: function () {
            var self = this;
            document.querySelector(".toast-content").style.display = "block";
            if(document.querySelector(".toast-content")){
                return
            }
        },
        hide: function () {
            var self = this;
            if(document.querySelector(".toast-content")){
                document.querySelector(".toast-content").parentNode.removeChild(document.querySelector(".toast-content"));
            }
        },
        success: function (params,callback) {
            var self = this;
            params.type = "success";
            return self.create(params,callback);
        },
        fail: function(params,callback){
            var self = this;
            params.type = "fail";
            return self.create(params,callback);
        },
        alert: function  (params,callback) {
            var self = this;
            params.type = "alert";
            return self.createAlert(params,callback)
        },
        // alertAnswer: function (params, callback) {
        //     var self = this;
        //     params.type = 'alertAnswer';
        //     return self.createAlertAnswer(params, callback)
        // }
        networkAnomaly(callback){
          var tips = 	'<p class="Tips" style="position:absolute;top:40%;left:50%;margin-left:-16rem;width:32rem;color:#a3a3a3;font-size:1.6rem;">网络连接情况不太好，点击<span id="afresh" style="color:#00b596;">重新加载</span>一下吧</p>'
          document.body.insertAdjacentHTML('beforeEnd', tips);
          document.getElementById('afresh').addEventListener('click',callback);
        }
    };
    window.customToast = toast;
})(window);
