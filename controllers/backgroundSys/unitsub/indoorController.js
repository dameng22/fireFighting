/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('indoorController', ['$scope','acceptance_http','$state','$stateParams','myself_alert','$rootScope',
	function($scope,acceptance_http,$state,$stateParams,myself_alert,$rootScope){
	//后退
	$scope.alert_cancel=function(){
		$state.go("setUnitOnline",{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit});
	};
	//获取详情
	$scope.get_list=function(){
		acceptance_http.get_unit_info_indoor({customerSiteId:$stateParams.unit_id,pageNum:$scope.currentPage,pageSize:1},function(result){
			$scope.info = result.results;
			$scope.bigTotalItems = result.count;
			if($scope.info.length<=0){
				$scope.info = angular.copy([$scope.add_info]);
			}
			//获取建筑物
			acceptance_http.get_unit_all_build({customerSiteId:$stateParams.unit_id},function(result){
				$scope.buildings = result;
				$scope.select_build();
			});
		})
	};
	$scope.get_list();
	//获取单位信息
	acceptance_http.get_unit_info_base({id:$stateParams.unit_id},function(result){
		$scope.unit = result;
	});
	//保存
	$scope.save_data_btn=function(){
		if(!$scope.info[0].code && $scope.info[0].code!=0 || $scope.info[0].code==''){
			myself_alert.dialog_show("请输入必填项!");
			return;
		}
		acceptance_http.edit_unit_info_indoor($scope.info[0],function(result){
			myself_alert.dialog_show("保存成功!");
			$scope.get_list();
			$scope.add_now = false;
		})
	};
	//新增一页
	$scope.add_data_btn=function(){
		$scope.info = angular.copy([$scope.add_info]);
		$scope.add_now = true;
	};
	//取消
	$scope.cancel_btn=function(){
		$scope.get_list();
		$scope.add_now = false;
	};
	//删除
	$scope.delete_data_btn=function(){
		$rootScope.delete_now = true;
		$rootScope.delete_func = function(){
			acceptance_http.del_unit_info_indoor({id:$scope.info[0].id},function(result){
				myself_alert.dialog_show("删除成功!");
				$scope.get_list();
				$rootScope.delete_now = false;
			});
		}
	};
	$scope.add_info = {
        "adapterCount": 0,
        "adapterPosition": "",
        "code": "",
        "name":"",
        "fireHoseCount": 0,
        "hydrantCount": 0,
        "networkForm": "",
        "pipeDiameter": 0,
        "poolBoxCapacity": 0,
        "pressurePumpCount": 0,
        "pressurePumpFlow": 0,
        "pressurePumpLift": 0,
        "pressureTank": 0,
        "pumpCount": 0,
        "pumpFlow": 0,
        "pumpLift": 0,
        "pumpPosition": "",
        "siteId": $stateParams.unit_id,
        "standpipeDiameter": 0
   	};
   	//选择建筑物
	$scope.select_build=function(){
		for(var i=0;i<$scope.buildings.length;i++){
			if($scope.info[0].code == $scope.buildings[i].id){
				$scope.info[0].name = $scope.buildings[i].name;
			}
		}
	}
}]);