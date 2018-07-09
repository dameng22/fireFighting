/**
 * Created by Lxy on 2017/12/24.
 */
app.controller('phoneListController', ['$scope','background_http','$timeout','myself_alert','dic_http','$stateParams','$rootScope','$base64',
	function($scope,background_http,$timeout,myself_alert,dic_http,$stateParams,$rootScope,$base64){
	//展示
	$rootScope.view_contact = $stateParams.viewType;
	//分页
	var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	var get_data,param
  	$scope.contact_list = [];
	//列表
	$scope.get_list=function(){
		page_num = page_num+1;
		if($scope.tab_now == 2){ //联网单位
			get_data = dic_http.get_unit_phone_list;
			param = {customerId:$base64.decode($stateParams.unit),pageNum:page_num,pageSize:page_size,nameAndCode:$scope.search_key}	
		}else if($scope.tab_now == 0 || $scope.tab_now == 1){ //常用人员/协助单位  //所属类型  0常用人员  1协助单位
			get_data = background_http.get_phone_list;
			param = {customerId:$base64.decode($stateParams.unit),pageNum:page_num,pageSize:page_size,phoneBookType:$scope.tab_now,nameAndJob:$scope.search_key};
		}
		if(typeof(get_data) == "function"){
			$scope.$emit("loading", true);
			get_data(param,function(result){
				$scope.contact_list = $scope.contact_list.concat(result.results);
				limits = true;
				total_page = result.totalPage;
				$scope.$emit("loading", false);
			})
		}
	}
	//搜索
	$scope.get_search=function(){
		page_num = 0;
		$scope.contact_list = [];
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
	//点击切换
	$scope.show_tab=function(type){
		$scope.search_key = null;
		page_num = 0;
		total_page = 0
		limits = true;
		$scope.contact_list = [];
		$scope.tab_now = type;
		$scope.get_search();
	}
	$scope.show_tab(2);
	//enter搜索
	$('.enter_press').bind('keypress', function (event) { 
	   	if (event.keyCode == "13") { 
	    	$scope.get_search();
	   	}
	});
	//保存
	$scope.save_data_btn=function(info,type){
		if(!info.orgName){
			myself_alert.dialog_show("请输入单位名称!");
			return;
		}else if(!info.orgJob){
			myself_alert.dialog_show("请输入职位!");
			return;
		}else if(!info.givenNameOriental){
			myself_alert.dialog_show("请输入姓名!");
			return;
		}else if(!info.contactInfos[0].contactInfo){
			myself_alert.dialog_show("请输入联系方式!");
			return;
		}
		info.contactInfos[0].contactInfoType = 0;
		if(type == 'add'){
			$scope.add_info.phoneBookType = $scope.tab_now;
		}
		background_http.edit_phone_list(info,function(result){
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
	//删除
	$scope.del_data = function(id,index){
		background_http.del_phone_list({id:id},function(){
			myself_alert.dialog_show("删除成功!");
			$scope.contact_list.splice(index,1);
		})
	};
	function init_data(){
		$scope.add_info = {
	        "orgName": "",
	        "orgJob": "",
	        "givenNameOriental": "",
	        "contactInfos": [
		        {
		            "contactInfo":"",
		            "contactInfoType":0,
		            "isUserId":false,
		            "isVerified":false
		        }
		    ],
	        "phoneBookType": 0,
	        "customerId": $base64.decode($stateParams.unit),
	    };
	}
    init_data();
}]);