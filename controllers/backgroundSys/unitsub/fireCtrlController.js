/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('fireCtrlController', ['$scope','acceptance_http','all_dic','$state','dic_http','$stateParams','myself_alert','$rootScope','$base64',
	function($scope,acceptance_http,all_dic,$state,dic_http,$stateParams,myself_alert,$rootScope,$base64){
	//后退
	$scope.alert_cancel=function(){
		$state.go("setUnitOnline",{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit});
	};
	//获取传输装置
	acceptance_http.get_unit_info_trans({customerSiteId:$stateParams.unit_id},function(result){
		$scope.trans_info = result;
	});
	//获取详情
	$scope.get_list=function(){
		acceptance_http.get_unit_info_ctrl({customerSiteId:$stateParams.unit_id,pageNum:$scope.currentPage,pageSize:1},function(result){
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
			//获取子控制器
			if($scope.info[0].id){
				get_sub($scope.info[0].id);
			}else{
				$scope.sub = [];
			}
			$scope.add_sub = false;
		});
	};
	//获取子控制器
	function get_sub(id){
		acceptance_http.get_unit_ctrl_sub({mainId:id},function(result){
			$scope.sub = result;
		});
	}
	//获取单位信息
	acceptance_http.get_unit_info_base({id:$stateParams.unit_id},function(result){
		$scope.unit = result;
	});
	$scope.get_list();
	//合并保存
	$scope.save_data_btn=function(){
		if(!$scope.info[0].siteBuildingInfoId && $scope.info[0].siteBuildingInfoId!=0 || $scope.info[0].siteBuildingInfoId==''){
			myself_alert.dialog_show("请输入必填项!");
			return;
		}
		acceptance_http.edit_unit_info_ctrl($scope.info[0],function(result){
			myself_alert.dialog_show("保存成功!");
			$scope.get_list();
			$scope.add_main = false;
		});//主控制器
		if(typeof($scope.sub) != 'undefined'){
			acceptance_http.edit_unit_ctrl_sub($scope.sub,function(result){});//子控制器
		}
	};
	//新增 子控制器
	$scope.add_sub_btn=function(){
		if(!$scope.info[0].id){
			myself_alert.dialog_show("请先填写控制器基本信息!");
			return;
		}
		if((!$scope.add_info_sub.relayId && $scope.add_info_sub.relayId!=0) || $scope.add_info_sub.relayId=='' || (!$scope.add_info_sub.deviceCategoryId&& $scope.add_info_sub.deviceCategoryId!=0) || !$scope.add_info_sub.code){
			myself_alert.dialog_show("请输入必填项!");
			return;
		}
		$scope.add_info_sub.mainId = $scope.info[0].id;
		acceptance_http.edit_unit_ctrl_sub([$scope.add_info_sub],function(result){
			myself_alert.dialog_show("保存成功!");
			get_sub($scope.info[0].id);
			$scope.add_sub = false;
			init_add_sub();
		});
	};
	//新增一页
	$scope.add_data_btn=function(){
		$scope.info = angular.copy([$scope.add_info]);
		$scope.add_main = true;
		$scope.sub = [];
	};
	//取消
	$scope.cancel_btn=function(){
		$scope.get_list();
		$scope.add_main = false;
	};
	//删除
	$scope.delete_data_btn=function(){
		$rootScope.delete_now = true;
		$rootScope.delete_func = function(){
			acceptance_http.del_unit_info_ctrl({mainId:$scope.info[0].id},function(result){
				myself_alert.dialog_show("删除成功!");
				$scope.get_list();
				$rootScope.delete_now = false;
			});
		}
		
	};
	//子控制器删除
	$scope.delete_sub_ctrl=function(id){
		$rootScope.delete_now = true;
		$rootScope.delete_func = function(){
			acceptance_http.del_unit_ctrl_sub({id:id},function(result){
				myself_alert.dialog_show("删除成功!");
				$scope.get_list();
				$rootScope.delete_now = false;
			});
		}
	};
	//数据初始化
	//主控制器
	function init_add(){
		$scope.add_info = {
	        "contactinfo": "",
	        "maintenanceUnit": "",
	        "position": "",
	        "siteBuildingInfoId": "",
	        "siteBuildingInfoName": "",
	        "siteId": $stateParams.unit_id,
	        "status": 0,
	        "type": "",
	        "useTime": 0
	    }
  	};
  	init_add();
	//子控制器
	function init_add_sub(){
		$scope.add_info_sub = {
	        "code": "",
	        "customerId": $base64.decode($stateParams.unit),
	        "customerSiteId": $stateParams.unit_id,
	        "deviceCategoryId": 0,
	        "mainId": '',
	        "manufacturer": "",
	        "modelName": "",
	        "name": "",
	        "relayId":'',
	        'manufacturerContact':''
		};	
	}
	init_add_sub();
	//选择建筑物
	$scope.select_build=function(){
		for(var i=0;i<$scope.buildings.length;i++){
			if($scope.info[0].siteBuildingInfoId == $scope.buildings[i].id){
				$scope.info[0].name = $scope.buildings[i].name;
			}
		}
	}
	//控制器分类
	$scope.fam_facus_type = all_dic.famFacusType;
	//服务状态
	$scope.service_state = all_dic.serviceState;
	//选择传输装置
	$scope.select_build=function(){
		for(var i=0;i<$scope.buildings.length;i++){
			if($scope.info[0].code == $scope.buildings[i].id){
				$scope.info[0].name = $scope.buildings[i].name;
			}
		}
	}
}]);