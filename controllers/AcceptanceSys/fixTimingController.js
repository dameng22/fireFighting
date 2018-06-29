/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('fixTimingController', ['$scope','acceptance_http','$timeout','$base64','$stateParams',
	function($scope,acceptance_http,$timeout,$base64,$stateParams){
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
		linkField: "task_start_time",
		linkFormat: "yyyy/mm/dd hh:ii:ss"
   	});
	//进页面时默认选中三项
	$scope.done = false,$scope.undo = false,$scope.success = false;
	$scope.get_search=function(type){
		if(type==0){
			$scope.done = !$scope.done;
		}else if(type==1){
			$scope.undo = !$scope.undo;
		}else if(type==2){
			$scope.success = !$scope.success;
		}
		page_num = 0;
		$scope.current_id = null;
		$scope.task_online = [];
		$scope.get_list();
	}
	var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	$scope.task_online = [];
	//列表
	var net_status = [];
	var start_time;
	$scope.get_list=function(){
		page_num = page_num+1;
		net_status = [];
		//1未完成;2已完成;3未成功
		if($scope.done){
			net_status.push(2);
		}
		if($scope.undo){
			net_status.push(1);
		}
		if($scope.success){
			net_status.push(3);
		}
		if($('#task_start_time').val() != ''){
			start_time = new Date($('#task_start_time').val()).getTime();
		}
		acceptance_http.get_all_task({customerId:$base64.decode($stateParams.unit),pageNum:page_num,pageSize:page_size,nameAndCode:$scope.search_key,taskTypeId:1,checkStatus:net_status,beginTime:start_time},function(result){
			$scope.task_online = $scope.task_online.concat(result.results);
			limits = true;
			total_page = result.totalPage;
		})
	}
	$scope.get_list();
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
   	//状态显示
   	$scope.show_status = function(status){
   		if(status == 2){
   			return '已完成';
   		}else if(status == 1){
   			return '未完成';
   		}else if(status == 3){
   			return '未成功';
   		}
   	};
   	//enter搜索
	$('.enter_press').bind('keypress', function (event){
	   	if (event.keyCode == "13") { 
	    	$scope.get_search();
	   	}
	});
}]);