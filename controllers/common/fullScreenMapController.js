/**
 * Created by Lxy on 2017/12/10.
 */
app.controller('fullScreenMapController', ['$scope','common_http','$interval','$compile','acceptance_http','all_dic','dic_http','$base64','$stateParams',
	function($scope,common_http,$interval,$compile,acceptance_http,all_dic,dic_http,$base64,$stateParams){
    $scope.state = "-1";
    $scope.fullState = false;
    $scope.online = true;
    $scope.offline = true;
    var all_status = [];
    var map = new BMap.Map("allMap");
    var start = 0;
    if($base64.decode($stateParams.unit) == 'ANLITAI_2017_FAKE'){
		var point = new BMap.Point(113.269616, 23.15995);
	}else{
		var point = new BMap.Point(113.11, 23.05);
	};
    map.centerAndZoom(point, 13);
	//map.setCurrentCity("广州");
    map.enableScrollWheelZoom(true);
    
	var markerClusterer = new BMapLib.MarkerClusterer(map);
    var markerList = [];
    $scope.init = function (state) {
    	var flag = false;
    	start ++;
    	all_status = [];
    	if($scope.online == true){
			all_status.push(0);
		}
		if($scope.offline == true){
			all_status.push(1);
		}
		if(all_status.length == 2){
			flag = true;
		}
        common_http.get_customer_map({isAll:flag,isOnLine:all_status,name:$scope.search_key},function(res){
        	map.clearOverlays();
        	markerClusterer.clearMarkers();
            markerList=[];
            angular.forEach(res, function (site, i) {
            	if(typeof(site.address) != 'undefined'&&site.address){
	                var pt = new BMap.Point(site.address.longitude, site.address.lattitude);
	                var myIcon = new BMap.Icon(site.fire == true ? "images/icon_fire.png" : (site.status === 0 ? "images/icon_online.png" : "images/icon_offline.png"), new BMap.Size(25, 33));
	                
	                //mengzhu chen add
				   	var label = new BMap.Label(site.famCustomerSite.name,{offset:new BMap.Size(-46,40)});
		 			if(site.fire == true){
		 				label.setStyle({
							backgroundColor: '#FF313B',
		 				});
		 			} else {
		 				if(site.status === 0){
		 					label.setStyle({
								backgroundColor: '#4584FD',
				 			});
		 				} else {
		 					label.setStyle({
								backgroundColor: '#5F6676',
				 			});
		 				}
		 			}		 			
	                var marker = new BMap.Marker(pt, {icon: myIcon});	    
	                
	                //mengzhu chen add
	                var map_zoom = map.getZoom(); // 定义地图缩放等级的变量
         			if (map_zoom >= 15) {   // 如果缩放等级大于等于15 默认为13
         				marker.setLabel(label);
					}
					
	                map.addOverlay(marker);			                
	                
	                if (i === 0 && state===true) {
	                    map.panTo(pt);
	                }
	                var opts = {
	                    width: 360,
	                    height: 170,
	                    title: "<p class='full_map_title'>" + site.famCustomerSite.name + "</p>"
	                };
	                var ids = JSON.stringify(site.famCustomerSite.id); //过编译
	                var htmls = "<div class='full_map_content'>" + "<p class='full_map_address'>" + site.address.address + "</p>" + "<p class='full_map_sub'>联系方式</p>" +"<p>" + "联系电话：" + site.famCustomerSite.contactinfo + "</p>" + "<p>" + "消控室电话：" + site.famCustomerSite.controlRoomContactinfo + "</p>" + "<a href='javascript:;' style='float:right;' ng-click='show_unit_detail("+ ids +")'>详细信息</a>" +"</div>";
	   		        var template = angular.element(htmls);
			        //编译模板
			        var Element = $compile(template)($scope);
			        var infoWindow = new BMap.InfoWindow(Element[0],opts);
			        marker.addEventListener("click", function () {
	                    map.openInfoWindow(infoWindow, pt);
	               	});
	               	markerList.push(marker);
               	}
            });
			//生成一个marker数组，然后调用markerClusterer类即可。
            markerClusterer.addMarkers(markerList)
        })
    };
    //map.getCenter() 获取中心点   map.toSpan()	Point	返回矩形区域的跨度
    //enter搜索
	$('.enter_press').bind('keypress', function (event) { 
	   	if (event.keyCode == "13") { 
	    	$scope.get_search();
	   	}
	});
    $scope.init(true);
    $scope.get_search = function (type) {
    	if(type==0){
			$scope.online = !$scope.online;
		}else if(type==1){
			$scope.offline = !$scope.offline;
		}
		$scope.init();
//      angular.forEach(markerList, function (info) {
//          if ($scope.state === "-1" || info.state.toString() === $scope.state) {
//              info.marker.show();
//          } else {
//              info.marker.hide();
//          }
//      })
    };
    //数量
	acceptance_http.get_region_count({time:new Date()},function(result){
		$scope.unit_conut = result;
		$scope.map_counts = result;
	});
    $scope.$on("map_counts", function(event, obg) {
        $scope.map_counts = obg.data;
   	})
    $scope.resizeMap = function (state) {
        $scope.fullState = state;
        if (state) {
            $('#mapContent').addClass('full');
        } else {
            $('#mapContent').removeClass('full');
        }

    };
    $scope.autoRefresh = $interval($scope.init, 30000);
    $scope.$on("$destroy", function () {
        $interval.cancel($scope.autoRefresh);
    });
    //单位详情
  	$scope.show_unit_detail = function(id){
		$scope.show_unit_alert = true;
		$scope.current_id = id;
		$scope.current_tab = 0;
		sessionStorage.current_tab = null;
		acceptance_http.get_unit_info_base({id:id},function(result){
			$scope.base_info = result;
			$scope.unit_name = angular.copy($scope.base_info.name);
		});
		//获取建筑物
		acceptance_http.get_unit_all_build({customerSiteId:id},function(result){
			$scope.buildings_info = result;
		});
		//传输设备
		acceptance_http.get_unit_info_trans({customerSiteId:id},function(result){
			$scope.device_list = result;
		});
  	}
}]);