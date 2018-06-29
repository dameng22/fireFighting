/**
 * Created by Lxy on 2017/12/24.
 */
app.controller('operatorController', ['$scope','dic_http','$timeout','myself_alert','$filter','$base64','$stateParams',
	function($scope,dic_http,$timeout,myself_alert,$filter,$base64,$stateParams){
	//分页
  	$scope.com_list = [];
  	$scope.undo = false;
	//列表
	$scope.get_list=function(){
		dic_http.get_common_dic({dictionaryType:1,isdisable:$scope.undo},function(result){
			$scope.com_list = $filter("orderBy")(result,"code");
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
		if(!info.dictionaryCode){
			myself_alert.dialog_show("请输入编码!");
			return;
		}else if(!info.dictionaryName){
			myself_alert.dialog_show("请输入名称!");
			return;
		}
		dic_http.modify_common_dic(info,function(result){
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
	//禁用
	$scope.disabled =function(l){
		l.isdisable = !l.isdisable;
		dic_http.modify_common_dic(l,function(result){
			if(l.isdisable){
				myself_alert.dialog_show("已禁用!");
			}else{
				myself_alert.dialog_show("已启用!");
			}
			$scope.get_search();
		})
	}
	//删除
	$scope.del_data = function(id){
		dic_http.delete_common_dic({id:id},function(result){
			if(result.deleteSuccess){
				myself_alert.dialog_show("删除成功!");
				$scope.get_search();
			}else{
				myself_alert.dialog_show("删除失败!");
			}
		})
	};
	function init_data(){
		$scope.add_info = {
			  "dictionaryCode": "",
			  "dictionaryName": "",
			  "dictionaryType": 1,//接口
			  "isdisable": false,
	    };
	}
    init_data();
}]);