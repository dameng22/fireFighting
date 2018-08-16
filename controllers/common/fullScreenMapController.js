/**
 * Created by Lxy on 2017/12/10.
 */
app.controller('fullScreenMapController', ['$scope','common_http','$interval','$compile','acceptance_http','all_dic','dic_http','$base64','$stateParams','$rootScope',
	function($scope,common_http,$interval,$compile,acceptance_http,all_dic,dic_http,$base64,$stateParams,$rootScope){
	$rootScope.system_name = $rootScope.system_name + "-地图台";
    $scope.state = "-1";
    $scope.fullState = false;
    $scope.online = true;
    $scope.offline = true;
	$scope.fire = true;
	
    var all_status = [];
    var map = new BMap.Map("allMap");
    var start = 0;
    if($base64.decode($stateParams.unit) == 'ANLITAI_2017_FAKE'){
		var point = new BMap.Point(113.269616, 23.15995);
	}else{
		var point = new BMap.Point(113.11, 23.05);
	};
    map.centerAndZoom(point, 13);
	map.setCurrentCity("广州");
    map.enableScrollWheelZoom(true);
    //map.enableDragging();
    
    var local = new BMap.LocalSearch(map, {
	  renderOptions:{map: map}
	}); 
             
	var markerClusterer = new BMapLib.MarkerClusterer(map);
    var markerList = [];
    $scope.result_id = [];   
    $scope.company_id = [];
    
    $scope.init = function (state) {  
    	acceptance_http.get_alarms_unit({alertType:0,codeOrName:null},function(result){
			$scope.fire_total = result;
			for(var j=0;j<$scope.fire_total.length;j++){
				$scope.result_id.push($scope.fire_total[j].relayId);
			}
			return $scope.result_id;
    	});  
	    
	    var flag = false;
	    start ++;
	    all_status = [];
	    if($scope.online == true){
			all_status.push(0);
		}
		if($scope.offline == true){
			all_status.push(1);
		}
		if(all_status.length == 2){//3
			flag = true;
		}
		$scope.$emit("loading", true);
  
        common_http.get_customer_map({isAll:flag,status:all_status,name:$scope.search_key},function(res){
        	map.clearOverlays();
	       	markerClusterer.clearMarkers();
	        markerList=[];	
	        
			if($scope.search_key != null){
				local.search($scope.search_key);  
			}
	
        	$scope.company_id = $scope.result_id;
        	
				angular.forEach(res, function (site, i) {
					if(site){
		                var pt = new BMap.Point(site.longitude, site.lattitude);
		                var myIcon = new BMap.Icon((site.status === 0 ? "images/icon_online.png" : "images/icon_offline.png"), new BMap.Size(25, 33));
						var label = new BMap.Label(site.siteName+" "+site.code,{offset:new BMap.Size(-46,40)});
						
						
						if(site.status === 0){
		 					label.setStyle({
								backgroundColor: '#4584FD',
				 			});
		 				} else if(site.status === 1) {
		 					label.setStyle({
								backgroundColor: '#5F6676',
				 			});
		 				}
		 				
						for(var jj in $scope.company_id){
							var vall = $scope.company_id[jj];								
							if(site.deviceId == vall){
								var myIcon = new BMap.Icon("images/icon_fire.png", new BMap.Size(25, 33));
								label.setStyle({
									backgroundColor: '#FF313B',
				 				});
							}								
						}						
						if($scope.fire == false){
							var myIcon = new BMap.Icon((site.status === 0 ? "images/icon_online.png" : "images/icon_offline.png"), new BMap.Size(25, 33));
							if(site.status === 0){
			 					label.setStyle({
									backgroundColor: '#4584FD',
					 			});
			 				} else if(site.status === 1) {
			 					label.setStyle({
									backgroundColor: '#5F6676',
					 			});
			 				}
						}
						
			 			var marker = new BMap.Marker(pt, {icon: myIcon});
			 			
		                map.addOverlay(marker);			                
		               
		                if (i === 0 && state===true) {
		                    map.panTo(pt);
		                }
		                var opts = {
		                    width: 360,
		                    height: 170,
		                    title: "<p class='full_map_title'>" + site.siteName + "</p>"
		                };
		                var ids = JSON.stringify(site.siteId); //过编译
		                var htmls = "<div class='full_map_content'>" + "<p class='full_map_address'>" + site.deviceAddress + "</p>" + "<p class='full_map_sub'>联系方式</p>" +"<p>" + "联系电话：" + site.contactinfo + "</p>" + "<p>" + "消控室电话：" + site.controlRoomContactinfo + "</p>" + "<a href='javascript:;' style='float:right;' ng-click='show_unit_detail("+ ids +")'>详细信息</a>" +"</div>";
		   		        var template = angular.element(htmls);
				        //编译模板
				        var Element = $compile(template)($scope);
				        var infoWindow = new BMap.InfoWindow(Element[0],opts);
				        			        
				        marker.addEventListener("click", function () {
		                    map.openInfoWindow(infoWindow, pt);
		               	});
	
						marker.addEventListener("mouseover", function(){
							label.setStyle({
								display: "block",
				 			});
				 			marker.setLabel(label);
						});
						marker.addEventListener("mouseout", function(){
							label.setStyle({
								display: "none",
				 			});
						});
					
		               	markerList.push(marker);
	               }

					markerClusterer.addMarkers(markerList);
					
	            });
	            
	            //生成一个marker数组，然后调用markerClusterer类即可。
	            //markerClusterer.addMarkers(markerList);
	            map.panTo(new BMap.Point(113.262232,23.154345));   //1分钟后移动到广州
	            //数量
				acceptance_http.get_region_count({time:new Date()},function(result){
					$scope.unit_conut = result;
					$scope.map_counts = result;
				});
				
	            $scope.$emit("loading", false);   
        });
        
    };
	    		  
    //map.getCenter() 获取中心点   map.toSpan()	Point	返回矩形区域的跨度
    //enter搜索
	$('.enter_press').bind('keypress', function (event) { 
	   	if (event.keyCode == "13") { 
	    	$scope.get_search();
	   	}
	});
	
	$scope.show_search_back = function(){
		$scope.show_search = false;
		$scope.search_key = null;
		markerList = [];
		$scope.init();
	};
	$scope.online_disabled = false;
	$scope.offline_disabled = false;
    $scope.init(true);
    $scope.get_search = function (type) {
    	if(type==0){
			$scope.online = !$scope.online;
			if($scope.online == false){
				$scope.offline_disabled = true;
			} else {
				$scope.offline_disabled = false;
			}
		}else if(type==1){
			$scope.offline = !$scope.offline;
			if($scope.offline == false){
				$scope.online_disabled = true;
			} else {
				$scope.online_disabled = false;
			}
			
		}
		$scope.init();
    };
    
    $scope.fire_click = function(){
    	$scope.fire = !$scope.fire; 
    	$scope.init();
    }

    $scope.resizeMap = function (state) {
        $scope.fullState = state;
        if (state) {
            $('#mapContent').addClass('full');
        } else {
            $('#mapContent').removeClass('full');
        }

    };
    
    $scope.autoRefresh = $interval($scope.init, 180000);//30000
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