/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('checkTaskController', ['$scope','acceptance_http','exp_tool','all_dic','myself_alert','$timeout','foreground_http','$state','$base64','$stateParams',
	function($scope,acceptance_http,exp_tool,all_dic,myself_alert,$timeout,foreground_http,$state,$base64,$stateParams){
	//时分日历
	$("body").on("focusin", ".form_datetime", function(){
	   $(this).datetimepicker({
	    	language:'zh-CN',
	        weekStart: 1,
	        todayBtn:  0,
			autoclose: 1,
			todayHighlight: 1,
			forceParse: 0,
			minuteStep:10,
			format:'yyyy/mm/dd  hh:ii',
			linkField: "mirror_field",
    		linkFormat: "yyyy/mm/dd hh:ii:00",
    		pickerPosition:'top-right',
    		startDate: new Date()
	    });
	});
	function getLocalTime(inputTime) {  
	    var date = new Date(inputTime);
	    var y = date.getFullYear();  
	    var m = date.getMonth() + 1;  
	    m = m < 10 ? ('0' + m) : m;  
	    var d = date.getDate();  
	    d = d < 10 ? ('0' + d) : d;  
	    var h = date.getHours();
	    h = h < 10 ? ('0' + h) : h;
	    var s = date.getMinutes();
	    s = s < 10 ? ('0' + s) : s;
	    return y + '/' + m + '/' + d + ' '+ h + ':'+ s;  
	};
	//未开始的巡检才能开始   已开始的巡检才能结束    如勾选了一开始和未开始  则可开始
//	$scope.tab_list=[	
//		{name:'已完成'},
//		{name:'进行中'}
//	];
	$scope.tab_list=[	
		{name:'完成清单'},
		{name:'任务清单'},
		{name:'进行中'}
	];
	$scope.area_id = "按区域筛选";
	$scope.task_type = '选择任务类型';
	$scope.check_task_pholder_no = "定时查岗";
	$scope.check_task_pholder_ok = "实时查岗";
	$scope.disabled_check = false;
	$scope.done = false;
	$scope.undo = false;
	var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	var limits1 = true;
  	var get_data,param,run_flag;
  	$scope.task_list = [];
	$scope.get_list=function(){
		page_num = page_num+1;
//		if($scope.selected == 0){ //已完成
//			get_data = foreground_http.get_processed_task;
//			param = {customerSiteId:localStorage.unit_id,pageNum:page_num,pageSize:page_size,nameAndCode:$scope.search_key};
//		}else if($scope.selected == 1){ //进行中
//			get_data = foreground_http.get_processing_task;
//			param = {customerSiteId:localStorage.unit_id,pageNum:page_num,pageSize:page_size,nameAndCode:$scope.search_key}
//		}
		
//		if($scope.selected == 0){ //完成清单
//			$scope.recordStatus = 0;
//			get_data = foreground_http.get_processing_task;
//			param = {customerSiteId:localStorage.unit_id,pageNum:page_num,pageSize:page_size,nameAndCode:$scope.search_key,recordStatus:$scope.recordStatus};
//		}else if($scope.selected == 1){ //进行中（子）
//			$scope.recordStatus = 1;
//			var task_type = angular.copy($scope.task_type);
//			if(exp_tool.is_chinese(task_type)){
//				task_type = null
//			}
//			get_data = foreground_http.get_processing_task;
//			param = {customerSiteId:localStorage.unit_id,pageNum:page_num,pageSize:page_size,nameAndCode:$scope.search_key,recordStatus:$scope.recordStatus}
//		}else if($scope.selected == 2){ //任务清单（父）
//			var task_type = angular.copy($scope.task_type);
//			if(exp_tool.is_chinese(task_type)){
//				task_type = null
//			}
//			get_data = foreground_http.get_processed_task;
//			param = {customerSiteId:localStorage.unit_id}
//		}
		if($scope.selected == 0){ //完成清单
			$scope.recordStatus = 0;
			get_data = foreground_http.get_processing_task;
			param = {customerSiteId:localStorage.unit_id,pageNum:page_num,pageSize:page_size,nameAndCode:$scope.search_key,recordStatus:$scope.recordStatus};
		}else if($scope.selected == 1){ //任务清单（父）
			var task_type = angular.copy($scope.task_type);
			if(exp_tool.is_chinese(task_type)){
				task_type = null
			}
			get_data = foreground_http.get_processed_task;
			param = {customerSiteId:localStorage.unit_id}
		}else if($scope.selected == 2){ //进行中（子）
			$scope.recordStatus = 1;
			var task_type = angular.copy($scope.task_type);
			if(exp_tool.is_chinese(task_type)){
				task_type = null
			}
			get_data = foreground_http.get_processing_task;
			param = {customerSiteId:localStorage.unit_id,pageNum:page_num,pageSize:page_size,nameAndCode:$scope.search_key,recordStatus:$scope.recordStatus}
		}
		if(typeof(get_data) == "function"){
			get_data(param,function(result){
				if(result.results){
					$scope.task_list = $scope.task_list.concat(result.results);
					
					if($scope.all_task){
						for(var i=0;i<result.results.length;i++){
		  					result.results[i].selected = true;
		  				}
  					};
				}
				limits = true;
				total_page = result.totalPage;
			})
		}
	};
	$scope.unit_list = [];
	$scope.get_unit = function(){
		acceptance_http.get_unit_info_trans({customerSiteId:localStorage.unit_id,nameAndCode:$scope.search_unit},function(result){
			if(result){
				$scope.unit_list = result;
				
				if($scope.all_unit){
					for(var i=0;i<result.length;i++){
	  					result[i].selected = true;
	  				}
				};
			}
		})
	}
	$scope.get_unit();
	//新建任务显示
	$scope.add_task_btn=function(){
		$scope.disabled_check = false;
		$scope.add_task_show = true;
		$scope.check_task_title = "设置巡检任务";
		$scope.rsearch_unit();
		acceptance_http.get_task_code({},function(result){
			$scope.add_task.taskCode = result;
			console.log($scope.add_task.taskCode)
		})
	};
	//关闭任务显示
	$scope.close_task_btn=function(){
		$scope.add_task_show = false;
		$scope.rsearch_unit();
		$scope.area_id = "按区域筛选";
		$scope.search_unit = "";
		$scope.add_task.taskName = "";
		$scope.add_task.beginTime = "";
		$scope.add_task.intervalTime = "";
		$scope.all_unit = false;
	};
	
	$scope.check_view_detail = function(id){
		$scope.disabled_check = true;
		$scope.check_task_title = "任务详情";
		$scope.add_task_show = true;
		$scope.start_now = true;

		acceptance_http.get_task_info({id:id},function(result){
			$scope.add_task = result;
			$scope.add_task.beginTime = getLocalTime($scope.add_task.beginTime);

			if($scope.add_task.taskName == "实时查岗"){
				$scope.start_now = true;
			} else {
				$scope.start_now = false;
			}		
			$scope.unit_list = result.famDevices;
			
			$scope.all_unit = true;
			for(var i=0;i<$scope.unit_list.length;i++){
				if($scope.all_unit){
					$scope.unit_list[i].selected = true;		
				}else{
					$scope.unit_list[i].selected = false;	
				}
			}
		})
	};
	
	//全选初始化
	$scope.all_task = false;
	//全选
	$scope.select_all = function(){
		$scope.all_task = !$scope.all_task;
		for(var i=0;i<$scope.task_list.length;i++){
			if($scope.all_task){
				$scope.task_list[i].selected = true;
			}else{
				$scope.task_list[i].selected = false;
			}
		}
	};
	//删除任务
	$scope.del_check = function(){
		if(!$scope.tasks_ids.length && (!$scope.task_list.length ||!$scope.all_task)){
			return;
		}
		if($scope.selected !=1){
			return
		}
		var task_type = angular.copy($scope.task_type);
		if(exp_tool.is_chinese(task_type)){
			task_type = null
		}
		if($scope.done == true && $scope.undo == false){
			run_flag = 1;
		}else if($scope.done == false && $scope.undo == true){
			run_flag = 0;
		}else{
			run_flag = null;
		}
		var param = {
			customerId:$base64.decode($stateParams.unit),
			//customerSiteId:localStorage.unit_id,
			ids:$scope.tasks_ids,
			isCheckAll: $scope.all_task, //true
			nameAndCode: $scope.search_key,
		  	//runFlagSelect: run_flag,
		 	//taskTypeId: task_type		
		}
		foreground_http.del_check_task(param,function(result){
			myself_alert.dialog_show("删除成功!");
			$scope.tasks_ids = [];
			$scope.rsearch_list();
		})
	};
	//选择任务
	$scope.tasks_ids = [];
	var task_status = [];
	$scope.select_task = function(l){
		var start = false;
    	var end = false;
    	$scope.can_start = false;
		$scope.can_end = false;
		l.selected = !l.selected;
		if($scope.tasks_ids.length == 0){
			$scope.can_start = false;
			$scope.can_end = false;
		}
		if($.inArray(l.id, $scope.tasks_ids)==-1){
			task_status.push(l.runFlag);
    		$scope.tasks_ids.push(l.id);
    	}else{
    		task_status.splice($.inArray(l.id, $scope.tasks_ids),1);
    		$scope.tasks_ids.splice($.inArray(l.id, $scope.tasks_ids),1);
    	}
    	for(var i=0;i<task_status.length;i++){
    		if(task_status[i] == 1){ //有开始
    			end = true;
    		}else if(task_status[i] == 0){ //有停止
    			start = true;
    		}else if(task_status[i] == -1){
    			end = true;
    			start = true;
    		}
    	}
    	if(start&&$scope.tasks_ids.length){
    		$scope.can_start = true;
    	}
    	if(end&&$scope.tasks_ids.length){
    		$scope.can_end = true;
    	}
	};
	//设置任务列表查询
	$scope.rsearch_list=function(type){
		page_num = 0;
		$scope.task_list = [];
		$scope.unit_ids = [];
		$scope.get_list();
		task_status = [];
	};
	//设置任务列表查询
	$scope.rsearch_unit=function(type){
		$scope.unit_list = [];
		$scope.unit_ids = [];
		$scope.get_unit();
	};
	//开始巡检
	var tips;
	$scope.start_check = function(type){
		if(!$scope.all_task){
			if(type == 1){
				if(!$scope.can_start || !$scope.tasks_ids.length || $scope.selected != 1){
					return;
				}
				tips = '巡检已开始!';
			}else if(type == 0){
				if(!$scope.can_end || !$scope.tasks_ids.length || $scope.selected != 1){
					return;
				}
				tips = '巡检已停止!';
			}
		}else{
			if(!$scope.task_list.length || $scope.selected != 1){
				return;
			}
			if(type == 1){
				tips = '巡检已开始!';
			}else if(type == 0){
				tips = '巡检已停止!';
			}
		}
		var task_type = angular.copy($scope.task_type);
		if(exp_tool.is_chinese(task_type)){
			task_type = null
		}
		if($scope.done == true && $scope.undo == false){
			run_flag = 1;
		}else if($scope.done == false && $scope.undo == true){
			run_flag = 0;
		}else{
			run_flag = null;
		}
		var params = {
			customerId:$base64.decode($stateParams.unit),
			customerSiteId:localStorage.unit_id,
			ids:$scope.tasks_ids,
			isCheckAll: $scope.all_task, //true
			nameAndCode: $scope.search_key,
			runFlag: type,
		  	runFlagSelect: run_flag,
		 	taskTypeId: task_type		
		}
		foreground_http.start_check_task(params,function(result){
			myself_alert.dialog_show(tips);
			$scope.tasks_ids = [];
			$scope.rsearch_list();
		})
	};
	//下拉加载
	function scrollTask(){
		$("#task").mCustomScrollbar({
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
	//下拉加载
	function scrollUnit(){
		$("#unit").mCustomScrollbar({
			theme:"minimal-dark",
			autoHideScrollbar:true,
		});
	};
	$timeout(scrollTask, 10);
	$timeout(scrollUnit, 10);
	//选择单位
	$scope.unit_ids = [];
	$scope.select_unit = function(l){
		l.selected = !l.selected
		if($.inArray(l.id, $scope.unit_ids)==-1){
    		$scope.unit_ids.push(l.id);
    	}else{
    		$scope.unit_ids.splice($.inArray(l.id, $scope.unit_ids),1);
    	}
	};
	//切换菜单
	$scope.show_tab=function(index){
		$scope.selected = index;
		$scope.search_key = null;
		page_num = 0;
		total_page = 0
		limits = true;
		$scope.task_list = [];
		$scope.tasks_ids = []; //选择任务
		task_status = [];
		$scope.done = false; //默认勾选开始未开始
		$scope.undo = false;
		$scope.all_unit = false;
		$scope.all_task = false;
		$scope.get_list();
		$scope.start_now = false;
	};
	$scope.show_tab(0);
	//新增任务
	//先选公司才能添加任务
	$scope.start_task = function(){
		if($scope.unit_ids.length<=0 && !$scope.all_unit){
			return;
		}
		 if(!$scope.add_task.beginTime){
			myself_alert.dialog_show("请输入必填项!");
			return;
		}
		if(!$scope.set_inter){
			if(!$scope.add_task.intervalTime){
				myself_alert.dialog_show("请输入必填项!");
				return;
			}else if(!exp_tool.more_than_zero_int($scope.add_task.intervalTime)){
				myself_alert.dialog_show("间隔查岗时间必须为整数!");
				return;
			}
		}
		$scope.add_task.beginTime = new Date($('#mirror_field').val()).getTime();
		$scope.add_task.isCheckAll = $scope.all_unit;
		if(!$scope.add_task.taskName){
			$scope.add_task.taskName = '定时查岗';
		}
		if(!$scope.add_task.isCheckAll){
			$scope.add_task.deviceIds = $scope.unit_ids;
		}else{
			$scope.add_task.nameAndCode  = $scope.search_key;
		}
		foreground_http.add_check_task($scope.add_task,function(result){
			myself_alert.dialog_show("添加成功!");
			$scope.rsearch_list();
			init_task();
			$scope.all_unit = false;
			$scope.beginTime = null;
			$scope.taskName = null;
			$scope.close_task_btn();
		})
	};
	//全选
	$scope.unit_all = function(){
		$scope.all_unit = !$scope.all_unit;
		for(var i=0;i<$scope.unit_list.length;i++){
			if($scope.all_unit){
				$scope.unit_list[i].selected = true;
			}else{
				$scope.unit_list[i].selected = false;
			}
		}
	};
	//立即开始
	$scope.start_task_now = function(){
		if($scope.unit_ids.length<=0 && !$scope.all_unit){
			return;
		}
		$scope.add_task.isCheckAll = $scope.all_unit;
		if(!$scope.add_task.isCheckAll){
			$scope.add_task.deviceIds = $scope.unit_ids;
		}else{
			$scope.add_task.nameAndCode  = $scope.search_key;
		}
		if(!$scope.add_task.taskName){
			$scope.add_task.taskName = '定时查岗';
		}
		if($scope.start_now == true){
			$scope.add_task.taskName = '实时查岗';
		}
		foreground_http.add_check_task_now($scope.add_task,function(result){
			myself_alert.dialog_show("添加成功!");
			$scope.task_id = '选择任务类型';
			$scope.rsearch_list();
			init_task();
			$scope.start_now = false;
			$scope.all_unit = false;
			$scope.beginTime = null;
			$scope.taskName = null;
			$scope.close_task_btn();
		})
	};
	//新增任务初始化
	function init_task(){
		$scope.add_task = {
			"customerSiteId":localStorage.unit_id,
			"beginTime": null, //开始时间
			"customerId": $base64.decode($stateParams.unit),
//			"deviceIds": "",
			"intervalTime": null, //间隔时间
			"runFlag": 1,//1 运行  0停止
			"taskTypeId": 0, //0巡检  1校时
			"taskName":null,
			"taskCode":null,
		}
	};
	init_task();
	//enter搜索
	$('.enter_press').bind('keypress', function (event) { 
	   	if (event.keyCode == "13") { 
	    	$scope.rsearch_list();
	   	}
	});
	//enter搜索
	$('.unit_press').bind('keypress', function (event) { 
	   	if (event.keyCode == "13") { 
	    	$scope.rsearch_unit();
	   	}
	});
	//查看详情
	$scope.view_detail = function(id){
		$state.go("unitRecordSearch",{recordId:id,view_record:true,'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit})
	};
}]);