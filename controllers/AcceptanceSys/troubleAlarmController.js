/**
 * Created by Lxy on 2017/12/9.
 */
app.controller('troubleAlarmController',['$scope','acceptance_http','myself_alert','exp_tool','all_dic','dic_http','$timeout','$base64','$stateParams',
	function($scope,acceptance_http,myself_alert,exp_tool,all_dic,dic_http,$timeout,$base64,$stateParams){
//	$scope.show_alert = true
   	var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	$scope.touble_list = [];
  	$scope.device_types = '设备类型';
  	$scope.trouble_item = '故障类型';
    //选择单位
    $scope.get_list = function(type){
    	$scope.undo_list = [];
		page_num = page_num+1;
		$scope.de_type = angular.copy($scope.device_types);
		if(exp_tool.is_chinese($scope.de_type)){
			$scope.de_type = null
		}
		$scope.tr_item = angular.copy($scope.trouble_item);
		if(exp_tool.is_chinese($scope.tr_item)){
			$scope.tr_item = null
		}
		//processStateId 0未处理 2处理
		if($scope.all && $scope.all_units){
			$scope.undo_list = [];
		}
		if($scope.undo){
			$scope.undo_list.push(0)
		}
		if($scope.done){
			$scope.undo_list.push(2)
		}
		acceptance_http.get_troubles_list({customerId:$base64.decode($stateParams.unit),pageNum:page_num,pageSize:page_size,codeOrName:$scope.search_key,deviceType:$scope.de_type,processStateId:$scope.undo_list,relayIds:$scope.right_unit,faultTypeId:$scope.tr_item},function(result){
			$scope.touble_list = $scope.touble_list.concat(result.results);
			//如果已勾全选
			if($scope.check_all){
				for(var i=0;i<$scope.touble_list.length;i++){
  					$scope.touble_list[i].selected = true;
  				}
  			};
			limits = true;
			total_page = result.totalPage;
		});
    };
    $scope.get_list();
    $scope.all = true;
    $scope.unit_ids = [];
    var check_status = [];
    var detail_ids = [];
    $scope.check_all = false;
    $scope.get_search=function(type,change){
		switch(type){
			case 'undo':
				$scope.undo = !$scope.undo;
			  break;
			case 'done':
				$scope.done = !$scope.done;
			  break;
		};
		page_num = 0;
		$scope.current_id = null;
		$scope.touble_list = [];
		$scope.unit_ids = []; // 选择单位
    	check_status = [];// 选择单位
    	detail_ids = [];
    	$scope.check_all = false;
    	$scope.remark = null;
		$scope.get_list();
	};
	$scope.get_drop = function(){
		if($scope.device_types == '1'){
			$scope.trouble_drop = all_dic.ctrl_type;
		}else if($scope.device_types == '2'){
			$scope.trouble_drop = all_dic.detect_type;
		}else{
			$scope.trouble_drop = all_dic.trouble_type;
		}
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
    	l.selected = !l.selected;
    	if($.inArray(l.id, $scope.unit_ids)==-1){
    		detail_ids.push(l.relay.famCustomerSite.id);
    		check_status.push(l.processingStatusId);
    		$scope.unit_ids.push(l.id);
    	}else{
    		detail_ids.splice($.inArray(l.id, $scope.unit_ids),1);
    		check_status.splice($.inArray(l.id, $scope.unit_ids),1);
    		$scope.unit_ids.splice($.inArray(l.id, $scope.unit_ids),1);
    	}
    	if(!$scope.unit_ids.length){
    		$scope.dealt = false;
			return;
    	}
    	for(var i=0;i<check_status.length;i++){
    		//processStateId 0未处理  2处理
    		if(check_status[i] == 0){
    			done = true;
    			break;
    		}
    	}
    	if(done){
    		$scope.dealt = true;
    	}
    };
    //处理警情
    var end,status;
	$scope.deal_alarm = function(type){
		if(type == 'true'){
			if(!$scope.dealt || !$scope.unit_ids.length){
				return;
			}
			end = 2;
			status = 2;
		}
		var params = {
			"isCheckAll":false,
		  	"alterIds": $scope.unit_ids,
		  	"endStateId": end,
		  	"remarks": $scope.remark,
		  	"statusId": status
		};
		acceptance_http.deal_troubles(params,function(result){
			if(result){
				myself_alert.dialog_show("处理成功!");
				$scope.get_right_unit('restore');
				$scope.dealt = false;
				$scope.unit_ids = [];
				check_status = [];
				detail_ids = [];
				$scope.check_all = false;
				$scope.remark = null;
				acceptance_http.get_info_count({"clientId":localStorage.time_stamp},function(result){
					$scope.$emit("count_tips", result);
				});
			}
		});
	};	
	//右侧单位    alertType 0火警  1 故障 2监管
	$scope.all_flag = true;
	$scope.right_unit = [];
    $scope.get_right_unit=function(type){
    	var right_unit_temp = [];
    	if(type == 'all' || type == 'get'){
    		$scope.right_unit_srh = null;
    	}
    	acceptance_http.get_alarms_unit({alertType:1,codeOrName:$scope.right_unit_srh},function(result){
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
		$scope.touble_list = [];
		$scope.unit_ids = []; // 选择单位
    	check_status = [];// 选择单位
    	detail_ids = [];
    	$scope.check_all = false;
		$scope.get_list();
   	};
   	//警情详情
    $scope.fire_detail = function(){
    	if(!$scope.unit_ids.length){
    		return;
    	}
    	$scope.show_alert = true;
    	acceptance_http.get_troubles_detail({id:$scope.unit_ids[0],requestFlag:4},function(result){
    		$scope.fire_details = result;
    	})
    };	
	//故障类型
	$scope.trouble_type = [
		{id:0,name:'传输器'},
		{id:1,name:'控制器'},
		{id:2,name:'探测器'}
	];
	//故障类型
	$scope.trouble_drop = all_dic.trouble_type;
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
			if(!$scope.check_all || !$scope.touble_list.length || $scope.undo_list.indexOf(2)!=-1){
				return;
			}
			end = 2;
			status = 2;
		}
		var params = {
			"isCheckAll":true,
		  	"endStateId": end,
		  	"remarks": $scope.remark,
		  	"statusId": status,
		    "codeOrNameCheckAll":$scope.search_key,
		    "processStateIdCheckAll":$scope.undo_list,
		    "relayIdsCheckAll":$scope.right_unit,
		    "deviceTypeCheckAll":$scope.de_type
		};
		$scope.$emit("loading", true);
		acceptance_http.deal_troubles(params,function(result){
			if(result){
				myself_alert.dialog_show("处理成功!");
				$scope.get_right_unit('restore');
				$scope.dealt = false;
				$scope.unit_ids = [];
				check_status = [];
				detail_ids = [];
				$scope.check_all = false;
				$scope.remark = null;
				$scope.$emit("loading", false);
				acceptance_http.get_info_count({"clientId":localStorage.time_stamp},function(result){
					$scope.$emit("count_tips", result);
				});
			}else{
				$scope.$emit("loading", false);
			}
		});
	};	
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
  	};
  	//传输装置错误判断
//	$scope.device_broke = function(l){
//		if(l.detectorId){
//			return '探测器故障';
//		}else if(l.facuId){
//			return '控制器故障';
//		}else if(l.relayId){
//			return '传输器故障';
//		}
//	};
	$scope.device_broke = function(l){
		if(l.detectorId){
			return '探测器';
		}else if(l.facuId){
			return '控制器';
		}else if(l.relayId){
			return '传输器';
		}
  	};
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
}]);