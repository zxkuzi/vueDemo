(function(window) {'use strict';

	var comm = {};
	// setStorage key值
	// 用户token: token
	// 用户信息: user-info
	// 用户入学测id: reading-test-id
	// 朗读选择题题库: choice-list
	// 正式测次数: test-count
	// 设备信息: device
	// 点亮墙书架信息: bookshelf-info
	// 用户VIP信息：userVipInfo
	// 读书翻页: turn-the-page
	//---------------------------------------------------------------------
	//记录frame open情况到storage
	comm.setFrameLogs = function(prefix, frame) {
		var name = prefix + '_frames';
		var frames = comm.getStorage(name);
		var array = null;
		if (frames) {
			array = array || $api.strToJson(frames);
		}
		array = array || [];
		array.splice(0, 0, frame);
		comm.setStorage(name, $api.jsonToStr(array));
	};
	//从storage中获取frame open情况
	comm.getFrameLogs = function(prefix) {
		var name = prefix + '_frames';
		var frames = comm.getStorage(name);
		var array = null;
		if (frames) {
			array = array || $api.strToJson(frames);
		}
		array = array || [];
		return array;
	};
	//删除storage中的frame open情况
	comm.delFrameLogs = function(prefix, frame) {
		var array = comm.getFrameLogs(prefix);
		var index = 0;
		for (var i = 0; i < array.length; i++) {
			if (array[i] === frame) {
				index = i;
				break;
			}
		}
		array.splice(index, 1);

		var name = prefix + '_frames';
		comm.setStorage(name, $api.jsonToStr(array));
	};
	//清空storage中的frame open情况
	comm.clearFrameLogs = function(prefix) {
		var name = prefix + '_frames';
		comm.delStorage(name);
	};
	//---------------------------------------------------------------------
	//保存UI信息
	comm.setUIInfo = function(uiInfo) {
		$storage.delStorage('ui');
		$storage.setStorage('ui', $api.jsonToStr(uiInfo));
	};
	//读取UI信息
	comm.getUIInfo = function() {
		var uiInfoStr = $storage.getStorage('ui');
		return $api.strToJson(uiInfoStr);
	};
	//清空UI信息
	comm.clearUIInfo = function() {
		comm.delStorage('ui');
	};
	//---------------------------------------------------------------------
	//保存业务信息(课程,班级,学生,项目,题目等)
	comm.setBizInfo = function(bizInfo) {
		$storage.delStorage('biz');
		$storage.setStorage('biz', $api.jsonToStr(bizInfo));
	};
	//读取业务信息
	comm.getBizInfo = function() {
		var bizInfoStr = $storage.getStorage('biz');
		return $api.strToJson(bizInfoStr);
	};
	//清空UI信息
	comm.clearBizInfo = function() {
		comm.delStorage('biz');
	};
	//---------------------------------------------------------------------
	//写Storage
	comm.setStorage = function(name, value) {
		if ($comm.isObject(value)) {
			value = $api.jsonToStr(value);
		}
		if (value) {
			window.localStorage.setItem(name, value);
		}
	};
	//读取Storage
	comm.getStorage = function(name) {
		var value = window.localStorage.getItem(name);
		if (value) {
            return value;
		} else {
            return null;
		}
	};
	//删除Storage
	comm.delStorage = function(name) {
		var value = window.localStorage.getItem(name);
		if (value)
			window.localStorage.removeItem(name);
	};
    //删除Storage clear
    comm.clearStorage = function() {
    	window.localStorage.clear();
    };
	//---------------------------------------------------------------------
	window.$storage = comm;

})(window);
