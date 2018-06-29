/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('buildingInfoController', ['$scope','acceptance_http','all_dic','$state','dic_http','$stateParams','myself_alert','$rootScope',
	function($scope,acceptance_http,all_dic,$state,dic_http,$stateParams,myself_alert,$rootScope){
	//后退
	$scope.alert_cancel=function(){
		$state.go("setUnitOnline",{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit})
	}
	//获取详情
	$scope.get_list=function(){
		acceptance_http.get_unit_info_build({customerSiteId:$stateParams.unit_id,pageNum:$scope.currentPage,pageSize:1},function(result){
			$scope.info = result.results;
			$scope.bigTotalItems = result.count;
			if($scope.info.length<=0){
				$scope.info = angular.copy([$scope.add_info])
			}
		})
	};
	$scope.get_list();
	//获取单位信息
	acceptance_http.get_unit_info_base({id:$stateParams.unit_id},function(result){
		$scope.unit = result;
	});
	//保存
	$scope.save_data_btn=function(){
		if(!$scope.info[0].code || !$scope.info[0].name){
			myself_alert.dialog_show("请输入必填项!");
			return;
		}
		acceptance_http.edit_unit_info_build($scope.info[0],function(result){
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
			acceptance_http.del_unit_info_build({id:$scope.info[0].id},function(result){
				myself_alert.dialog_show("删除成功!");
				$scope.get_list();
				$rootScope.delete_now = false;
			});
		}
	};
	//初始化
	$scope.add_info = {
        "code": "",
        "name": "",
        "companyName": "",
        "buildTime": "",
        "buildingHeight": 0,
        "buildingArea": 0,
        "fireProofDoorQuantity": 0,
        "fireProofDoorTypes": 0,
        "fireShutterDoorQuantity": 0,
        "adjacentBuildings": "",
        "fireControlPosition": "",
        "usingType": 0,
        "floorDownArea": 0,
        "floorDownQuantity": 0,
        "floorUpArea": 0,
        "floorUpQuantity": 0,
        "mainMaterial": "",
        "mainProducts": "",
        "mainStorageForm": "",
        "mainStorageName": "",
        "mainStorageNature": "",
        "mainStorageVolume": 0,
        "mainStorageWeight": 0,
        "buildWorkPeopleBigQuantity": 0,
        "buildWorkPeopleQuantity": 0,
        "refugeArea": "",
        "refugePosition": "",
        "refugeQuantity": 0,
        "tunnelHeight": 0,
        "tunnelLength": 0,
        "safeExitForm": "",
        "safeExitPosition": "",
        "safeExitQuantity": 0,
        "stairForm": 0,
        "stairName": "",
        "stairQuantity": 0,
        "accommodableQuality": 0,
        "fireElevatorsQuantity": 0,
        "fireRisk": 0,
        "resistanceRate": 0,
        "buildingCategory": 0,
        "buildingType": 0,
        "siteId": $stateParams.unit_id
  	}
	//建筑物结构
	$scope.building_structure = all_dic.buildingStructure;
	//建筑物使用性质
	$scope.using_types = all_dic.usingTypes;
	//建筑物类别
	$scope.building_categorys = all_dic.buildingCategorys;
	//建筑物类别
	$scope.fire_risks = all_dic.fireRisks;
	//防火门类型
	$scope.fire_door_types = all_dic.fireProofDoorTypes;
	//楼梯形式
	$scope.stair_forms = all_dic.stairForms;
	//监管等级
	$scope.resistance_rates = all_dic.resistanceRates;
	//耐火等级
	$scope.fire_rates = all_dic.fireRates;
}]);