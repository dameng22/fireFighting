/**
 * Created by Lxy on 2017/12/10.
 */
app.controller('mapController', ['$scope','common_http','$interval','$compile','acceptance_http','all_dic','dic_http','$stateParams','$state','$base64',
	function($scope,common_http,$interval,$compile,acceptance_http,all_dic,dic_http,$stateParams,$state,$base64){
    //后退
	$scope.alert_cancel=function(){
		$state.go("setUnitOnline",{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit});
	};
    var map = new BMap.Map("unitMap");
    if($base64.decode($stateParams.unit) == 'ANLITAI_2017_FAKE'){
		var point = new BMap.Point(113.269616, 23.15995);
	}else{
		var point = new BMap.Point(113.11, 23.05);
	};
    map.centerAndZoom(point, 13);
//  map.setCurrentCity("广州");
    map.enableScrollWheelZoom(true);
    //获取经纬度
	acceptance_http.get_unit_info_trans({customerSiteId:$stateParams.unit_id},function(result){
		$scope.info = result[0].address.address;
		map.clearOverlays();
		angular.forEach(result, function (site, i) {
	    	if(typeof(site.address) != 'undefined'&&site.address){
	            var pt = new BMap.Point(site.address.longitude, site.address.lattitude);
		        var myIcon = new BMap.Icon("images/icon_online.png", new BMap.Size(25, 33));
		        var marker = new BMap.Marker(pt, {icon: myIcon});
		        map.addOverlay(marker);
		        map.panTo(pt);
		        
		        map.addEventListener('zoomend', function(){    //地图更改缩放级别结束时触发触发此事件
                	marker.setPosition(map.getCenter());
          		});
	       }
	    })
	});
}]);