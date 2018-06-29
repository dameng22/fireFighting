/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('unitOnlineElecController', ['$scope','acceptance_http','all_dic','exp_tool','$timeout','myself_alert','downloadFiles','$rootScope','dic_http','$state','$base64','$stateParams',
	function($scope,acceptance_http,all_dic,exp_tool,$timeout,myself_alert,downloadFiles,$rootScope,dic_http,$state,$base64,$stateParams){
	//进页面时默认选中两项
	var net_status;
	$scope.regions = '区域';
	$scope.types = 2;
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
	//通讯模式
	dic_http.get_fam_type({customerId:$base64.decode($stateParams.unit),isdisable:false},function(result){
		$scope.communication_mdl = result;
	});
	$scope.go_state = function(id){
		if(id == 1){
			$state.go("unitOnline",{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit})
		}else if(id == 2){
			$state.go("unitOnlineElec",{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit});
			
		}else if(id == 3){
			$state.go("unitOnlineWater",{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit})
		}
	};
	$scope.alarm_type = all_dic.alarm_type;
	//切换菜单
	$scope.show_tab=function(index){
		$scope.selected = index;
		$scope.search_key = null;
		page_num = 0;
		total_page = 0
		limits = true;
		$scope.current_id = null;
		$scope.unit_online = [];
//		$scope.get_list();
	};
	$scope.show_tab(1);
}]);