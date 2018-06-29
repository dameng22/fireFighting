/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('networkUnitController', ['$scope','acceptance_http','all_dic','exp_tool','dic_http','$timeout','$rootScope','$base64','$stateParams',
	function($scope,acceptance_http,all_dic,exp_tool,dic_http,$timeout,$rootScope,$base64,$stateParams){
	var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	$scope.unit_list = [];
  	var get_data;
  	//获取区域
  	if($rootScope.system_name == '消防监管单位管理系统'){
   		acceptance_http.get_authority_areas({customerId:$base64.decode($stateParams.unit)},function(result){
	  		$scope.net_areas = result;
	  	});
   	}else{
   		acceptance_http.get_unit_info_areas({customerId:$base64.decode($stateParams.unit)},function(result){
	  		$scope.net_areas = result;
	  	});
   	}
  	//获取单位类别
  	$scope.site_type = all_dic.siteType
	//列表
	$scope.get_list=function(){
		page_num = page_num+1;
		var area_id = angular.copy($scope.area_id);
		var type_id = angular.copy($scope.type_id);
		if(exp_tool.is_chinese(area_id)){
			area_id = null
		}
		if(exp_tool.is_chinese(type_id)){
			type_id = null
		}
		if($rootScope.system_name == '消防监管单位管理系统'){
	   		get_data = acceptance_http.get_auth_unit_info;
	   	}else{
	   		get_data = acceptance_http.get_unit_info;
	   	}
		get_data({customerId:$base64.decode($stateParams.unit),pageNum:page_num,pageSize:page_size,regionId:area_id,siteTypeId:type_id,nameAndCode:$scope.search_key,requestFlag:null},function(result){
			$scope.unit_list = $scope.unit_list.concat(result.results);
			limits = true;
			total_page = result.totalPage;
		})
	}
	$scope.get_list()
	//详情
	$scope.go_detail=function(id){
		$scope.show_alert=true;
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
	};
	//下拉加载
	function scrollDate(){
		$(".list_data_scroll").mCustomScrollbar({
			theme:"minimal-dark",
			autoHideScrollbar:true,
			callbacks:{
		        onTotalScroll:function(){
			        if(limits&&(page_num<total_page)){
			        	limits = false;
				        $scope.get_list();
			    	}
		        },
		        onTotalScrollOffset: 2
		   }
		});
	};
	//enter搜索
	$('.enter_press').bind('keypress', function (event) { 
	   	if (event.keyCode == "13") { 
	    	$scope.rsearch_list();
	   	}
	});
	$timeout(scrollDate, 10);
	$scope.area_id = "按区域筛选";
	$scope.type_id = "按单位类别筛选";
	//查询
	$scope.rsearch_list=function(){
		page_num = 0;
		$scope.unit_list = [];
		$scope.get_list();
	};
	//显示地图
	$scope.map_show = function(id){
		$scope.show_map = true;
		acceptance_http.get_unit_info_trans({customerSiteId:id},function(result){
			$timeout($scope.initMap(result[0]),100);
		});
	}
	//地图初始化
    $scope.initMap = function (info) {
        var map = new BMap.Map("deviceMap");
        if($base64.decode($stateParams.unit) == 'ANLITAI_2017_FAKE'){
			var point = new BMap.Point(113.269616, 23.15995);
		}else{
			var point = new BMap.Point(113.11, 23.05);
		};
        map.centerAndZoom(point, 15);
//      map.setCurrentCity("广州");
        map.enableScrollWheelZoom(true);
        if (info.address&&typeof(info.address.address) != 'undefined'&&info.address.address) {
            var point2 = new BMap.Point(info.address.longitude, info.address.lattitude);
            var myIcon = new BMap.Icon("images/icon_online.png", new BMap.Size(25, 33));
            map.panTo(point2);
            var marker = new BMap.Marker(point2, {icon: myIcon});
            map.addOverlay(marker);
        }
   	};
}]);