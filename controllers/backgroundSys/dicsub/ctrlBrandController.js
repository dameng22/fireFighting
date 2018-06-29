/**
 * Created by Lxy on 2017/12/24.
 */
app.controller('ctrlBrandController', ['$scope','dic_http','$timeout','myself_alert','$filter','$base64','$stateParams',
	function($scope,dic_http,$timeout,myself_alert,$filter,$base64,$stateParams){
	//分页
	var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	$scope.manu_list = [];
  	$scope.undo = false;
	//列表
	$scope.get_list=function(){
		page_num = page_num+1;
		dic_http.get_manufacturer({customerId:$base64.decode($stateParams.unit),isdisable:$scope.undo,pageNum:page_num,pageSize:page_size,typeId:1},function(result){
			$scope.manu_list = $filter("orderBy")(result,"code");
//			$scope.manu_list = $scope.manu_list.concat(result.results);
//			limits = true;
//			total_page = result.totalPage;
		})
	}
	$scope.get_list();
	//搜索
	$scope.get_search=function(){
		page_num = 0;
		$scope.manu_list = [];
		$scope.get_list();
	}
	//下拉加载
	function scrollDate(){
		$(".list_data_scroll").mCustomScrollbar({
			theme:"minimal-dark",
			autoHideScrollbar:true,
//			callbacks:{
//		        onTotalScroll:function(){
//			        if(limits&&(page_num<total_page)){
//			        	limits = false;
//				        $scope.get_list();
//			    	}
//		        },
//		        onTotalScrollOffset: 2
//		   }
		});
	};
	$timeout(scrollDate, 10);
	//保存
	$scope.save_data_btn=function(info,type){
		if(!info.code){
			myself_alert.dialog_show("请输入编码!");
			return;
		}else if(!info.name){
			myself_alert.dialog_show("请输入名称!");
			return;
		}else if(!info.contactinfo){
			myself_alert.dialog_show("联系方式!");
			return;
		}
		dic_http.modify_manufacturer(info,function(result){
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
		dic_http.disabled_manufacturer([l],function(result){
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
		dic_http.delete_manufacturer({id:id},function(result){
			if(result == 1){
				myself_alert.dialog_show("删除成功!");
				$scope.get_search();
			}else if(result == 0){
				myself_alert.dialog_show("删除失败!");
			}
		})
	};
	function init_data(){
		$scope.add_info = {
			  "code": "",
			  "contactinfo": "",
			  "customerId": $base64.decode($stateParams.unit),
			  "isdisable": false,
			  "name": "",
			  "typeId":1, //0传输器，1控制器
	    };
	}
    init_data();
}]);