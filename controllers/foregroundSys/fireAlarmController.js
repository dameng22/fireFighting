/**
 * Created by Lxy on 2017/12/24.
 */
app.controller('fireAlarmController', ['$scope','$location','foreground_http','$timeout','acceptance_http','dic_http','$base64','$stateParams',
	function($scope,$location,foreground_http,$timeout,acceptance_http,dic_http,$base64,$stateParams){
    var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	$scope.fire_list = [];
  	//警情状态处理
    $scope.statusCheck = function(process,end){
    	//processStateId 0未处理  1待确认  2已处理  -1单位确认  endStateId：0未知火警  1误报火警  2真实火警 3测试火警 
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
						return {texts:'真实火警',bg:'fire_alerm_danger',font:''};
					case 3:
						return {texts:'测试火警',bg:'',font:''};
				}
		}
    };
//  $scope.real = true;
//  $scope.fake = true;
//  $scope.test = true;
    //选择单位
    $scope.get_list = function(type){
	  	var do_list = [];
		page_num = page_num+1;
		//endStateId：0未知火警  1误报火警  2真实火警 3测试火警 
		if($scope.real){
			do_list.push(2)
		}
		if($scope.fake){
			do_list.push(1)
		}
		if($scope.test){
			do_list.push(3)
		}
		foreground_http.get_unit_fire_alarm({customerSiteId:localStorage.unit_id,pageNum:page_num,pageSize:page_size,codeOrName:$scope.search_key,endStateId:do_list},function(result){
			var format_data = result.results;
			if(format_data.length>0){
				for(var i=0;i<format_data.length;i++){
					format_data[i].formatStatus = $scope.statusCheck(format_data[i].processingStatusId,format_data[i].endStateId);
				}
			}
			$scope.fire_list = $scope.fire_list.concat(format_data);
			limits = true;
			total_page = result.totalPage;
		});
    };
    $scope.get_list();
    $scope.get_search=function(type){
		switch(type){
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
		page_num = 0;
		$scope.fire_list = [];
		$scope.get_list();
	};
    //下拉加载
	function scrollDate(){
		$(".list_data_scroll").mCustomScrollbar({
			theme:"minimal-dark",
//			scrollInertia:350,
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
	//获取传输装置
	acceptance_http.get_unit_info_trans({customerSiteId:localStorage.unit_id},function(result){
		$scope.device_info = result;
	});
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
	//通讯模式
	dic_http.get_fam_type({customerId:$base64.decode($stateParams.unit),isdisable:false},function(result){
		$scope.communication_mdl = result;
	})
}]);