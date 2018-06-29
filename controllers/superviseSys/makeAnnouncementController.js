/**
 * Created by Lxy on 2017/12/24.
 */
app.controller('makeAnnouncementController', ['$scope','superivse_http','$timeout', 'myself_alert','$rootScope',function($scope,superivse_http,$timeout,myself_alert,$rootScope){
	//发布通知
	$scope.add_notice = function(){
		$scope.show_alert = true;	
	};
	//查看通知
	$scope.view_notice = function(id,l){
		$scope.notice_show = true;
		$scope.notice_item = l;
		superivse_http.get_notice_file({noticeId:id},function(result){
			$scope.notice_detail = result;
		})
	};
	//分页
	var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	$scope.notice_list = [];
	//列表
	$scope.get_list=function(){
		page_num = page_num+1;
		superivse_http.get_notice({pageNum:page_num,pageSize:page_size},function(result){
			$scope.notice_list = $scope.notice_list.concat(result.results);
			limits = true;
			total_page = result.totalPage;
		})
	}
	$scope.get_list();
	//删除
	$scope.delete_msg = function(id){
		$rootScope.delete_now = true;
		$rootScope.delete_func = function(){
			superivse_http.delete_notice({id:id},function(result){
				myself_alert.dialog_show("删除成功!");
				$rootScope.delete_now = false;
				$scope.get_search();
			})
		}
	};
	//搜索
	$scope.get_search=function(){
		page_num = 0;
		$scope.notice_list = [];
		$scope.get_list();
	}
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