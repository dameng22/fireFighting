/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('planController', ['$scope','acceptance_http','all_dic','$state','dic_http','$stateParams','myself_alert','$timeout','$rootScope',
	function($scope,acceptance_http,all_dic,$state,dic_http,$stateParams,myself_alert,$timeout,$rootScope){
	//后退
	$scope.alert_cancel=function(){
		$state.go("setUnitOnline",{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit})
	}
	$scope.unit_id = $stateParams.unit_id;
	var limits = true;
	var page_num = 0;
	var page_size = 20;
	var total_page = 0;
	$scope.info = [];
	$scope.info_detail = [];
	//获取详情
	$scope.get_list=function(){
		page_num = page_num+1;
		acceptance_http.get_plan({customerSiteId:$stateParams.unit_id,pageNum:1,pageSize:20},function(result){
			$scope.info = $scope.info.concat(result.results);
			limits = true;
			total_page = result.totalPage;
		})
	};
	$scope.get_list();
	
	$scope.download = function(name,origin){
    	window.open($rootScope.qiuNiuUrl+name+'?attname='+origin);
   };
	
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
	//删除
	$scope.del_data = function(id,index){
		$rootScope.delete_now = true;
		$rootScope.delete_func = function(){
			acceptance_http.del_plan({id:id},function(){
				myself_alert.dialog_show("删除成功!");
				$scope.info.splice(index,1);
				$rootScope.delete_now = false;
			})
		}
	};
	//上传
	$scope.upload = function(){
		$scope.show_type = "add";
		$scope.add_show = true;
	}
	//编辑
	$scope.edit_data = function(l){
		$scope.show_type = "edit";
		$scope.add_data = l;
		$scope.add_show = true;
	}

	
}]);