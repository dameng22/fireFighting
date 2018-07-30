/**
 * Created by Lxy on 2017/12/12.
 */
app.controller('accountManageController', ['$scope','background_http','myself_alert','$state','$stateParams','router_state','$timeout','myself_alert','common_http','$rootScope','$base64',
	function($scope,background_http,myself_alert,$state,$stateParams,router_state,$timeout,myself_alert,common_http,$rootScope,$base64){
	//获取左侧角色
	background_http.get_roles_list({'customerId':$base64.decode($stateParams.unit)},function(result){
		$scope.tab_list = result;
		$scope.selected = $scope.tab_list[0].id;
		$scope.get_list();
		$scope.get_sub_role();
	});
	//选中
	var arr;
	$scope.check_menu = function(ids){
		arr = ids.split('_').slice(0,2).join('_');//巡查账号规则
		if($scope.selected.indexOf(arr)!=-1&&($scope.selected.split('_').length == ids.split('_').length)){
			return true;
		}else{
			return false;
		}
	};
	$scope.show_tab=function(links){
		$state.go("accountManage",{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit})
    	$scope.selected = links;
		$scope.search_keys = null;
		$scope.add_show = false;
		page_num = 0;
		total_page = 0;
		limits = true;
		$scope.account_list = [];
		$scope.get_list();
		$scope.get_sub_role();
		init_data();
	};
	//分页
	var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	var get_data,param,role_arr;
  	$scope.account_list = [];
	$scope.get_list=function(){
		page_num = page_num+1;
		role_arr = angular.copy($scope.selected);
		if(role_arr.indexOf('isall')!=-1){
			role_arr = [];
			for(var i=0;i<$scope.sub_role.length-1;i++){
				role_arr.push($scope.sub_role[i].id);
			}
		}
//		background_http.get_account({roleId:role_arr,pageNum:page_num,pageSize:page_size,keyword:$scope.search_keys},function(result){
//			if(result.results){
//				$scope.account_list = $scope.account_list.concat(result.results);
//			}
//			limits = true;
//			total_page = result.totalPage;
//			$scope.item_count = result.count
//		})
		get_data = background_http.get_account;
		param = {roleId:role_arr,pageNum:page_num,pageSize:page_size,keyword:$scope.search_keys};	
		if(typeof(get_data) == "function"){
			$scope.$emit("loading", true);
			get_data(param,function(result){
				if(result.results){
					$scope.account_list = $scope.account_list.concat(result.results);
				}
				limits = true;
				total_page = result.totalPage;
				$scope.item_count = result.count;
				$scope.$emit("loading", false);
			})
		}
	};	
	//子角色
	var temp_role;
	$scope.get_sub_role = function(){
		background_http.get_sub_roles({'customerId':$base64.decode($stateParams.unit),'parentRole':$scope.selected},function(result){
			$scope.sub_role = result;
			if($scope.sub_role.length>0){
				$scope.selected = $scope.sub_role[0].id;
				if($scope.sub_role[0].id.split('_')>2){
					temp_role = $scope.sub_role[0].id.split('_').slice(0,2).join('_')+'_isall'
				}else{
					temp_role = $scope.sub_role[0].id + 'isall'
				}
				$scope.sub_role.push({'id':temp_role,'name':'全部'});
			}
		})
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
   	//查询
	$scope.research_list=function(type){
		page_num = 0;
		total_page = 0;
		limits = true;
		$scope.account_list = [];
		$scope.get_list();
	};	
	//添加 / 保存
	$scope.modify_acc = function(l,type){
		if(!l.username){
			myself_alert.dialog_show("请输入账户ID!");
			return;
		}else if(!l.password&&type != 'edit'){
			myself_alert.dialog_show("请输入密码!");
			return;
		}else if(!l.person.givenNameOriental){
			myself_alert.dialog_show("请输入人员姓名!");
			return;
		}
		if(type == 'add'){
			common_http.user_check(l.username,{},function(result){
				if(result){
					l.password = md5(l.password).toUpperCase();
					background_http.add_account(l,function(result){
						myself_alert.dialog_show("添加成功!");
						$scope.add_show = false;
						$scope.research_list();
						init_data();
					})
				}else{
					myself_alert.dialog_show("账户ID已存在!");
				}
			})
		}else if(type == 'edit'){
			l.password = md5(l.password).toUpperCase();
			if($scope.old_role_id != l.roleId){
				l.oldRoleId = angular.copy($scope.old_role_id);
			}
			background_http.modify_account(l,function(result){
				myself_alert.dialog_show("修改成功!");
				if($scope.old_role_id == l.roleId){
					l.read = false;
				}else{
					$scope.research_list();
				}
			})
		}
	};
	//修改按钮
	$scope.modify_btn = function(l){
		l.read=true;
		$scope.old_role_id = angular.copy(l.roleId);
	}
	//删除
	$scope.del_data = function(l,index){
		background_http.del_account({roleId:l.roleId,userId:l.userId,accountId:l.accountId},function(result){
			if(result.isActive){
				myself_alert.dialog_show("删除成功!");
				$scope.account_list.splice(index,1);
			}else{
				myself_alert.dialog_show("账户已停用,不可删除!");
				//l.isActive = false;
			}
		})
	};
	//启用
	$scope.change_suspend_start_btn = function(id,l){
		background_http.start_using_account({roleId:l.roleId,accountId:l.accountId},function(result){
			myself_alert.dialog_show("启用成功!");
			l.isActive = true;
		})
	};
	//停用
	$scope.change_suspend_stop_btn = function(id,l){
		background_http.suspend_account({roleId:l.roleId,accountId:l.accountId},function(result){
			myself_alert.dialog_show("账户已停用!");
			l.isActive = false;
		})
	};
	//新增
	$scope.add_now = function(){
		$scope.add_show = true;
		$scope.add_info.roleId = $scope.selected;
	};
	//enter搜索
	$('.enter_press').bind('keypress', function (event) { 
	   	if (event.keyCode == "13") { 
	    	$scope.research_list();
	   	}
	});
	function init_data(){
		$scope.add_info = {
		    "username": "",
		    "usernameType": 2,
		    "password":"",
		    "person":{
		        "givenNameOriental":""
		    }
		}
	}
	init_data();
	//查看详情
	$scope.view_auth = function(id,l){
		if(l.read){
			return;
		}
		$state.go("accountManage.addAccount",{account_id:id,type_id:$scope.selected,show_win:'yes'})
	}
	
	
}]);