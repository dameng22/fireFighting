/**
 * Created by Lxy on 2018/01/09.
 */
app.controller('surfaceController', ['$scope','$rootScope','acceptance_http','all_dic','$state','dic_http','$stateParams','myself_alert','$timeout','$rootScope', function($scope,$rootScope,acceptance_http,all_dic,$state,dic_http,$stateParams,myself_alert,$timeout,$rootScope){
	//后退
	$scope.alert_cancel=function(){
		$state.go("setUnitOnline",{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit})
	}
	//单位id
	$scope.unit_ids = $stateParams.unit_id;
	//下拉加载
	function scrollDate(){
		$(".fix_time_data").mCustomScrollbar({theme:"minimal-dark",autoHideScrollbar:true});
	};
	$timeout(scrollDate, 10);
	//图片编辑
	$scope.edit_pic = function(type,l){
		$scope.type = type;
		$scope.flag = false;
		if(type == 'edit'){
			$scope.types = l.pictureType;
			$scope.title = l.pictureName;
			$scope.pic_id = l.id;
			$scope.pic_url = l.qiniuName;
		}else if(type == 'add'){
			$scope.types = undefined;
			$scope.title = null;
			$scope.pic_id = null;
			$scope.pic_url = null;
			$scope.bulid = {'roadName':null,'roadWidth':null,'appearanceBuilding':null}
		}
		$scope.show_alert = true;
	}
	//图片类型
   	$scope.picture_type = all_dic.surfaceType;
   	//图片类型
   	$scope.picture_select = all_dic.surfaceType;
	//获取建筑物
	acceptance_http.get_unit_all_build({customerSiteId:$stateParams.unit_id},function(result){
		$scope.buildings_info = result;
		if($scope.buildings_info.length>0){
			$scope.build_id = $scope.buildings_info[0].id;
			$scope.get_cell();
		}
	});
	//获取建筑物层数
	var start = 0;
	$scope.get_cell = function(){
		acceptance_http.get_building_cells({'buildId':$scope.build_id},function(result){
			$scope.floors = result;
			//初始化
			start = start + 1
			if($scope.floors.length>0&&start<=1){
				$scope.floor_id = $scope.floors[0].id;
				$scope.get_floor();
				$scope.get_floors_name();
			}
		})
	};
	//楼层
	$scope.get_floors_name = function(){
		$scope.floor_list = [];
		for(var i=0;i<$scope.floors.length;i++){
			if($scope.floors[i].id == $scope.floor_id){
				$scope.re_floor = $scope.floors[i];
			}
		}
		for(var i = $scope.re_floor.floorUpQuantity;i>0;i--){
			$scope.floor_list.push({'index':i,'name':'地上'+i+'层'})
		}
		for(var i = 1;i<=$scope.re_floor.floorDownQuantity;i++){
			$scope.floor_list.push({'index':-i,'name':'地下'+i+'层'})
		}
	};
	$scope.get_floor = function(){
		acceptance_http.get_floor_cells({'placeId':$scope.floor_id},function(result){
			$scope.floor_list = result;
		})
		$scope.get_floors_name();
	};
	//显示平面图
	$scope.show_surface = function(floor){
		$scope.selected = floor;
		acceptance_http.get_cells_pic({'customerSiteId':$stateParams.unit_id,'pictureTypeIds':10,'placeId':$scope.floor_id,'storeyId':floor,'pageNum':1,'pageSize':1},function(result){
			$scope.info = result.results;
		})
	};
	//查询
	$scope.research_list=function(){
		$scope.info = [];
		$scope.show_surface($scope.selected);
	};
	//删除图片
	$scope.del_pic = function(id){
		acceptance_http.del_picture_list({'id':id},function(){
			myself_alert.dialog_show("删除成功!");
			$scope.info = [];
		})
	};
	//删除楼栋xy
//	$scope.del_build = function(){
//		acceptance_http.delete_building_cells({id:$scope.floor_id},function(result){
//			myself_alert.dialog_show("删除成功!");
//			start = 0;
//			$scope.floor_id = '';
//			$scope.floor_list = [];
//			$scope.get_cell();
//		})
//	};
	//删除楼栋 cmz
	$scope.del_build = function(){
		$rootScope.delete_now = true;
		$rootScope.delete_func = function(){
			acceptance_http.delete_building_cells({id:$scope.floor_id},function(result){
				myself_alert.dialog_show("删除成功!");
				$scope.research_list();
				$rootScope.delete_now = false;
				start = 0;
				$scope.floor_id = '';
				$scope.floor_list = [];
				$scope.get_cell();
			})
		}
	};
	//删除floor cmz
	$scope.delete_floor = function(id){
		$rootScope.delete_now = true;
		$rootScope.delete_func = function(){
			acceptance_http.delete_floor_cells({id:id},function(result){
				myself_alert.dialog_show("删除成功!");
				$scope.research_list();
				$rootScope.delete_now = false;
				$scope.get_floor();
			})
		}
	};
	//编辑/新增楼栋
	$scope.modify_build = function(id,type){
		var list_l = $scope.floors;
	    for(var i=0;i<list_l.length;i++){
	    	if(id == list_l[i].id){
	    		floor_name = list_l[i].placeName;
	    	}
	    }
		if(type == 'add'){
			$scope.show_build = true;
			$scope.buliding = {'type':type,'floorDownQuantity':null,'floorUpQuantity':null,'placeName':null,'floors':$scope.floors};
		}
		if(type == 'edit'){
			$scope.show_build_edit = true;			
		    $scope.placeName = floor_name;
	        $rootScope.$emit('bulidName',$scope.placeName);
			$scope.buliding = {'id':id,'type':type,'floorDownQuantity':null,'floorUpQuantity':null,'placeName':null,'floors':$scope.floors};
		}
	};

	//编辑/新增楼层
	$scope.modify_floor = function(id, storey, type){
		if(type == 'edit'){			
			var storey_name = "";
			$scope.show_floor_edit = true;			
		    var list_f = $scope.floor_list;
		    for(var i=0;i<list_f.length;i++){
		    	if(id == list_f[i].id){
		    		storey_name = list_f[i].storeyName;
		    	}
		    }
		    $scope.storeyName = storey_name;
			$scope.buliding = {'id':id,'storeyNum':storey,'storeyName':storey_name,'floor_lists':$scope.floor_list};
			$rootScope.$emit('tranName',$scope.storeyName);
		}
		if(type == 'add'){
			$scope.show_floor_child = true;
			storey = storey * 1 + 0.1;
			$scope.buliding = {'id':id,'storeyNum':storey};
			
		}
		if(type == 'add_down'){
			$scope.show_floor_child = true;
			storey = storey * 1 - 0.1;
			$scope.buliding = {'id':id,'storeyNum':storey};
			
		}
	};
}]);