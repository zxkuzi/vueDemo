(function (window){//公共信息
	var public_mas = {};
	//vip信息
	public_mas.vip_mas = function(my_VIPInfo){
		$myCenter.VIPInfo(my_VIPInfo)
	}
	window.$public_mas = public_mas;
})(window)
