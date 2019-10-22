(function (window) {
    var myCenter = {};
	//我的资料
    myCenter.my_information = function (funSuc, funErr) {
        $comm.ajaxPost('User', 'TotalInfo', {}, funSuc, funErr, 'json', true);
    };
   	//设置个人信息
   	myCenter.my_PersonInfoSetting = function (itemkey,itemvalue,funSuc, funErr){
   		var datas = {
   			itemkey:itemkey,
   			itemvalue:itemvalue
   		};
   		$comm.ajaxPost('User', 'PersonInfoSetting', datas, funSuc, funErr, 'json', true);
   	};
   	//变更密码
   	myCenter.my_ChangePwd = function(oldpwd,newpwd,funSuc, funErr){
   		var datas = {
   			oldpwd:oldpwd,
   			newpwd:newpwd
   		};
   		$comm.ajaxPost('User', 'ChangePwd', datas, funSuc, funErr, 'json', true);
   	};

   	//我的vip信息
   	myCenter.VIPInfo = function(funSuc, funErr){
   		$comm.ajaxPost('User', 'VIPInfo', {}, funSuc, funErr, 'json', true);
   	};
   	//可销售的vip商品
   	myCenter.VipProducts = function(funSuc, funErr){
   		$comm.ajaxPost('VIP', 'VIPFunction', {}, funSuc, funErr, 'json', true);
   	};
   	//购买vip
    myCenter.buyVip = function(params, funSuc, funErr){
    	var data = {
            VIPType: params.VIPType,
            PayType: 8,
            ReNew: params.ReNew
		};
        $comm.ajaxPost('VIP', 'BuyVIP', data, funSuc, funErr, 'json', true);
    };
    //购买记录
    myCenter.buyVIPNotify = function(params, funSuc, funErr){
        $comm.ajaxPost('VIP', 'BuyVIPNotify', params, funSuc, funErr, 'json', true);
    };
   	//用户低价券
   	myCenter.VipCoupons = function(funSuc, funErr){
   		$comm.ajaxPost('Pay', 'VipCoupons', {}, funSuc, funErr, 'json', true);
   	};
   	//我的消息
	myCenter.MyMessages = function (messagesCount, funSuc, funErr) {
		var data = {
			page: messagesCount
		};
        $comm.ajaxPost('User', 'MyMessages', data, funSuc, funErr, 'json', true);
	};
	//消息详情
	myCenter.MessageDetails = function (messageId, funSuc, funErr) {
		var data = {
			msgid: messageId
		};
		$comm.ajaxPost('User', 'Message', data, funSuc, funErr, 'josn', true);
	};
	//我的任务
	myCenter.MyTasks = function (tasksCount, funSuc, funErr) {
		var data = {
			page: tasksCount
		};
		$comm.ajaxPost('User', 'MyTasks', data, funSuc, funErr, 'json', true);
	};
	//任务详情
	myCenter.TaskDetails = function (taskId, funSuc, funErr) {
		var data = {
			taskid: taskId
		};
        $comm.ajaxPost('User', 'Task', data, funSuc, funErr, 'json', true);
	};
	//我的资料
	myCenter.MyTotalInfo = function (funSuc, funErr) {
        $comm.ajaxPost('User', 'TotalInfo', {}, funSuc, funErr, 'json', true);
	};
	//第一次注册卡劵
	myCenter.firstReg = function (funSuc, funErr) {
        $comm.ajaxPost('Activity', 'IsHaveRegisterActivityCard', {}, funSuc, funErr, 'json', false);
    };
	//修改年级
	myCenter.fixUserGrade = function (grade, funSuc, funErr) {
		var data = {
            Grade: grade
		};
        $comm.ajaxPost('User', 'ChangeGrade', data, funSuc, funErr, 'json', false);
	};
	//修改性别
	myCenter.fixUserGender = function (gender, funSuc, funErr) {
		var data = {
            Gender: gender
		};
        $comm.ajaxPost('User', 'ChangeGender', data, funSuc, funErr, 'json', false);
	};
  //c 修改个人信息
  myCenter.changeUserInfo = function(Json,fun){
    var data = {
      UserHeadBase64:Json.UserHead?Json.UserHead:'',
      ImageType:Json.imageType?Json.imageType:'',
      SName:Json.name?Json.name:'',
      Sign:Json.sign?Json.sign:'',
      Gender:Json.gender?Json.gender:0,
      Grade:Json.grade?Json.grade:0
    }
    $comm.socket(1003,data,fun)
  }
//我的朗读
  myCenter.myRead = function(data,fn){
    $comm.socket(1004,data,fn)
  }
//删除我的朗读
myCenter.DelmyRead = function(data,fn){
  $comm.socket(1005,data,fn)
}
    window.$myCenter = myCenter;
})(window);
