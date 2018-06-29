/**
 * Created by Lxy on 2017/12/7.
 */
app.controller('setUnitOnlineController', ['$scope','acceptance_http','all_dic','exp_tool','dic_http','$state','myself_alert','$timeout','http_url','$http','$base64','$stateParams',
	function($scope,acceptance_http,all_dic,exp_tool,dic_http,$state,myself_alert,$timeout,http_url,$http,$base64,$stateParams){
	var limits = true;
	var page_num = 0;
  	var page_size = 20;
  	var total_page = 0;
  	$scope.unit_list = [];
  	//获取区域
  	acceptance_http.get_unit_info_areas({customerId:$base64.decode($stateParams.unit)},function(result){
  		$scope.net_areas = result;
  	})
  	//监管等级
	$scope.resistance_rates = all_dic.resistanceRates;
	//耐火等级
	$scope.fire_rates = all_dic.fireRates;
	$scope.trans = function(id){
		if(id == 0){
			return '特级'
		}else if(id == 1){
			return '一级'
		}if(id == 2){
			return '二级'
		}if(id == 3){
			return '三级'
		}
	}
  	//获取单位类别
  	$scope.site_type = all_dic.siteType
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
		acceptance_http.get_unit_info({customerId:$base64.decode($stateParams.unit),pageNum:page_num,pageSize:page_size,regionId:area_id,siteTypeId:null,nameAndCode:$scope.search_key,requestFlag:null},function(result){
			$scope.unit_list = $scope.unit_list.concat(result.results);
			limits = true;
			total_page = result.totalPage;
		})
	}
	$scope.get_list();
	//编辑详情
	$scope.go_detail=function(type,id,index){
		if(typeof(id) == 'undefined'){
			return;
		}
		//当前状态
		if(type!=3){
			$scope.current_unit = index;
		}
		$scope.current_id = id;
		if(type!=1){
			$scope.current_tab = 0;
			$state.go("setUnitDetail.baseInfo",{unit_id:id,'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit})
		}
	}
	//新增
	$scope.add_show=function(){
		$state.go("setUnitDetail.baseInfo",{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit})
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
	$scope.area_id = "按区域筛选";
	$scope.type_id = "按单位类别筛选";
	//下拉查询
	$scope.rsearch_list=function(){
		page_num = 0;
		$scope.unit_list = [];
		$scope.get_list();
	};
	//删除
	$scope.delete_info=function(){
		if(!$scope.current_id){
			return;
		}
		acceptance_http.delete_unit_info({id:$scope.current_id},function(result){
			if(result.delete == "true"){
                myself_alert.dialog_show("删除成功!");
                $scope.rsearch_list();
			} else {
                myself_alert.dialog_show("删除失败!");
			}
		})
	};
	//文件导入
	$("#upload").change(function(e){
		var fd = new FormData();
        var file = e.target.files[0];
        if(!file){
        	return;
        }
        fd.append('file', file);
        $http({
            method:'POST',
            url:http_url + "famExcel/readExcel",
            data: fd,
            headers:  {'Authorization':$base64.decode($stateParams.token),'customer_id':$base64.decode($stateParams.unit),'Content-Type':undefined},
            transformRequest: angular.identity
        }).success(function(result){
        	if(result == '0'){
        		myself_alert.dialog_show("上传成功");
				$scope.rsearch_list();
        	}else if(result == '1'){
        		myself_alert.dialog_show("此单位已存在,请重新上传!");
        	}else if(result == '2'){
        		myself_alert.dialog_show("上传失败,请重新上传!");
        	}
        	$("#upload").val("");
        }).error(function(result){
        	myself_alert.dialog_show("上传失败,请重新上传");
        	$("#upload").val("");
        });
	});
	//enter搜索
	$('.enter_press').bind('keypress', function (event) { 
	   	if (event.keyCode == "13") { 
	    	$scope.rsearch_list();
	   	}
	});
}]);