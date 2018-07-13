/**
 * Created by Lxy on 2018/01/09.
 */
app.controller('pictureController', ['$scope','acceptance_http','all_dic','$state','dic_http','$stateParams','myself_alert','$timeout','$rootScope','$filter',
	function($scope,acceptance_http,all_dic,$state,dic_http,$stateParams,myself_alert,$timeout,$rootScope,$filter){
	$scope.gz_pic_building = true;
	if($rootScope.sys_role == "fams_systemadmin"){
		$scope.gz_pic_building = false;
	}
	//后退
	$scope.alert_cancel=function(){
		$state.go("setUnitOnline",{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit})
	}
	//单位id
	$scope.unit_ids = $stateParams.unit_id;
	var limits = true;
	var page_num = 0;
	var page_size = 20;
	var total_page = 0;
	$scope.info = [];
	$scope.roadside = [];
	var type_ids = [0,1,2];
	//获取详情
	$scope.get_list=function(){
		page_num = page_num+1;
		acceptance_http.get_picture_list({customerSiteId:$stateParams.unit_id,pageNum:1,pageSize:20,pictureTypeIds:[0,1,2]},function(result){
			$scope.info = $scope.info.concat(result.results);
			limits = true;
			total_page = result.totalPage;
		});
		acceptance_http.get_picture_list({customerSiteId:$stateParams.unit_id,pageNum:1,pageSize:20,pictureTypeIds:[3,4,5,6]},function(result){
			$scope.roadside = $scope.roadside.concat(result.results);
			$scope.east = $filter("filter")($scope.roadside,{pictureType:3});
			$scope.west = $filter("filter")($scope.roadside,{pictureType:4});
			$scope.sourth = $filter("filter")($scope.roadside,{pictureType:5});
			$scope.north = $filter("filter")($scope.roadside,{pictureType:6});
			limits = true;
			total_page = result.totalPage;
		});
	};
	$scope.get_list();
	//查询
	$scope.research_list=function(){
		page_num = 0;
		$scope.info = [];
		$scope.get_list();
	};
	//下拉加载
	function scrollDate(){
		$(".fix_time_data").mCustomScrollbar({
			theme:"minimal-dark",
			autoHideScrollbar:true,
			callbacks:{
		        onTotalScroll:function(){
//			        if(limits&&(page_num<total_page)){
//			        	limits = false;
//				        $scope.get_list();
//			    	}
		        },
		        onTotalScrollOffset: 2
		   }
		});
	};
	$timeout(scrollDate, 10);
	//删除
	$scope.del_data = function(id){
		$rootScope.delete_now = true;
		$rootScope.delete_func = function(){
			acceptance_http.del_picture_list({id:id},function(){
				myself_alert.dialog_show("删除成功!");
				$scope.research_list();
				$rootScope.delete_now = false;
			})
		}
	};
	//图片编辑
	var exist = [];
	var diffs;
	$scope.edit_pic = function(type,l){
		$scope.type = type;
		$scope.flag = false;
		if(type == 'edit'){
			$scope.picture_select = $filter("filter")(all_dic.pictureType,{id:l.pictureType});
			$scope.types = l.pictureType;
			$scope.title = l.pictureName;
			$scope.pic_id = l.id;
			$scope.pic_url = l.qiniuName;
			$scope.bulid = l;
		}else if(type == 'add'){
			//图片类型
			exist = [];
			$scope.picture_select = [];
			for(var i=0;i<$scope.info.length;i++){
				exist.push($scope.info[i].pictureType)
			}
			diffs = type_ids.diff(exist);
			for(var j=0;j<diffs.length;j++){
				$scope.picture_select.push(all_dic.pictureType[diffs[j]])
			}
			$scope.types = undefined;
			$scope.title = null;
			$scope.pic_id = null;
			$scope.pic_url = null;
			$scope.bulid = {'roadName':null,'roadWidth':null,'appearanceBuilding':null}
		}
		$scope.show_alert = true;
	}
	//道路编辑
	$scope.road_pic = function(type,l,pic){
		$scope.type = type;
		$scope.flag = false;
		$scope.picture_select = $filter("filter")(all_dic.pictureType,{id:pic});
		if(typeof(l)!='undefined'){
			$scope.types = l.pictureType;
			$scope.title = l.pictureName;
			$scope.pic_id = l.id;
			$scope.pic_url = l.qiniuName;
			$scope.bulid = l;
		}else{
			$scope.types = pic;
			$scope.title = null;
			$scope.pic_id = null;
			$scope.pic_url = null;
			$scope.bulid = {'roadName':null,'roadWidth':null,'appearanceBuilding':null}
		}
		$scope.show_alert = true;
	}
	Array.prototype.diff = function(a) {
	    return this.filter(function(i) {return a.indexOf(i) < 0;});
	};
	$scope.picture_type = all_dic.pictureType;
}]);