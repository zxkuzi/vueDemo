(function(window) {'use strict';
	//调用apicloud集成的talkingdata模块，实现App的数据统计功能
	//该类下的所有方法调用需在apiready后执行

	var comm = {};
	comm.td = null;
	//---------------------------------------------------------------------
	//内部方法，用于获取td的实例
	comm.tdInstance = function() {
		if (!comm.td) {
			comm.td = api.require('talkingData');
		}
		return comm.td;
	};
	//获取设备ID
	comm.getDeviceID = function(callback) {
		comm.td = comm.tdInstance();
		if (comm.td && $comm.isFunction(callback)) {
			comm.td.getDeviceID(callback);
		}
	};
	//td的pageStart,pageEnd需在同一页面内成对出现
	//调用此接口后，确保在同一页面调用onPageEnd方法。 　
	comm.onPageStart = function(pgName) {
		comm.td = comm.tdInstance();
		if (comm.td && pgName) {
			var param = {
				pageName : pgName
			};
			comm.td.onPageStart(param);
		}
	};
	//调用此接口后，确保在同一页面调用onPageStart方法。
	comm.onPageEnd = function(pgName) {
		comm.td = comm.tdInstance();
		if (comm.td && pgName) {
			var param = {
				pageName : pgName
			};
			comm.td.onPageEnd(param);
		}
	};
	//eventId无需提前在数据平台中定义，可自行定义名称，直接加入到应用中需要跟踪的位置即可生效。
	//格式：32个字符以内的中文、英文、数字、下划线，注意eventId中不要加空格或其他的转义字符。
	//TalkingData最多支持10000个不同的Event ID。
	comm.onEvent = function(eid, elabel, eparam) {
		comm.td = comm.tdInstance();
		if (comm.td && $comm.isString(eid) && $comm.isString(elabel) && $comm.isObject(eparam)) {
			var param = {
				eventId : eid,
				eventLabel : elabel,
				parameters : eparam
			};
			comm.td.onEvent(param);
		}
	};
	//如果所有事件都需要传输相同的参数，可以设置全局的Key-Value，这些Key-Value会自动添加到所有自定义事件。
	//如果onEvent里传入的Key-Value里的key和全局Key-Value里的key冲突，以onEvent里传入的为准。
	//设置全局的onEvent参数数据
	comm.setGlobalKV = function(gk, gv) {
		comm.td = comm.tdInstance();
		if (comm.td && $comm.isString(gk) && ($comm.isString(gv) || $comm.isNumber(gv))) {
			var param = {
				key : gk,
				value : gv
			};
			comm.td.setGlobalKV(param);
		}
	};
	//移除全局的onEvent参数数据
	comm.removeGlobalKV = function(gk) {
		comm.td = comm.tdInstance();
		if (comm.td && $comm.isString(gk)) {
			var param = {
				key : gk
			};
			comm.td.removeGlobalKV(param);
		}
	};
	//如app有精确的经纬度数据，可在此向dt设置(dt默认的经纬度精度不高)
	comm.setLocation = function(lat, lon) {
		comm.td = comm.tdInstance();
		if (comm.td && $comm.isNumber(lat) && $comm.isNumber(lon)) {
			var param = {
				latitude : lat,
				longitude : lon
			};
			comm.td.setLocation(param);
		}
	};
	//---------------------------------------------------------------------
	window.$talkingdata = comm;

})(window);
