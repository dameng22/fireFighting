/**
 * Created by Lxy on 2017/12/24.
 */
app.controller('logsController', ['$scope','background_http','$timeout','$base64','$stateParams',
	function($scope,background_http,$timeout,$base64,$stateParams){
	//分页
	var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	$scope.logs_list = [];
	//列表
	$scope.get_list=function(){
		page_num = page_num+1;
		param = {customerId:$base64.decode($stateParams.unit),pageNum:page_num,pageSize:page_size,appCode:'fams'};
		if($scope.tab_now == 0){ //登录日志
			get_data = background_http.logs;
		}else if($scope.tab_now == 1){ //操作日志
			get_data = background_http.get_operate_logs;
		}
		if(typeof(get_data) == "function"){
			get_data(param,function(result){
				if(result.results){
					$scope.logs_list = $scope.logs_list.concat(result.results);
				}
				limits = true;
				total_page = result.totalPage;
			})
		}
	}
	$scope.get_list();
	//搜索
	$scope.get_search=function(){
		page_num = 0;
		$scope.logs_list = [];
		$scope.get_list();
	}
	//点击切换
	$scope.show_tab=function(type){
		$scope.tab_now = type;
		page_num = 0;
		total_page = 0
		limits = true;	
		$scope.get_search();
	}
	$scope.show_tab(0);
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
}]);