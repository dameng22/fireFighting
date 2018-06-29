/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('testUnitController',['$scope','acceptance_http','all_dic','exp_tool','$timeout','myself_alert','$base64','$stateParams',
	function($scope,acceptance_http,all_dic,exp_tool,$timeout,myself_alert,$base64,$stateParams){
	//进页面时默认选中两项
	$scope.get_search=function(){
		page_num = 0;
		$scope.current_id = null;
		$scope.unit_test = [];
		$scope.get_list();
	}
	//type 0新增  1查看
	$scope.alert_show=function(type,id){
		$scope.remark_list = {};
		$scope.current_id = id;
		$scope.type_id = 1; //typeId  0 非测试单位  1 测试单位
		if(type!=3){
			if(!$scope.current_id){
				return;
			}
			$scope.show_type = type;
			$scope.show_alert=true;
			if(type == 1){
				acceptance_http.get_online_remark({deviceId:$scope.current_id,typeId:1,pageNum:1,pageSize:5},function(result){
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
  	$scope.unit_test = [];
	//列表
	$scope.get_list=function(){
		page_num = page_num+1;
		acceptance_http.get_online_test({customerId:$base64.decode($stateParams.unit),pageNum:page_num,pageSize:page_size,status:null,nameAndCode:$scope.search_key},function(result){
			$scope.unit_test = $scope.unit_test.concat(result.results);
			limits = true;
			total_page = result.totalPage;
		})
	}
	$scope.get_list();
	//加入测试
	$scope.remove_test = function(id){
		acceptance_http.remove_test([{"id":id}],function(restult){
			if(restult == 1){
				myself_alert.dialog_show("移除测试单位成功!");
				$scope.get_search();
				acceptance_http.get_unit_info_count({},function(result){
					$scope.$emit("unit_count_tips", result);
				});
			}else{
				myself_alert.dialog_show("移除测试单位失败!");
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
}]);