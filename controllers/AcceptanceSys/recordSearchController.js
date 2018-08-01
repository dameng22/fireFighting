/**
 * Created by Lxy on 2017/12/10.
 */
app.controller('recordSearchController', ['$scope','acceptance_http','exp_tool','myself_alert','all_dic','$timeout','downloadFiles','$stateParams', '$rootScope','$base64','$stateParams','$filter','dic_http','curTime','timeStamp',
	function($scope,acceptance_http,exp_tool,myself_alert,all_dic,$timeout,downloadFiles,$stateParams, $rootScope,$base64,$stateParams,$filter,dic_http,curTime,timeStamp){
	$scope.show_back = $stateParams.view_record;
	
	var nowDate = curTime.nowDate();	
	var inputTime = new Date(nowDate+" "+'00:00:00').getTime();
	var timeStamp = timeStamp.getLocalTime(inputTime);

	//时分日历
   	$(".form_datetime").datetimepicker({
    	language:'zh-CN',
        weekStart: 1,
        todayBtn:  0,
		autoclose: 1,
		todayHighlight: 1,
		forceParse: 0,
		minView:2,
		format:'yyyy/mm/dd',
		endDate: new Date()
   	});
	//菜单
	$scope.tab_list=[
		{name:'火灾报警'},
		{name:'故障信息'},
		{name:'监管报警'},
		{name:'查岗记录'},
		{name:'测试记录'}
	];
	//火警记录状态
	$scope.fire_states=[
		{id:1,name:'误报火警'},
		{id:2,name:'真实火警'},
		{id:3,name:'测试火警'}
	];
	//传输器错误
	$scope.trouble_states = [
		{id:0,name:'传输器'},
		{id:1,name:'控制器'},
		{id:2,name:'探测器'}
	];
	//传输装置错误判断
  	$scope.device_broke = function(l){
		if(l.detectorId){
			return '探测器故障';
		}else if(l.facuId){
			return '控制器故障';
		}else if(l.relayId){
			return '传输器故障';
		}
 	};
	//重置
	$scope.reset_filter = function(){
		$scope.begintime = "";
		$scope.endtime = "";
		$scope.search_key = null;
		$scope.end_state = '警情类型';
		$scope.device_type = '故障类型';
		$scope.regions = '区域';
		$scope.done = false;
		$scope.undo = false;
		$scope.success = false;
		$scope.move = false;
		$scope.search_list();
	}
	//详情
	$scope.go_detail=function(id,alert){
		if($scope.selected == 2){
			return;
		}
		//处理信息
		if($scope.selected == 0){
			acceptance_http.get_alarms_detail({id:alert,requestFlag:4},function(result){
	    		$scope.records_details = result;
	    	})
			acceptance_http.get_fire_alert_info({alertId:alert,customerSiteId:id,requestFlag:4},function(result){
	    		$scope.base_info = result.site;
	    		$timeout($scope.initMap(result.relay),100);
	    		$scope.outside = $filter("filter")(result.appearancePicture,function(item){if(item.pictureType == 2){return item}});
	    		$scope.surface = $filter("filter")(result.appearancePicture,function(item){if(item.pictureType == 10){return item}});
	    	})
		}else if($scope.selected == 1){
			//基本信息
			acceptance_http.get_unit_info_base({id:id},function(result){
				$scope.base_info = result;
			});
			acceptance_http.get_troubles_detail({id:alert,requestFlag:4},function(result){
	    		$scope.records_details = result;
	    	})
		}
		$scope.record_show = true
	}
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
            
//          map.addEventListener('zoomend', function(){    //地图更改缩放级别结束时触发触发此事件
//          	marker.setPosition(map.getCenter());
//    		});
        }
   	};
   	
   	//获取单位类别
   	$scope.site_type = [];	
	dic_http.get_site_type({customerId:$base64.decode($stateParams.unit)},function(result){
        for(var i=0;i<result.length;i++){
            $scope.site_type.push(result[i]);
        }
    });
  	//$scope.site_type = all_dic.siteType
  	
	//分页
	var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	var get_data,param,starttime,endtime;
  	var now = new Date();
  	var format = " "+ now.getHours() +':'+ now.getMinutes() +':'+ now.getSeconds();
  	$scope.record_list = [];
  	var net_status = [];
	var start_time;
	$scope.get_list=function(){
		page_num = page_num+1;
		var region = angular.copy($scope.regions);
		if(exp_tool.is_chinese(region)){
			region = null
		}
		if($scope.selected != 2){
			if($("#start").val()!=''){
				start = new Date($("#start").val()+" "+'00:00:00').getTime();
			}else if($("#start").val() == '' && $scope.isFirst == false){
				$("#start")[0].value = timeStamp;				
				start = new Date(nowDate+" "+'00:00:00').getTime();
			}else if($scope.isFirst == true){
				start = null;
				$("#start")[0].value = "";
			}
			if($("#end").val()!=''){
				end = new Date($("#end").val()+" "+'23:59:59').getTime();
			}else if($("#end").val() == '' && $scope.isFirst == false){
				$("#end")[0].value = timeStamp;				
				end = new Date(nowDate+" "+'23:59:59').getTime();
			}else if($scope.isFirst == true){
				end = null;
				$("#end")[0].value = "";
			}
//			else{
//				end = null;
//			}
			if(start&&end){
				if(start>end){
					myself_alert.dialog_show("开始时间不能大于结束时间!");
					return;
				}
			}
		}
		//console.log($filter("date")(start,'yyyy-MM-dd'));
		if($scope.selected == 0){ //火警报警记录
			var end_state = angular.copy($scope.end_state);
			if(exp_tool.is_chinese(end_state)){
				end_state = null
			}
			if ($rootScope.system_name == '消防监管单位管理系统'){
				get_data = acceptance_http.get_fire_record_systemRole;
			}else {
                get_data = acceptance_http.get_fire_record;
			}
			param = {pageNum:page_num,pageSize:page_size,codeOrName:$scope.search_key,endStateId:end_state,beginUpdateTime:start,lastUpdateTime:end,regionId:region};
		}else if($scope.selected == 1){ //故障信息记录
			var device_type = angular.copy($scope.device_type);
			if(exp_tool.is_chinese(device_type)){
				device_type = null
			}
            if ($rootScope.system_name == '消防监管单位管理系统'){
                get_data = acceptance_http.get_troubles_record_systemRole;
            }else {
                get_data = acceptance_http.get_troubles_record;
            }
			param = {pageNum:page_num,pageSize:page_size,codeOrName:$scope.search_key,deviceType:device_type,beginUpdateTime:start,lastUpdateTime:end,regionId:region};
		}else if($scope.selected == 2){ //监管报警记录
            if ($rootScope.system_name == '消防监管单位管理系统'){
                get_data = acceptance_http.get_supervise_record_systemRole;
            }else {
                get_data = acceptance_http.get_supervise_record;
            }
			param = {codeOrName:$scope.search_key,pageNum:page_num,pageSize:page_size,regionId:region};
		}else if($scope.selected == 3){ //查岗
			if($stateParams.view_record){
				get_data = acceptance_http.get_subs_task;
				param = {recordId:$stateParams.recordId,pageNum:page_num,pageSize:page_size}
			}else{
				net_status = [];
				//1脱岗;2在岗;3未成功
				if($scope.done){
					net_status.push(2);
				}
				if($scope.undo){
					net_status.push(1);
				}
				if($scope.success){
					net_status.push(3);
				}
				if($scope.move){
					net_status.push(4);
				}
				get_data = acceptance_http.get_all_task;
				param = {customerId:$base64.decode($stateParams.unit),pageNum:page_num,pageSize:page_size,nameAndCode:$scope.search_key,taskTypeId:0,checkStatus:net_status,beginTime:start,endTime:end,regionId:region};
			}	
		}else if($scope.selected == 4){ //测试单位
            if ($rootScope.system_name == '消防监管单位管理系统'){
                get_data = acceptance_http.get_test_record_systemRole;
            }else {
                get_data = acceptance_http.get_test_record;
            }
			param = {customerId:$base64.decode($stateParams.unit),pageNum:page_num,pageSize:page_size,nameAndCode:$scope.search_key,testBeginTime:start,testEndTime:end,regionId:region};
		}
		if(typeof(get_data) == "function"){
			$scope.counts = 0;
			$scope.$emit("loading", true);
			get_data(param,function(result){
				if(result.results){
					$scope.record_list = $scope.record_list.concat(result.results);
				}
				limits = true;
				start = null;
				end = null;
				$scope.counts = result.count;
				
				if($scope.isFirst == true){
					$("#start")[0].value = "";
					$("#end")[0].value = "";
				}else if($("#start")[0].value=="" && $scope.isFirst == false){
					$("#start")[0].value = timeStamp;
					$("#end")[0].value = timeStamp;
				}
				total_page = result.totalPage;
				$scope.$emit("loading", false);
			})
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
   	//查询 xy
//	$scope.research_list=function(type){
//		if(type==0){
//			$scope.done = !$scope.done;
//		}else if(type==1){
//			$scope.undo = !$scope.undo;
//		}else if(type==2){
//			$scope.success = !$scope.success;
//		}
//		page_num = 0;
//		total_page = 0;
//		limits = true;
//		$scope.record_list = [];
//		$scope.get_list();
//	};
	//查询按钮 mz
	$scope.isFirst = false;
	$scope.search_list=function(type){		
		if($("#start").val() == ''){
			$("#start")[0].value = "";				
			$scope.isFirst = true;
		} else {
			$scope.isFirst = false;
		}
		if(type==0){
			$scope.done = !$scope.done;
		}else if(type==1){
			$scope.undo = !$scope.undo;
		}else if(type==2){
			$scope.success = !$scope.success;
		}else if(type==3){
			$scope.move = !$scope.move;
		}
		page_num = 0;
		total_page = 0;
		limits = true;
		$scope.record_list = [];
		$scope.get_list();
	};
	//切换菜单
	$scope.show_tab=function(index){
		$("#start")[0].value = timeStamp;
		$("#end")[0].value = timeStamp;
		$scope.regions = "区域";
		$scope.end_state = "警情类型";
		$scope.begintime = "";
		$scope.endtime = "";
		$scope.selected = index;
		$scope.search_key = null;
		page_num = 0;
		total_page = 0;
		limits = true;
		if(index!=3){
			$stateParams.view_record = null;
		}
		$scope.record_list = [];
		$scope.get_list();
	};
	if($stateParams.view_record){
		$scope.show_tab(3);
	}else{
		$scope.show_tab(0);
	}
	//下拉框初始化
	$scope.end_state = '警情类型';
	$scope.device_type = '故障类型';
	$scope.regions = '区域';
	//enter搜索
	$('.enter_press').bind('keypress', function (event) { 
	   	if (event.keyCode == "13") { 
	    	$scope.search_list();
	   	}
	});
	//导出文件
	$scope.download_file = function(){
		var region = angular.copy($scope.regions);
		if(exp_tool.is_chinese(region)){
			region = null
		}
		var urls,params,filenames;
//		if($("#start").val()!=''){
//			start = new Date($("#start").val()+format).getTime();
//		}else{
//			start = null;
//		}
		if($("#start").val()!=''){
				start = new Date($("#start").val()+" "+'00:00:00').getTime();
		}else{
			start = null;
		}
		if($("#end").val()!=''){
			end = new Date($("#end").val()+format).getTime();
		}else{
			end = null;
		}
		if($scope.selected == 0){
			var end_state = angular.copy($scope.end_state);
			if(exp_tool.is_chinese(end_state)){
				end_state = null
			}
			if($rootScope.system_name == '消防监管单位管理系统'){
                urls = "record/exportFireExcels/systemRole";
			}else {
                urls = "record/exportFireExcels";
			}
			params = {beginUpdateTime:start,lastUpdateTime:end,endStateId:end_state,codeOrName:$scope.search_key,regionId:region};
			filenames = "火灾报警记录";
			console.log($filter("date")(start,'yyyy-MM-dd'));
		}else if($scope.selected == 1){
			var device_type = angular.copy($scope.device_type);
			if(exp_tool.is_chinese(device_type)){
				device_type = null
			}
            if($rootScope.system_name == '消防监管单位管理系统'){
                urls = "record/exportMalfunctionExcels/systemRole";
            }else {
                urls = "record/exportMalfunctionExcels";
            }
			params = {beginUpdateTime:start,lastUpdateTime:end,deviceType:device_type,codeOrName:$scope.search_key,regionId:region};
			filenames = "故障信息记录";
		}else if($scope.selected == 3){
			if($stateParams.recordId){
				urls = "famCheckRequests/deviceInfo/exportSubtaskInfoExcels";
				params = {recordId:$stateParams.recordId};
			}else{
				urls = "famCheckRequests/api/v1/record/exportTaskExcels";
				params = {beginTime:start,endTime:end,taskTypeId:0,nameAndCode:$scope.search_key,checkStatus:net_status,regionId:region};
			}
			filenames = "查岗记录";
		}else if($scope.selected == 4){
			if ($rootScope.system_name == '消防监管单位管理系统'){
                urls = "famTestingSiteRecord/exportTestExcels/systemRole";
			}else {
                urls = "famTestingSiteRecord/exportTestExcels";
			}
			params = {customerId:$base64.decode($stateParams.unit),testBeginTime:start,testEndTime:end,nameAndCode:$scope.search_key,regionId:region};
			filenames = "测试单位记录";
		}
        downloadFiles.download(urls,params,'',"GET",filenames);
	}
	//状态显示
   	$scope.show_status = function(status){
   		if(status == 2){
   			return '在岗';
   		}else if(status == 1){
   			return '脱岗';
   		}else if(status == 3){
   			return '未成功';
   		} else if(status == 4){
   			return '运行中';
   		}
   	};
	//获取区域
  	acceptance_http.get_unit_info_areas({customerId:$base64.decode($stateParams.unit)},function(result){
  		$scope.net_areas = result;
  	})
	
}]);