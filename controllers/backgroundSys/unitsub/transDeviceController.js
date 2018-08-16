/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('transDeviceController', ['$scope','acceptance_http','all_dic','$state','$stateParams','myself_alert','$timeout','dic_http','$filter','$rootScope','$base64',
	function($scope,acceptance_http,all_dic,$state,$stateParams,myself_alert,$timeout,dic_http,$filter,$rootScope,$base64){
	//后退
	$scope.alert_cancel=function(){
		$state.go("setUnitOnline",{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit});
	};
	//获取详情
	$scope.get_list = function(){
		acceptance_http.get_unit_info_trans({customerSiteId:$stateParams.unit_id},function(result){
			$scope.info = result;
			for(var i = 0;i<$scope.info.length;i++){
				$scope.info[i].modal_list = [];
				$scope.info[i].modal_list.push({id:$scope.info[i].modelId,name:$scope.info[i].modelName});
				$scope.info[i].ctrl_modal_list = [];
				if($scope.info[i].famModel){
					$scope.info[i].ctrl_modal_list.push({id:$scope.info[i].facuModeId,name:$scope.info[i].famModel.name});
				}
			}
		});
	};
	$scope.get_list();
	//获取单位信息
	acceptance_http.get_unit_info_base({id:$stateParams.unit_id},function(result){
		$scope.unit = result;
	});
	//获取厂商信息
	dic_http.get_manufacturer({customerId:$base64.decode($stateParams.unit),isdisable:false},function(result){
		$scope.manufacturer = result;
	});
	//保存
	$scope.save_data_btn=function(type){
		var param;
		var checks = [];
		var flag = false;
		if(type == 'edit'){
			//cmz add
			for(var i = 0; i< $scope.info.length; i++){
				var val = $scope.info[i];
				if(!val.code || !val.name || !val.address.address){
					myself_alert.dialog_show("请输入必填项!");
					return;
				}else if((!val.address.longitude&&val.address.longitude!=0) || (!val.address.lattitude&&val.address.lattitude!=0)){
					myself_alert.dialog_show("请选择经纬度!");
					return;
				}
			}
			param = $scope.info;
		}else if(type == 'add'){
			if(!$scope.add_info.code || !$scope.add_info.name || !$scope.add_info.address.address){
				myself_alert.dialog_show("请输入必填项!");
				return;
			}else if((!$scope.add_info.address.longitude&&$scope.add_info.address.longitude!=0) || (!$scope.add_info.address.lattitude&&$scope.add_info.address.lattitude!=0)){
				myself_alert.dialog_show("请选择经纬度!");
				return;
			}
			param = [$scope.add_info];
		}
		for(var j=0;j<param.length;j++){
			checks.push(createObj(param[j].id,param[j].code))
		}
		acceptance_http.check_trans_code(checks,function(res){
			if(!res[0].checkResult){
				myself_alert.dialog_show("传输装置编码不能重复，请修改!");
			}else{
				acceptance_http.edit_unit_info_trans(param,function(result){
					myself_alert.dialog_show("保存成功!");
//					if(type == 'add'){
//						$scope.add_show=false;
//						$scope.get_list();
//						init_data();
//					}
				});
			}
		});
	};
	//格式化对象
	function createObj(relayId,code) {
		this.relayId = relayId;
		this.code = code;
		return {relayId:this.relayId,code:this.code,customerId:$base64.decode($stateParams.unit)}
	}
	//删除
	$scope.delete_data_btn=function(id){
		$rootScope.delete_now = true;
		$rootScope.delete_func = function(){
			acceptance_http.del_unit_info_trans({id:id},function(result){
				myself_alert.dialog_show("删除成功!");
				$rootScope.delete_now = false;
				$scope.get_list();
			});
		}
	};	
	//数据初始化
	function init_data(){
		$scope.add_info = {
	        "address": {
	            "address": "",
	            "lattitude": null,
	            "longitude": null
	        },
	        "code": "",
	        "netType": 0,
	        "customerId": $base64.decode($stateParams.unit),
	        "customerSiteId": $stateParams.unit_id,
	        "modelName": "",
	        "manufacturerId": "",
	        "modelTypeId": "",
	        "facuManufacturerId":"",
	        "facuModeId":"",
	        "facuApitypeId":"",
	        "installDate":"",
	        "name": "",
	        "famCommunicationMode":{
	        	"ipAddress":"",
	            "subnetMask":"",
	            "dnsAddress":"",
	            "gatewayAddress":"",
	            "operator":"",
	            "phoneNumber":"",
	            "phonecardNumber":""
	        }
	   	};
	}
	init_data();
	//通讯模式
	dic_http.get_fam_type({customerId:$base64.decode($stateParams.unit),isdisable:false},function(result){
		$scope.communication_mdl = result;
	})
	//电信运营商
	$scope.operate_company = all_dic.operateCompany;
	//查询设备型号
	$scope.get_modal = function(l){
		l.modelId = "";
		dic_http.get_fam_modal({manufacturerId:l.manufacturerId},function(result){
			l.modal_list = result;
		})
	};
	//显示地图
	$scope.map_show = function(info){
		$scope.show_map = true;
		$timeout($scope.initMap(info),100);
		$scope.locaiton = info;
		$scope.locaiton_temp = angular.copy($scope.locaiton);
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
            map.panTo(point2);
            var marker = new BMap.Marker(point2);
            map.addOverlay(marker);
        }
        var localSearch = new BMap.LocalSearch(map);
        localSearch.enableAutoViewport();
        $scope.searchLocation = function (infos) {
	        localSearch.setSearchCompleteCallback(function (searchResult) {
	            map.clearOverlays();
	            var poi = searchResult.getPoi(0);
	            infos.address.lattitude = poi.point.lat;
	            infos.address.longitude = poi.point.lng;
	            map.centerAndZoom(poi.point, 15);
	            var marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat));
	            map.addOverlay(marker);
	            $scope.$apply();
	        });
	        localSearch.search(infos.address.address);
	    };
   	};
   	//获取控制器厂商信息
	dic_http.get_manufacturer({customerId:$base64.decode($stateParams.unit),isdisable:false,typeId:1},function(result){
		$scope.ctrl_manu = result;
	});
	acceptance_http.get_api_types({customerId:$base64.decode($stateParams.unit)},function(result){
		$scope.api_types = result;
	});
	//查询设备型号
	$scope.get_ctrl_modal = function(l){
		l.facuModeId = "";
		dic_http.get_fam_modal({manufacturerId:l.facuManufacturerId},function(result){
			l.ctrl_modal_list = result;
		})
	};
   	
   	
}]);