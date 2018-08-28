/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('networkUnitController', ['$scope','acceptance_http','all_dic','exp_tool','dic_http','$timeout','myself_alert','$filter','$base64','$stateParams','$rootScope',
	function($scope,acceptance_http,all_dic,exp_tool,dic_http,$timeout,myself_alert,$filter,$base64,$stateParams,$rootScope){
 	$scope.gz_pic_building = true;
	if($rootScope.sys_role == "fams_systemuser"){
		$scope.gz_pic_building = false;
	}
 	$scope.tab_list=[
		{order:0,name:'基本信息'},
//		{order:1,name:'传输装置信息'},
		{order:2,name:'建筑物信息'},
		{order:3,name:'火灾自动报警控制器信息'},
		{order:4,name:'水系统信息'},
		{order:5,name:'室外消防设施信息'},
		{order:6,name:'建筑物内消防设施信息'},
		{order:8,name:'建筑火灾自动报警平面图'},
//		{order:9,name:'重点部位灭火预案'},
		//{order:10,name:'周边道路及外观'},
		{order:10,name:'外观图'},
		{order:11,name:'地理位置'}
	];
	//地图
	var map = new BMap.Map("unitMap");
	if($base64.decode($stateParams.unit) == 'ANLITAI_2017_FAKE'){
		var point = new BMap.Point(113.269616, 23.15995);
	}else{
		var point = new BMap.Point(113.11, 23.05);
	};
    map.centerAndZoom(point, 13);
//  map.setCurrentCity("广州");
    map.enableScrollWheelZoom(true);
	$scope.get_page_data = function(index){
		$scope.show_location = false;
		switch(index){
			case 1://传输装置
				acceptance_http.get_unit_info_trans({customerSiteId:localStorage.unit_id},function(result){
					$scope.info = result;
				})
			  	break;
			case 2://建筑物
				acceptance_http.get_unit_info_build({customerSiteId:localStorage.unit_id,pageNum:$scope.currentPage,pageSize:1},function(result){
					$scope.info = result.results;
					$scope.bigTotalItems = result.count;
					$scope.totalPage = result.totalPage;
				})
			  	break;
			case 3://控制器
				acceptance_http.get_unit_info_ctrl({customerSiteId:localStorage.unit_id,pageNum:$scope.currentPage,pageSize:1},function(result){
					$scope.info = result.results;
					$scope.bigTotalItems = result.count;
					$scope.totalPage = result.totalPage;
					if(typeof($scope.info[0]) != 'undefined' && $scope.info[0].id){
						acceptance_http.get_unit_ctrl_sub({mainId:$scope.info[0].id},function(result){
							$scope.sub = result;
						});
					}else{
						$scope.sub = [];
					}
				})
			  	break;
			case 4://水系统
				acceptance_http.get_unit_info_water({customerSiteId:localStorage.unit_id,pageNum:$scope.currentPage,pageSize:1},function(result){
					$scope.info = result.results;
					$scope.bigTotalItems = result.count;
					$scope.totalPage = result.totalPage;
				})
			  	break;
			case 5://室外
				acceptance_http.get_unit_info_outdoor({customerSiteId:localStorage.unit_id,pageNum:$scope.currentPage,pageSize:1},function(result){
					$scope.info = result.results;
					$scope.bigTotalItems = result.count;
					$scope.totalPage = result.totalPage;
				})
			  	break;
			case 6://室内
				acceptance_http.get_unit_info_indoor({customerSiteId:localStorage.unit_id,pageNum:$scope.currentPage,pageSize:1},function(result){
					$scope.info = result.results;
					$scope.bigTotalItems = result.count;
					$scope.totalPage = result.totalPage;
				})
			  	break;
			case 8://消防图纸
				$scope.picture_type = all_dic.surfaceType;
   				$scope.floors = [];
   				$scope.floor_list=[];
   				$scope.info=[];
   				$scope.re_floor = {};
				//获取建筑物
				acceptance_http.get_unit_all_build({customerSiteId:localStorage.unit_id},function(result){
					$scope.buildings_info = result;
					if($scope.buildings_info.length>0){
						$scope.build_id = $scope.buildings_info[0].id;
						$scope.get_cell();
					}
				});
				//获取建筑物层数
				var start = 0;
				$scope.get_cell = function(){
					acceptance_http.get_building_cells({'buildId':$scope.build_id},function(result){
						$scope.floors = result;
						//初始化
						start = start + 1
						if($scope.floors.length>0&&start<=1){
							$scope.floor_id = $scope.floors[0].id;
							$scope.get_floor();
						}
					})
				};
				$scope.get_floors_name = function(){
					for(var i=0;i<$scope.floors.length;i++){
						if($scope.floors[i].id == $scope.floor_id){
							$scope.re_floor = $scope.floors[i];
						}
					}
					for(var i = $scope.re_floor.floorUpQuantity;i>0;i--){
						$scope.floor_list.push({'index':i,'name':'地上'+i+'层'})
					}
					for(var i = 1;i<=$scope.re_floor.floorDownQuantity;i++){
						$scope.floor_list.push({'index':-i,'name':'地下'+i+'层'})
					}
				};
				//楼层
				$scope.get_floor = function(){
					if($scope.floor_id){
						acceptance_http.get_floor_cells({'placeId':$scope.floor_id},function(result){
							$scope.floor_list = result;
						})
						$scope.get_floors_name();
					}	
				};
				//显示平面图
				$scope.show_surface = function(floor){
					$scope.sur_selected = floor;
					acceptance_http.get_cells_pic({'customerSiteId':localStorage.unit_id,'pictureTypeIds':10,'placeId':$scope.floor_id,'storeyId':floor,'pageNum':1,'pageSize':1},function(result){
						$scope.info = result.results;
						for(var i in $scope.info){
							$scope.pictureId = $scope.info[i].id;
							$scope.famPointPosition = $scope.info[i].famPointPositions;
							if($scope.famPointPosition.length == 0){
								$("#img_surface_id").hide();
								$scope.dot_info = false;
							} else {
								$("#img_surface_id").show();
								$scope.dot_info = true;
							}
						}
						if($scope.info.length == 0){//
							$scope.show_draw_dot = false;
							$scope.famPointPosition = [];
						} else {
							$scope.show_draw_dot = true;				
						}
					})
				};
			  	break;
			case 9://灭火预案
				acceptance_http.get_plan({customerSiteId:localStorage.unit_id,pageNum:1,pageSize:100},function(result){
					$scope.info = result.results;
				})
			  	break;
			case 10://图片
				//图片类型
   				$scope.picture_type = all_dic.pictureType;
				acceptance_http.get_picture_list({customerSiteId:localStorage.unit_id,pageNum:$scope.currentPage,pageSize:100,pictureTypeIds:[0,1,2]},function(result){
					$scope.info = result.results;
					$scope.bigTotalItems = result.count;
				})
				acceptance_http.get_picture_list({customerSiteId:localStorage.unit_id,pageNum:1,pageSize:20,pictureTypeIds:[3,4,5,6]},function(result){
					$scope.roadside = result.results;
					$scope.east = $filter("filter")($scope.roadside,{pictureType:3});
					$scope.west = $filter("filter")($scope.roadside,{pictureType:4});
					$scope.sourth = $filter("filter")($scope.roadside,{pictureType:5});
					$scope.north = $filter("filter")($scope.roadside,{pictureType:6});
				});
			  	break;
			case 11://地理位置
				acceptance_http.get_unit_info_trans({customerSiteId:localStorage.unit_id},function(result){
					$scope.info = result;
					map.clearOverlays();
					angular.forEach(result, function (site, i) {
				    	if(typeof(site.address) != 'undefined'&&site.address){
				            var pt = new BMap.Point(site.address.longitude, site.address.lattitude);
					        var myIcon = new BMap.Icon("images/icon_online.png", new BMap.Size(25, 33));
					        var marker = new BMap.Marker(pt, {icon: myIcon});
					        map.addOverlay(marker);
					        map.panTo(pt);
					        
//					        map.addEventListener('zoomend', function(){    //地图更改缩放级别结束时触发触发此事件
//			                	marker.setPosition(map.getCenter());
//			          		});
				       }
				    })
				});
			  	break;
			default: //基本
				acceptance_http.get_unit_info_base({id:localStorage.unit_id},function(result){
					$scope.info = result;
				})
		}
	}
	//联网单位人员修改
	$scope.save_data_btn=function(){
		acceptance_http.edit_unit_info_base($scope.info,function(result){
			myself_alert.dialog_show("保存成功!");
			$scope.can_edit = false;
		})
	};
	$scope.get_location = function(){
		$scope.show_location = true;
		acceptance_http.get_unit_info_detect({customerSiteId:localStorage.unit_id,pageNum:$scope.currentPage,pageSize:100},function(result){
			$scope.info = result.results;
			$scope.bigTotalItems = result.count;
			$scope.totalPage = 0;
		})
	}
	$scope.show_tab=function(index){
    	$scope.selected = index;
		$scope.get_page_data(index);
	};
	$scope.show_tab(0);
	//基本信息
	acceptance_http.get_unit_info_base({id:localStorage.unit_id},function(result){
		$scope.base_info = result;
		$scope.unit_name = angular.copy($scope.base_info.name);
	});
	//获取建筑物
	acceptance_http.get_unit_all_build({customerSiteId:localStorage.unit_id},function(result){
		$scope.buildings_info = result;
	});
	//传输设备
	acceptance_http.get_unit_info_trans({customerSiteId:localStorage.unit_id},function(result){
		$scope.device_list = result;
	});
	//获取区域
  	acceptance_http.get_unit_info_areas({customerId:$base64.decode($stateParams.unit)},function(result){
  		$scope.net_areas = result;
  	});
  	//获取单位类别
  	//$scope.site_type = all_dic.siteType;
  	//获取单位类别	
  	$scope.site_type = [];
	dic_http.get_site_type({customerId:$base64.decode($stateParams.unit)},function(result){
        for(var i=0;i<result.length;i++){
            $scope.site_type.push(result[i]);
        }
	});
  	
	//监管等级
	$scope.resistance_rates = all_dic.resistanceRates;
	//耐火等级
	$scope.fire_rates = all_dic.fireRates;
	//通讯模式
	dic_http.get_fam_type({customerId:$base64.decode($stateParams.unit),isdisable:false},function(result){
		$scope.communication_mdl = result;
	})
	//建筑物结构
	$scope.building_structure = all_dic.buildingStructure;
	//建筑物使用性质
	$scope.using_types = all_dic.usingTypes;
	//建筑物类别
	$scope.building_categorys = all_dic.buildingCategorys;
	//耐火等级
	$scope.fire_risks = all_dic.fireRisks;
	//防火门类型
	$scope.fire_door_types = all_dic.fireProofDoorTypes;
	//楼梯形式
	$scope.stair_forms = all_dic.stairForms;
	//控制器分类
	$scope.fam_facus_type = all_dic.famFacusType;
	//服务状态
	$scope.service_state = all_dic.serviceState;
	//获取设备类型
	dic_http.get_device_type({},function(result){
		$scope.device_type = result;
	});
	//获取厂商信息
	dic_http.get_manufacturer({customerId:$base64.decode($stateParams.unit),isdisable:false},function(result){
		$scope.manufacturer = result;
	});
	//电信运营商
	$scope.operate_company = all_dic.operateCompany;
	//获取控制器厂商信息
	dic_http.get_manufacturer({customerId:$base64.decode($stateParams.unit),isdisable:false,typeId:1},function(result){
		$scope.ctrl_manu = result;
	});
	acceptance_http.get_api_types({customerId:$base64.decode($stateParams.unit)},function(result){
		$scope.api_types = result;
	});
}]);