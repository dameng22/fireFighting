/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('locationController', ['$scope','acceptance_http','all_dic','$state','dic_http','$stateParams','myself_alert','$timeout','$rootScope','$base64',
	function($scope,acceptance_http,all_dic,$state,dic_http,$stateParams,myself_alert,$timeout,$rootScope,$base64){
	//后退
	$scope.alert_cancel=function(){
		$state.go("setUnitOnline",{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit})
	}
	//传输设备
	acceptance_http.get_unit_info_trans({customerSiteId:$stateParams.unit_id},function(result){
		$scope.device_list = result;
	});
  	var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	$scope.info = [];
  	//获取详情
	$scope.get_list=function(){
		page_num = page_num+1;
		acceptance_http.get_unit_info_detect({customerSiteId:$stateParams.unit_id,pageNum:1,pageSize:20},function(result){
			$scope.info = $scope.info.concat(result.results);
			limits = true;
			total_page = result.totalPage;
		})
	};
	$scope.get_list();
	//查询
	$scope.research_list=function(){
		page_num = 0;
		$scope.info = [];
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
	//保存
	$scope.save_data_btn=function(info,type){
		acceptance_http.edit_unit_info_detect(info,function(result){
			myself_alert.dialog_show("保存成功!");
			if(type == 'add'){
				$scope.research_list();
				init_data();
			}else{
				info.read = false;
			}
		})
	}
	function init_data(){
		$scope.add_info = {
	        "address": {
	            "address": ""
	        },
	        "code": "",
	        "customerId": $base64.decode($stateParams.unit),
	        "customerSiteId": $stateParams.unit_id,
	        "deviceCategoryId": 1,
	        "relayId": ""
	    };
	}
	$scope.systemSub = 0;
    init_data();
	//获取设备类型
	dic_http.get_device_type({},function(result){
		$scope.device_type = result;
	})
	//子系统类型
	$scope.sub_system = all_dic.subSystem;
	//删除
	$scope.del_data = function(id){
		$rootScope.delete_now = true;
		$rootScope.delete_func = function(){
			acceptance_http.del_unit_info_detect({id:id},function(){
				myself_alert.dialog_show("删除成功!");
				$scope.research_list();
				$rootScope.delete_now = false;
			})
		}
	};
}]);