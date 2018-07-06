/**
 * Created by Lxy on 2017/12/9.
 */
app.controller('fireAlarmMonitorController', ['$scope','$location','acceptance_http','myself_alert','all_dic','dic_http','$timeout','$interval','new_fire','$base64','$stateParams',
	function($scope,$location,acceptance_http,myself_alert,all_dic,dic_http,$timeout,$interval,new_fire,$base64,$stateParams){
	//分屏火灾报警监控器
    var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	$scope.fire_list = [];
  	//警情状态处理
    $scope.statusCheck = function(process,end){
    	//processStatusId 0未处理  1待确认  2已处理  -1单位确认  endStateId：0未知火警  1误报火警  2真实火警 3测试火警 
    	switch(process){
			case 0:
				return {texts:'未处理',bg:'fire_alerm_danger',font:'fire_alerm_worse'};
			case 1:
				return {texts:'待确认',bg:'fire_alerm_danger',font:''};
			case -1:
				return {texts:'单位确认',bg:'fire_alerm_danger',font:'fire_alerm_worse'};
			case 2:
				switch(end){
					case 0:
						return {texts:'未知火警',bg:'',font:''};
					case 1:
						return {texts:'误报火警',bg:'',font:''};
					case 2:
						return {texts:'真实火警',bg:'',font:''};
					case 3:
						return {texts:'测试火警',bg:'',font:''};
				}
		}
    };
    //选择单位
    $scope.get_list = function(type){
    	$scope.undo_list = [];
	  	$scope.do_list = [];
		page_num = page_num+1;
		//processStatusId 0未处理  1待确认  2已处理  -1单位确认  terminalStatusId：0自动火警  1确认火警  2紧急火警 
		if($scope.all && $scope.all_units){
			$scope.do_list = [];
			$scope.undo_list = [];
		}
		if($scope.unhandle){
			$scope.undo_list.push(0)
		}
		if($scope.handling){
			$scope.undo_list.push(1)
		}
		if($scope.handled){
			$scope.undo_list.push(-1)
		}
		if($scope.real){
			$scope.do_list.push(0)
		}
		if($scope.fake){
			$scope.do_list.push(1)
		}
		if($scope.test){
			$scope.do_list.push(2)
		}
		acceptance_http.get_fire_alarm({customerId:$base64.decode($stateParams.unit),pageNum:page_num,pageSize:page_size,codeOrName:$scope.search_key,terminalStatusId:$scope.do_list,processStatusId:$scope.undo_list,relayIds:$scope.right_unit},function(result){
			var format_data = result.results;
			if(format_data.length>0){
				for(var i=0;i<format_data.length;i++){
					format_data[i].formatStatus = $scope.statusCheck(format_data[i].processingStatusId,format_data[i].endStateId);
				}
			}
			$scope.fire_list = $scope.fire_list.concat(format_data);
			//如果已勾全选
			if($scope.check_all){
				for(var i=0;i<$scope.fire_list.length;i++){
  					$scope.fire_list[i].selected = true;
  				}
  			};
			limits = true;
			total_page = result.totalPage;
		});
    };
    $scope.get_list();
    $scope.all = true;
    $scope.unit_ids = [];
    $scope.left_unit = [];
    var check_status = [];
    var detail_ids = [];
    $scope.check_all = false;
    $scope.get_search=function(type){
		switch(type){
			case 'all':
				$scope.all = true;
				if($scope.all){
					$scope.unhandle = false;
					$scope.handling = false;
					$scope.handled = false;
					$scope.real = false;
					$scope.fake = false;
					$scope.test = false;
				}
			  break;
			case 'unhandle':
				$scope.unhandle = !$scope.unhandle;
			  break;
			case 'handling':
				$scope.handling = !$scope.handling;
			  break;
			case 'handled':
				$scope.handled = !$scope.handled;
			  break;
			case 'real':
				$scope.real = !$scope.real;
			  break;
			case 'fake':
				$scope.fake = !$scope.fake;
			  break;  
			case 'test':
				$scope.test = !$scope.test;
			  break;
		};
		if(type != 'all'){
			$scope.all = false;
		}
		if(!$scope.unhandle&&!$scope.handling&&!$scope.handled&&!$scope.real&&!$scope.fake&&!$scope.test){
			$scope.all = true;;
		}
		if($scope.unhandle&&$scope.handling&&$scope.handled&&$scope.real&&$scope.fake&&$scope.test){
			$scope.all = true;
			$scope.unhandle = false;
			$scope.handling = false;
			$scope.handled = false;
			$scope.real = false;
			$scope.fake = false;
			$scope.test = false;
		}
		page_num = 0;
		$scope.current_id = null;
		$scope.fire_list = [];
		$scope.unit_ids = []; // 选择单位
		$scope.left_unit = [];
    	check_status = [];// 选择单位
    	detail_ids = [];
    	$scope.check_all = false;
    	$scope.its_code = null;
    	$scope.remark = null;
		$scope.get_list();
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
    //勾选
    $scope.get_ids = function(l){
    	var done = false;
    	var undo = false;
    	var confirm = false;
    	l.selected = !l.selected;
    	if($.inArray(l.id, $scope.unit_ids)==-1){
    		detail_ids.push(l.relay.famCustomerSite.id);
    		check_status.push(l.formatStatus);
    		$scope.left_unit.push(l.relay);
    		$scope.unit_ids.push(l.id);
    	}else{
    		detail_ids.splice($.inArray(l.id, $scope.unit_ids),1);
    		check_status.splice($.inArray(l.id, $scope.unit_ids),1);
    		$scope.left_unit.splice($.inArray(l.id, $scope.unit_ids),1);
    		$scope.unit_ids.splice($.inArray(l.id, $scope.unit_ids),1);
    	}
    	//默认选中左侧第一个
    	if($scope.left_unit.length>0){
    		$scope.its_code = $scope.left_unit[$scope.left_unit.length-1].id;
    	}else{
    		$scope.its_code = null;
    	}
    	if(!$scope.unit_ids.length){
    		$scope.its_true = false;
			$scope.its_wait = false;
			$scope.its_fake = false;
			$scope.its_test = false;
			return;
    	}
    	for(var i=0;i<check_status.length;i++){
    		//processStateId 0未处理  1待确认  2已处理  -1单位确认  endStateId：0未知火警  1误报火警  2真实火警 3测试火警 
    		if(check_status[i].texts == '未知火警' || check_status[i].texts == '误报火警' || check_status[i].texts == '真实火警' || check_status[i].texts == '测试火警'){
    			done = true;
    			break;
    		}else if(check_status[i].texts == '待确认' || check_status[i].texts == '单位确认'){
    			confirm = true;
    		}else{
    			undo = true;
    		}
    	}
    	if(done){
    		$scope.its_true = false;
			$scope.its_wait = false;
			$scope.its_fake = false;
			$scope.its_test = false;
    	}else if(confirm){
    		$scope.its_true = true;
			$scope.its_wait = false;
			$scope.its_fake = true;
			$scope.its_test = true;
    	}else{
    		$scope.its_true = true;
			$scope.its_wait = true;
			$scope.its_fake = true;
			$scope.its_test = true;
    	}
    };
    //处理警情
    var end,status;
	$scope.deal_alarm = function(type){
		if(type == 'true'){
			if(!$scope.its_true || !$scope.unit_ids.length){
				return;
			}
			end = 2;
			status = 2;
		}else if(type == 'wait'){
			if(!$scope.its_wait || !$scope.unit_ids.length){
				return;
			}
			end = 0;
			status = 1;
		}else if(type == 'fake'){
			if(!$scope.its_fake || !$scope.unit_ids.length){
				return;
			}
			end = 1;
			status = 2;
		}else if(type == 'test'){
			if(!$scope.its_test || !$scope.unit_ids.length){
				return;
			}
			end = 3;
			status = 2;
		}
		var params = {
			"isCheckAll":false,
		  	"alterIds": $scope.unit_ids,
		  	"endStateId": end,
		  	"remarks": $scope.remark,
		  	"statusId": status
		};
		acceptance_http.deal_alarms(params,function(result){
			if(result){
				myself_alert.dialog_show("处理成功!");
				$scope.get_right_unit('restore');
				$scope.its_true = false;
				$scope.its_wait = false;
				$scope.its_fake = false;
				$scope.its_test = false;
				$scope.unit_ids = [];
				$scope.left_unit = [];
				check_status = [];
				detail_ids = [];
				$scope.check_all = false;
				$scope.remark = null;
				acceptance_http.get_monitor_count({time:new Date()},function(result){
					$scope.$emit("monitor_count", result);
					new_fire.count = 0;
				});
			}
		});
	};	
	//右侧单位    alertType 0火警  1 故障 2监管
	$scope.all_flag = true;
	$scope.right_unit = [];
    $scope.get_right_unit=function(type){
    	var right_unit_temp = [];
    	if(type == 'all'){
    		$scope.right_unit_srh = null;
    	}
    	acceptance_http.get_alarms_unit({alertType:0,codeOrName:$scope.right_unit_srh},function(result){
	    	$scope.fire_units = result;
	    	if(type == 'srh' || type == 'all'){
	    		$scope.right_unit = [];
	    		$scope.get_search();
	    	}else if(type == 'restore'){
	    		for(var i=0;i<$scope.right_unit.length;i++){
	    			for(var k=0;k<$scope.fire_units.length;k++){
	    				if($scope.right_unit[i] == $scope.fire_units[k].relayId){
	    					$scope.fire_units[k].selected = true;
	    					right_unit_temp.push($scope.fire_units[k].relayId);
	    					break;
	    				}
	    			}
	    		}
	    		$scope.right_unit = right_unit_temp;
	    		if($scope.right_unit.length<=0){
	    			$scope.all_flag = true;
	    		}
	    		$scope.get_search();
	    	}
	    	if(type == 'all'){
	    		$scope.all_flag = true;
	    	}else if(type == 'srh'){
	    		$scope.all_flag = false;
	    	}
	    });
    };
    $scope.get_right_unit('get');
   	//右侧单位勾选  搜索
   	$scope.select_unit = function(l){
   		l.selected = !l.selected;
    	if($.inArray(l.relayId, $scope.right_unit)==-1){
    		$scope.right_unit.push(l.relayId);
    	}else{
    		$scope.right_unit.splice($.inArray(l.relayId, $scope.right_unit),1);
    	}
    	if($scope.right_unit.length == $scope.fire_units.length && $scope.all_flag){
    		for(var i=0;i<$scope.fire_units.length;i++){
    			$scope.fire_units[i].selected = false;
    			$scope.right_unit = [];
    		}
    	}
    	page_num = 0;
		$scope.current_id = null;
		$scope.fire_list = [];
		$scope.unit_ids = []; // 选择单位
		$scope.left_unit = [];
    	check_status = [];// 选择单位
    	detail_ids = [];
    	$scope.check_all = false;
    	$scope.its_code = null;
		$scope.get_list();
   	};
    //警情详情
    $scope.fire_detail = function(){
    	if(!$scope.unit_ids.length){
    		return;
    	}
    	$scope.show_alert = true;
    	acceptance_http.get_fire_alert_info({alertId:$scope.unit_ids[0],customerSiteId:detail_ids[0],requestFlag:4},function(result){
    		$scope.fire_details = result;
    		$timeout($scope.initMap($scope.fire_details.relay),100);
    		$scope.outside = $filter("filter")($scope.fire_details.appearancePicture,function(item){if(item.pictureType == 2){return item}});
    		$scope.surface = $filter("filter")($scope.fire_details.appearancePicture,function(item){if(item.pictureType == 10){return item}});
    	})
    };
    //地图初始化
    $scope.initMap = function (info) {
        var map = new BMap.Map("fireMap");
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
            
            map.addEventListener('zoomend', function(){    //地图更改缩放级别结束时触发触发此事件
            	marker.setPosition(map.getCenter());
      		});
        }
   	};
  	//警情状态  terminalStatusId：0自动火警  1确认火警  2紧急火警 
  	$scope.danger_status = function(id){
  		if(id == 0){
  			return '自动火警';
  		}else if(id == 1){
  			return '确认火警';
  		}else if(id == 2){
  			return '紧急火警 ';
  		}
  	};
  	//enter搜索
	$('.enter_press').bind('keypress', function (event) { 
	   	if (event.keyCode == "13") { 
	    	$scope.get_search('text');
	   	}
	});
  	//enter搜索
	$('.right_enter_press').bind('keypress', function (event) { 
	   	if (event.keyCode == "13") { 
	    	$scope.get_right_unit('srh');
	   	}
	});
	//全选处理
	$scope.deal_alarm_all = function(type){
		if(type == 'true'){
			if(!$scope.check_all || !$scope.fire_list.length || !$scope.undo_list.length){
				return;
			}
			end = 2;
			status = 2;
		}else if(type == 'wait'){
			if(!$scope.check_all || !$scope.fire_list.length || !$scope.undo_list.length || $scope.undo_list.indexOf(-1)!=-1){
				return;
			}
			end = 0;
			status = 1;
		}else if(type == 'fake'){
			if(!$scope.check_all || !$scope.fire_list.length || !$scope.undo_list.length){
				return;
			}
			end = 1;
			status = 2;
		}else if(type == 'test'){
			if(!$scope.check_all || !$scope.fire_list.length || !$scope.undo_list.length){
				return;
			}
			end = 3;
			status = 2;
		}
		var params = {
		    "endStateId":end,
		    "remarks":$scope.remark,
		    "statusId":status,
		    "codeOrNameCheckAll":$scope.search_key,
		    "isCheckAll":true,
		    "processStateIdCheckAll":$scope.undo_list,
		    "relayIdsCheckAll":$scope.right_unit
		}
		$scope.$emit("loading", true);
		acceptance_http.deal_alarms(params,function(result){
			if(result){
				myself_alert.dialog_show("处理成功!");
				$scope.get_right_unit('restore');
				$scope.its_true = false;
				$scope.its_wait = false;
				$scope.its_fake = false;
				$scope.its_test = false;
				$scope.unit_ids = [];
				check_status = [];
				detail_ids = [];
				$scope.check_all = false;
				$scope.remark = null;
				$scope.$emit("loading", false);
				acceptance_http.get_monitor_count({time:new Date()},function(result){
					$scope.$emit("monitor_count", result);
					new_fire.count = 0;
				});
			}else{
				$scope.$emit("loading", false);
			}
		});
	};
	//展开收起
	$scope.show_unit_func = function(){
		$scope.show_unit_btn = !$scope.show_unit_btn;
	}
  	//单位详情
  	$scope.show_unit_detail = function(){
  		if(detail_ids.length<=0){
  			return;
  		}
  		$scope.show_unit_alert = true;
		$scope.current_id = detail_ids[0];
		$scope.current_tab = 0;
		sessionStorage.current_tab = null;
		acceptance_http.get_unit_info_base({id:detail_ids[0]},function(result){
			$scope.base_info = result;
			$scope.unit_name = angular.copy($scope.base_info.name);
		});
		//获取建筑物
		acceptance_http.get_unit_all_build({customerSiteId:detail_ids[0]},function(result){
			$scope.buildings_info = result;
		});
		//传输设备
		acceptance_http.get_unit_info_trans({customerSiteId:detail_ids[0]},function(result){
			$scope.device_list = result;
		});
  	}
	//获取右上角数值
	function get_monitor_data(){
		acceptance_http.get_monitor_count({time:new Date()},function(result){
			$scope.$emit("monitor_count", result);
		});
	};
	get_monitor_data();
	$interval(get_monitor_data, 30000);
	$scope.site_type = all_dic.siteType;
	//全选
  	$scope.select_all = function(){
  		$scope.check_all = !$scope.check_all;
		for(var i=0;i<$scope.fire_list.length;i++){
			if($scope.check_all){
  				$scope.fire_list[i].selected = true;
  			}else{
  				$scope.fire_list[i].selected = false;
  			}
		}
  	};
  	//获取区域
  	acceptance_http.get_unit_info_areas({customerId:$base64.decode($stateParams.unit)},function(result){
  		$scope.net_areas = result;
  	});
}]);