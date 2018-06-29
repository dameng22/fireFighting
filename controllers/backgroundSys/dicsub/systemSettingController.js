/**
 * Created by Lxy on 2017/12/24.
 */
app.controller('systemSettingController', ['$scope','foreground_http','$timeout','myself_alert','$filter','$base64','$stateParams','exp_tool',
	function($scope,foreground_http,$timeout,myself_alert,$filter,$base64,$stateParams,exp_tool){
	//分页
  	$scope.com_list = [];
  	$scope.undo = false;
	//列表
	$scope.get_list=function(){
		foreground_http.get_single_setting({code:'fire_time'},function(result){
			$scope.sys_list = result;
		})
	}
	$scope.get_list();
	//搜索
	$scope.get_search=function(){
		$scope.com_list = [];
		$scope.get_list();
	}
	//下拉加载
	function scrollDate(){
		$(".list_data_scroll").mCustomScrollbar({theme:"minimal-dark",autoHideScrollbar:true});
	};
	$timeout(scrollDate, 10);
	//保存
	$scope.save_data_btn=function(info,type){
		if(!info.name){
			myself_alert.dialog_show("请输入名称!");
			return;
		}else if(!info.value){
			myself_alert.dialog_show("请输入值!");
			return;
		}else if(!exp_tool.more_than_zero_int(info.value)){
			myself_alert.dialog_show("值必须为正整数!");
			return;
		}
		foreground_http.modify_sys_setting(info,function(result){
			myself_alert.dialog_show("保存成功!");
			if(type == 'add'){
				$scope.get_search();
				$scope.add_show = false;
				init_data();
			}else{
				info.read = false;
			}
		})
	}
}]);