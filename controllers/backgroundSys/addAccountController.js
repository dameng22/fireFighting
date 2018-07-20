/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('addAccountController', ['$scope','acceptance_http','all_dic','exp_tool','dic_http','$timeout','background_http','$stateParams','myself_alert','$state','$base64',
	function($scope,acceptance_http,all_dic,exp_tool,dic_http,$timeout,background_http,$stateParams,myself_alert,$state,$base64){
	//后退
	$scope.alert_cancel=function(){
		$state.go("accountManage")
	}
	$scope.acc_type = $stateParams.type_id;
	if(!$stateParams.show_win){
		$state.go("accountManage");
	}
	$scope.change = function(type){
		if($scope.auth_list.customerSiteIds.length>0 || $scope.auth_list.siteRegionIds.length>0){
			return;
		}
		$scope.tab = type;
	}
	var count = 0
	$scope.get_auth = function(){
		count = count+1;
		background_http.get_account_item({"accountId":$stateParams.account_id,"systemRoleName": $stateParams.type_id},function(result){
			$scope.auth_list = result;
			if($scope.auth_list.customerSiteIds.length>0||($scope.acc_type.indexOf('fams_systemuser') != -1)){
				$scope.tab = 1;   
			}else{
				$scope.tab = 0;
			}
			if(count<=1){
				//获取区域
			  	acceptance_http.get_unit_info_areas({customerId:$base64.decode($stateParams.unit)},function(result){
			  		$scope.net_areas = result;
			  	})
			}
		});
	}
	$scope.get_auth();
	//分页
  	var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	$scope.unit_list = [];

  	//获取单位类别
  	//$scope.site_type = all_dic.siteType;
  	$scope.site_type = [];
	dic_http.get_site_type({customerId:$base64.decode($stateParams.unit)},function(result){
        for(var i=0;i<result.length;i++){
            $scope.site_type.push(result[i]);
        }
	});
	//列表
	$scope.get_list=function(){
		page_num = page_num+1;
		var area_id = angular.copy($scope.area_id);
		var type_id = angular.copy($scope.type_id);
		if(exp_tool.is_chinese(area_id)){
			area_id = null
		}
		if(exp_tool.is_chinese(type_id)){
			type_id = null
		}
		acceptance_http.get_unit_info({customerId:$base64.decode($stateParams.unit),pageNum:page_num,pageSize:page_size,regionId:area_id,siteTypeId:type_id,nameAndCode:$scope.search_key,requestFlag:null},function(result){
			$scope.unit_list = $scope.unit_list.concat(result.results);
			limits = true;
			total_page = result.totalPage;
		})
	}
	$scope.get_list()
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
	$scope.area_id = "按区域筛选";
	$scope.type_id = "按单位类别筛选";
	//查询
	$scope.rsearch_list=function(){
		page_num = 0;
		$scope.unit_list = [];
		$scope.get_list();
	};
	//增加    add_account_item   删除  del_account_item   get_account_list获取
	$scope.accounts = function(l,type){
		if(($stateParams.type_id.indexOf('fams_systemuser') != -1)){
			background_http.get_account_list({"accountId": $stateParams.account_id,"systemRoleName": $stateParams.type_id},function(result){
				if(result.length>0&&result[0].id!=l.id){
					return;
				}
				add_delete(l,type)
			})
		}else{
			add_delete(l,type)
		}
	};
	//删除修改
	function add_delete(l,type){
		l.selected = !l.selected;
		var param = {"accountId": $stateParams.account_id,"systemRoleName": $stateParams.type_id};
		if(l.selected){
			if(type == 'site'){
				param.customerSiteId = l.id;
			}else if(type == 'region'){
				param.regionId = l.id;
			}
			background_http.add_account_item(param,function(){
				myself_alert.dialog_show("添加成功!");
				$scope.get_auth();
			})
		}else{
			if(type == 'site'){
				param.siteId = l.id;
			}else if(type == 'region'){
				param.regionId = l.id;
			}
			background_http.del_account_item(param,function(){
				myself_alert.dialog_show("删除成功!");
				$scope.have = false;
				$scope.get_auth();
			})
		}
	}
	//已选择
	$scope.chosen = function(){
		$scope.have = !$scope.have
		if($scope.have){
			//已选中
			limits =false;
			background_http.get_account_list({"accountId": $stateParams.account_id,"systemRoleName": $stateParams.type_id},function(result){
				$scope.unit_list = [];
				$scope.unit_list = result;
				for(var i=0;i<$scope.unit_list.length;i++){
					$scope.unit_list[i].selected = true;
				}
			})
		}else{
			$scope.rsearch_list();
		}
	}
//	//全选
//	$scope.select_all = function(){
//	}
}]);