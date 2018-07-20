/**
 * Created by Lxy on 2017/12/12.
 */
app.controller('baseInfoController', ['$scope','acceptance_http','all_dic','$state','dic_http','$stateParams','myself_alert','$filter','exp_tool','$base64',
	function($scope,acceptance_http,all_dic,$state,dic_http,$stateParams,myself_alert,$filter,exp_tool,$base64){
	//后退
	$scope.alert_cancel=function(){
		$state.go("setUnitOnline",{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit});
	};
	//获取详情
	if($stateParams.unit_id){
		acceptance_http.get_unit_info_base({id:$stateParams.unit_id},function(result){
			$scope.info = result;
			$scope.info.code = $scope.info.code.substring(2);
			//获取子消防中队
			if($scope.info.fireBrigade){
				dic_http.get_sub_bridge({superiorName:$scope.info.fireBrigade.superiorName},function(result){
			  		$scope.fire_bridge = result;
			  	});
			};
		});
	}else{
		init_data();
	};
	//保存
	$scope.save_data_btn=function(){
		if(!$scope.info.code || !$scope.info.shortName || !$scope.info.name || !$scope.info.contactinfo|| !$scope.info.controlRoomContactinfo|| !$scope.info.regionId || ($scope.info.siteTypeId != 0 && !$scope.info.siteTypeId)){
			myself_alert.dialog_show("请输入必填项!");
			return;
		}
		if(!exp_tool.unit_code($scope.info.code)){
			myself_alert.dialog_show("单位编码只能输入数字!");
			return;
		}
		if($scope.info.code.length<5){
			myself_alert.dialog_show("单位编码必须大于或等于5位!");
			return;
		}
		$scope.info.code = $filter("area_code")($scope.info.regionId,$scope.net_areas) + $scope.info.code;
//		for(var i=0;i<$scope.info.contactPersons.length;i++){  //解决contactInfos为null问题
//			$scope.info.contactPersons[i].contactInfos = [{"contactInfo": "","contactInfoType": 1}];
//		}
		acceptance_http.edit_unit_info_base($scope.info,function(result){
			myself_alert.dialog_show("保存成功!");
			$scope.info = result;
			$scope.info.code = $scope.info.code.substring(2);
			if(!$stateParams.unit_id){
				$state.go("setUnitDetail.baseInfo",{unit_id:result.id,'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit})
			}
		})
	};
	//所有消防大队
	dic_http.get_super_bridge({},function(result){
  		$scope.super_bridge = result;
  	});
	//获取子消防中队
	$scope.get_sub_brigade = function(){
		$scope.info.brigadeId = "";
		dic_http.get_sub_bridge({superiorName:$scope.info.fireBrigade.superiorName},function(result){
	  		$scope.fire_bridge = result;
	  	});
	}
	//数据初始化
	function init_data(){
		$scope.info = {
	        "customerId": $base64.decode($stateParams.unit),
	        "name": "",
	        "preCodes":"AB",
	        "code": "",
	        "orgCode": "",
	        "shortName": "",
	        "subordinateRegion": "",
	        "regionId": "",
	        "economicOwnership": "",
	        "networkingState": 0,
	        "supervisionGrade": 0,
	        "brigadeId": "",
	        "contactinfo": "",
	        "zipCode": "",
	        "controlRoomContactinfo": "",
	        "siteTypeId": 0,
	        "famCenterId": "",
	        "competentDepartment": "",
	        "jurisdictionUnit": "",
	        "employeeNumber": 0,
	        "fixedAsset": 0,
	        "areaCovered": 0,
	        "construction": 0,
	        "contactPersons": [
	            {
	                "givenNameOriental": "",
	                "idDocs": [
	                    {
	                        "identificationTypeId": 0,
	                        "idNumber": ""
	                    }
	                ],
	                "contactInfos": [
	                    {
	                        "contactInfo": "",
	                        "contactInfoType": 1
	                    }
	                ],
	                "typeId": 1
	            },
	            {
	                "givenNameOriental": "",
	                "idDocs": [
	                    {
	                        "identificationTypeId": 0,
	                        "idNumber": ""
	                    }
	                ],
	                "contactInfos": [
	                    {
	                        "contactInfo": "",
	                        "contactInfoType": 1
	                    }
	                ],
	                "typeId": 2
	            },
	            {
	                "givenNameOriental": "",
	                "idDocs": [
	                    {
	                        "identificationTypeId": 0,
	                        "idNumber": ""
	                    }
	                ],
	                "contactInfos": [
	                    {
	                        "contactInfo": "",
	                        "contactInfoType": 1
	                    }
	                ],
	                "typeId": 3
	            },
	            {
	                "givenNameOriental": "",
	                "idDocs": [
	                    {
	                        "identificationTypeId": 0,
	                        "idNumber": ""
	                    }
	                ],
	                "contactInfos": [
	                    {
	                        "contactInfo": "",
	                        "contactInfoType": 1
	                    }
	                ],
	                "typeId": 4
	            }
	        ],
	        "address": {
	            "address": "",
	            "longitude": 0,
	            "lattitude": 0
	        }
	  	}
	};
  	//获取区域
  	acceptance_http.get_unit_info_areas({customerId:$base64.decode($stateParams.unit)},function(result){
  		$scope.net_areas = result;
  	})
  	//获取单位类别
  	//$scope.site_type = all_dic.siteType; 
  	$scope.site_type = [];
	dic_http.get_site_type({customerId:$base64.decode($stateParams.unit)},function(result){
        for(var i=0;i<result.length;i++){
            $scope.site_type.push(result[i]);
        }
	});
	//监管等级
	$scope.resistance_rates = all_dic.resistanceRates;
	//联网状态
	$scope.network_state = all_dic.networkState;
	
}]);