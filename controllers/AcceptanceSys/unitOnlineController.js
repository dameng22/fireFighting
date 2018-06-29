/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('unitOnlineController', ['$scope','acceptance_http','all_dic','exp_tool','$timeout','myself_alert','downloadFiles','$rootScope','dic_http','$state','$base64','$stateParams',
	function($scope,acceptance_http,all_dic,exp_tool,$timeout,myself_alert,downloadFiles,$rootScope,dic_http,$state,$base64,$stateParams){
	//进页面时默认选中两项
	var net_status;
	$scope.regions = '区域';
	$scope.types = 1;
	$scope.done = false,$scope.undo = false;
	$scope.get_search=function(type){
		if(type==0){
			$scope.done = !$scope.done;
		}else if(type==1){
			$scope.undo = !$scope.undo;
		}
		page_num = 0;
		$scope.current_id = null;
		$scope.unit_online = [];
		$scope.get_list();
	}
	//type 0新增  1查看
	$scope.alert_show=function(type,id){
		$scope.remark_list = {};
		$scope.current_id = id;
		$scope.type_id = 0; //typeId  0 非测试单位  1 测试单位
		if(type!=3){
			if(!$scope.current_id){
				return;
			}
			$scope.show_type = type;
			$scope.show_alert=true;
			if(type == 1){
				acceptance_http.get_online_remark({deviceId:$scope.current_id,typeId:0,pageNum:1,pageSize:5},function(result){
					$scope.remark_list = result;
					$scope.total_page = result.totalPage;
					$scope.current_page = 1;
				});
			}
		}
	}
	var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	var get_data,count_data;
  	$scope.unit_online = [];
	//列表
	var net_status;
	$scope.get_list=function(){
		page_num = page_num+1;
		var region = angular.copy($scope.regions);
		if(exp_tool.is_chinese(region)){
			region = null
		}
		if($scope.done == true && $scope.undo == false){
			net_status = 0;
		}else if($scope.done == false && $scope.undo == true){
			net_status = 1;
		}else{
			net_status = null;
		}
		if($rootScope.system_name == '消防监管单位管理系统'){
	   		get_data = acceptance_http.get_authority_unit;
	   		count_data = acceptance_http.get_region_authority_count;
	   	}else{
	   		get_data = acceptance_http.get_online_unit;
	   		count_data = acceptance_http.get_region_count;
	   	}
   		if(typeof(get_data) == "function"){
			get_data({customerId:$base64.decode($stateParams.unit),pageNum:page_num,pageSize:page_size,status:net_status,nameAndCode:$scope.search_key,regionId:region},function(result){
				$scope.unit_online = $scope.unit_online.concat(result.results);
				limits = true;
				total_page = result.totalPage;
			});
			count_data({regionId:region},function(result){
				$scope.unit_conut = result;
			});
		}
	}
	//加入测试
	$scope.add_test = function(id){
		acceptance_http.add_to_test([{"id":id}],function(restult){
			if(restult == 1){
				myself_alert.dialog_show("加入测试单位成功!");
				var region = angular.copy($scope.regions);
				if(exp_tool.is_chinese(region)){
					region = null
				}
				if($rootScope.system_name == '消防监管单位管理系统'){
					acceptance_http.get_authority_count({},function(result){
						$scope.$emit("unit_count_tips", result);
					});
					acceptance_http.get_region_authority_count({regionId:region},function(result){
						$scope.unit_conut = result;
					});
				}else{
					acceptance_http.get_unit_info_count({},function(result){
						$scope.$emit("unit_count_tips", result);
					});
					acceptance_http.get_region_count({regionId:region},function(result){
						$scope.unit_conut = result;
					});
				}
			}else{
				myself_alert.dialog_show("该单位已加入测试单位!");
			}
		})
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
	$timeout(scrollDate, 10);
	//enter搜索
	$('.enter_press').bind('keypress', function (event) { 
	   	if (event.keyCode == "13") { 
	    	$scope.get_search();
	   	}
	});
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
            var myIcon = new BMap.Icon("images/icon_online.png", new BMap.Size(25, 33));
            map.panTo(point2);
            var marker = new BMap.Marker(point2, {icon: myIcon});
            map.addOverlay(marker);
        }
   	};
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
  	//导出文件
	$scope.download_file = function(){
		var region = angular.copy($scope.regions);
		if(exp_tool.is_chinese(region)){
			region = null
		}
		if($scope.done == true && $scope.undo == false){
			net_status = 0;
		}else if($scope.done == false && $scope.undo == true){
			net_status = 1;
		}else{
			net_status = null;
		}
		var urls,params,filenames;
		urls = "famRelays/exportRelayExcels";
		params = {customerId:$base64.decode($stateParams.unit),status:net_status,nameAndCode:$scope.search_key,regionId:region};
		filenames = "单位在线状态";
        downloadFiles.download(urls,params,'',"GET",filenames);
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
		$scope.get_list();
	};
	$scope.show_tab(0);
	//超级状态
	$scope.super_btn = function(l){
		if(l.superStatus == 1){
			l.superStatus = 0;
		}else if(l.superStatus == 0){
			l.superStatus = 1;
			l.status = 0;
		}
		acceptance_http.modify_super_status('?relayId='+l.id+'&superStatus='+l.superStatus,{},function(result){
			myself_alert.dialog_show("修改成功!");
		})
	};
	$scope.sys_type = $stateParams.sys;
}]);