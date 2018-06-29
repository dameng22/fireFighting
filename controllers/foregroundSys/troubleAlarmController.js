/**
 * Created by Lxy on 2017/12/24.
 */
app.controller('troubleAlarmController',['$scope','foreground_http','$timeout','exp_tool','acceptance_http','all_dic','myself_alert', function($scope,foreground_http,$timeout,exp_tool,acceptance_http,all_dic,myself_alert){
   	var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	$scope.touble_list = [];
  	$scope.device_types = '设备类型';
  	$scope.trouble_item = '故障类型';
    //选择单位
    $scope.get_list = function(type){
		page_num = page_num+1;
		var device_type = angular.copy($scope.device_types);
		if(exp_tool.is_chinese(device_type)){
			device_type = null
		}
		$scope.tr_item = angular.copy($scope.trouble_item);
		if(exp_tool.is_chinese($scope.tr_item)){
			$scope.tr_item = null
		}
		foreground_http.get_unit_trouble_alarm({customerSiteId:localStorage.unit_id,pageNum:page_num,pageSize:page_size,codeOrName:$scope.search_key,deviceType:device_type,faultTypeId:$scope.tr_item},function(result){
			$scope.touble_list = $scope.touble_list.concat(result.results);
			limits = true;
			total_page = result.totalPage;
		});
    };
    $scope.get_list();
    $scope.get_search=function(){
		page_num = 0;
		$scope.touble_list = [];
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
	//故障类型
	$scope.trouble_type = [
		{id:0,name:'传输器'},
		{id:1,name:'控制器'},
		{id:2,name:'探测器'}
	];
	//故障类型
	$scope.trouble_drop = all_dic.trouble_type;
	//获取传输装置
	acceptance_http.get_unit_info_trans({customerSiteId:localStorage.unit_id},function(result){
		$scope.device_info = result;
	});
	//enter搜索
	$('.enter_press').bind('keypress', function (event) { 
	   	if (event.keyCode == "13") { 
	    	$scope.get_search('text');
	   	}
	});
  	//传输装置错误判断
  	$scope.device_broke = function(l){
		if(l.detectorId){
			return '探测器';
		}else if(l.facuId){
			return '控制器';
		}else if(l.relayId){
			return '传输器';
		}
  	};
  	//勾选
  	$scope.unit_ids = [];
    $scope.get_ids = function(l){
    	l.selected = !l.selected;
    	if($.inArray(l.id, $scope.unit_ids)==-1){
    		$scope.unit_ids.push(l.id);
    	}else{
    		$scope.unit_ids.splice($.inArray(l.id, $scope.unit_ids),1);
    	}
    };
    //处理警情
    var end,status;
	$scope.deal_alarm = function(type){
		if(type == 'true'){
			if(!$scope.unit_ids.length){
				return;
			}
			end = 2;
			status = 2;
		}
		var params = {
			"isCheckAll":false,
		  	"alterIds": $scope.unit_ids,
		  	"endStateId": end,
		  	"statusId": status
		};
		acceptance_http.deal_troubles(params,function(result){
			if(result){
				myself_alert.dialog_show("处理成功!");
				$scope.get_search();
				$scope.dealt = false;
				$scope.unit_ids = [];
			}
		});
	};
}]);