(function(window) {'use strict';
	//基于百度地图开放平台的地理位置JS库（集成Apicloud的bMap模块实现功能）
	var comm = {};
	comm.bMap = null;
	//---------------------------------------------------------------------
	//内部方法，用于获取td的实例
	comm.bMapInstance = function() {
		if (!comm.bMap) {
			comm.bMap = api.require('bMap');
		}
		return comm.bMap;
	};
	//callback(ret,err);
	comm.getLocationName = function(callback) {
		comm.bMap = comm.bMapInstance();
		if (comm.bMap && $comm.isFunction(callback)) {
			comm.bMap.getLocation({
				accuracy : '10m',
				autoStop : true,
				filter : 1
			}, function(ret, err) {
				if (ret && ret.status) {
					comm.getName(ret.lon, ret.lat, callback);
				} else if (err) {
					callback(null, 'getLocation error : [' + err.code + ':' + err.msg + ']');
				} else {
					callback(null, 'getLocation error : unknown error');
				}
			});
		}
	};
	comm.getName = function(lon, lat, callback) {
		comm.bMap = comm.bMapInstance();
		if (comm.bMap && $comm.isFunction(callback)) {
			comm.bMap.getNameFromCoords({
				lon : lon,
				lat : lat
			}, function(ret, err) {
				if (ret.status) {
					var retVal = {
						lon : ret.lon, //数字类型；经度
						lat : ret.lat, //数字类型；纬度
						address : ret.address, //字符串类型；地址信息
						province : ret.province, //字符串类型；省份
						city : ret.city, //字符串类型；城市
						district : ret.district, //字符串类型；县区
						streetName : ret.streetName, //字符串类型；街道名
						streetNumber : ret.streetNumber //字符串类型；街道号
					};
					//retVal是ret的子集
					callback(retVal, null);
				} else if (err) {
					callback(null, 'getNameFromCoords error : [' + err.code + ':' + comm.convertErrMsg(err.code) + ']');
				} else {
					callback(null, 'getNameFromCoords error : unknown error');
				}
			});
		}
	};
	//按百度开放地图API（bmap）的错误code，匹配错误message
	comm.convertErrMsg = function(code) {
		var msg = '';
		switch(code) {
			case 1:
				msg = '检索词有岐义';
				break;
			case 2:
				msg = '检索地址有岐义';
				break;
			case 3:
				msg = '没有找到检索结果';
				break;
			case 4:
				msg = 'key错误';
				break;
			case 5:
				msg = '网络连接错误';
				break;
			case 6:
				msg = '网络连接超时';
				break;
			case 7:
				msg = '还未完成鉴权，请在鉴权通过后重试';
				break;
			default:
				msg = '未知错误';
				break;

		}
		return msg;
	};
	//---------------------------------------------------------------------
	window.$bLocation = comm;

})(window);
