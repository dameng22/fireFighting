/**
 * Created by Lxy on 2018/01/09.
 */
app.controller('surfaceController', ['$scope','$rootScope','acceptance_http','all_dic','$state','dic_http','$stateParams','myself_alert','$timeout','$rootScope','$base64', 
function($scope,$rootScope,acceptance_http,all_dic,$state,dic_http,$stateParams,myself_alert,$timeout,$rootScope,$base64){
	//后退
	$scope.alert_cancel=function(){
		$state.go("setUnitOnline",{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit})
	}
	
	//单位id
	$scope.unit_ids = $stateParams.unit_id;
	$scope.isShowFloor = false;
	$scope.isShowCell = true;
	$scope.dot_info = false;
	$scope.remark = "";
	$scope.show_draw_dot = false;
	$scope.dotRemark = false;
	$scope.famPointPosition = [];
	function init_data(){
		$scope.add_info = {
	        "address": {
	            "address": ""
	        },
	        "code": "",
	        "customerId": $base64.decode($stateParams.unit),
	        "customerSiteId": $stateParams.unit_id,
	        "deviceCategoryId": 1,
	        "relayId": ""
	    };
	}
    init_data();
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
		} else {
			$scope.isShowCell = false;
		}
	});
	//获取建筑物层数
	var start = 0;
	$scope.get_cell = function(){
		acceptance_http.get_building_cells({'buildId':$scope.build_id},function(result){
			$scope.floors = result;
			for(var i in $scope.floors){
				var val = $scope.floors[i];
				if(val.buildId){
					$scope.isShowFloor = true;
				} 
			}			
			//初始化
			//start = start + 1;
			if($scope.floors.length>0){
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
		if($scope.floor_id){ //判断如果floor_id为空不调用接口，避免500
			acceptance_http.get_floor_cells({'placeId':$scope.floor_id},function(result){
				$scope.floor_list = result;
			})
			$scope.get_floors_name();
		}
		
	};
	//显示平面图
	$scope.show_surface = function(floor){
		//$scope.add_info.code = "";
		$scope.famPointPosition = [];
		$scope.pictureId = null;
		$scope.selected = floor;
		$scope.dot_info = false;
		acceptance_http.get_cells_pic({'customerSiteId':$stateParams.unit_id,'pictureTypeIds':10,'placeId':$scope.floor_id,'storeyId':floor,'pageNum':1,'pageSize':1},function(result){
			$scope.info = result.results;
			for(var i in $scope.info){
				$scope.pictureId = $scope.info[i].id;
				$scope.famPointPosition = $scope.info[i].famPointPositions;
			}
			
//			if($scope.info.length > 0){
//				if($scope.info.length == 0){//
//					$scope.show_draw_dot = false;
//					$("#img_surface_id").hide();
//				} else if($scope.famPointPosition.length == 0 && $scope.info.length >= 1){
//					$scope.show_draw_dot = true;
//					$("#img_surface_id").show();
//					$scope.dotRemark = false;
//				} else {
//					$scope.show_draw_dot = true;
//					$("#img_surface_id").show();
//				}
//			} else {
//					$scope.show_draw_dot = false;
//					$("#img_surface_id").hide();
//			}
			
		})
	};
	//查询
	$scope.research_list=function(){
		$scope.info = [];
		$scope.show_surface($scope.selected);
		$scope.famPointPosition = [];
		$scope.dot_list = [];
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
				$scope.re_floor.placeName = false;
				$scope.isShowFloor = false;
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
	
	$scope.isClickDot = false;
	//传输设备
	acceptance_http.get_unit_info_trans({customerSiteId:$stateParams.unit_id},function(result){
		$scope.device_list = result;
		for(var i in result){
			$scope.relayId = result[i].id;
		}
		return $scope.relayId;
	});
	
	$scope.drawDot = function(x,y,color,size,num){
	   //新建一个div
//	   var div = "<div class='surface_dot' id='dot_div' style='position:absolute;line-height:33px; border:0;left:"+(x) +"; top:"+(y)+
//		";background-color:"+color+";width:"+size+";height:"+size+";'"+">"+num+"</div>";
//      return div;
//		$scope.famPointPosition.push({
//			'coordinateY' : 55,
//			'coordinateX' :55,
//		});
	};
	
//	$("body").on('mousedown','#dot_div', function(){//事件代理})
	
	$scope.new_dot = function(id,type){
		$scope.dot_info = true;	
	};
	
	$scope.drawPt = function(){
//		$scope.drawDot()
		$scope.isClickDot = true;
		if($scope.dotRemark == true){
			$scope.rename();
			var id = document.getElementById('img_surface_id');
			var le=$("#surface_img_center")[0].offsetLeft-5;
//			var x=event.offsetX+le+'px';
//			var y=event.offsetY+'px';
			var num = Number($scope.add_info.code);
			$scope.add_info.code = num+1;
//			if($scope.add_info.code){
//				$scope.other_code = true;
//			} 
//			if($scope.other_code == true){
//				$scope.add_info.re_code = $scope.add_info.code-1;
//			}
//			var div = $scope.drawDot(x,y,"red",5,num);
//			id.innerHTML += div;
			
			$scope.coor_x = event.offsetX+le;
			$scope.coor_y = event.offsetY;
		}
	};
	
	$scope.rename = function(){
		acceptance_http.get_dot_info_detect({detectorCode:$scope.add_info.code,relayId:$scope.relayId,customerSiteId:$stateParams.unit_id},function(result){
			var info_list = result;
			if(result.id != null){ //重复
				//确认添加	
				$rootScope.add_now = true;
				$rootScope.add_func = function(){
					$rootScope.add_now = false;
					if($scope.isClickDot == true){
						var famPointPosition = {
				            "coordinateX": $scope.coor_x,
						  	"coordinateY": $scope.coor_y,
						  	"pictureId": $scope.pictureId,
						  	"remarks": $scope.remark,
						}
						acceptance_http.edit_unit_info_detect({"code":info_list.code,"customerId":info_list.customerId,
							"customerSiteId":info_list.customerSiteId,"deviceCategoryId":info_list.deviceCategoryId,"relayId":info_list.relayId,
							"famPointPosition":famPointPosition,"id":info_list.id,
							},function(result){
								$scope.dot_list = result;
								$scope.famPointPosition.push(result.famPointPosition);
								myself_alert.dialog_show("保存成功!");	
								$scope.research_list();
						})
					}
				};
				$rootScope.add_cancel = function(){
					$("#dot_div").hide();
					$rootScope.add_now = false;
				};
			} else {
				if($scope.isClickDot == true){
					var famPointPosition = {							
			            "coordinateX": $scope.coor_x,
					  	"coordinateY": $scope.coor_y,
					  	"pictureId": $scope.pictureId,
					  	"remarks": $scope.remark,					        				        
					}
					acceptance_http.edit_unit_info_detect({"famPointPosition":famPointPosition,"code":$scope.add_info.code,
						"customerId":$base64.decode($stateParams.unit),"customerSiteId":$stateParams.unit_id,"deviceCategoryId":1,
						"relayId":$scope.relayId,
						},function(result){
							$scope.dot_list = result;
							$scope.famPointPosition.push(result.famPointPosition);
							myself_alert.dialog_show("保存成功!");	
							$scope.research_list();
					})
				}
				
			}
		});
	};
	$scope.dot_remark = function(){
		$scope.dotRemark = true;
		if($scope.add_info.code == ""){
			myself_alert.dialog_show("请输入设备编号!");
            return;
		} if(isNaN(Number($scope.add_info.code))){
			myself_alert.dialog_show("设备编号请输入数字!");
            return;
		}
	};
	$scope.delete_dot = function(id,$index){
		$rootScope.delete_now = true;
		$rootScope.delete_func = function(){
			acceptance_http.del_dot_info_detect({id:id},function(){
				myself_alert.dialog_show("删除成功!");
				$scope.research_list();
				$rootScope.delete_now = false;
			})
		}
	};
	
	
	//获取设备类型
	$scope.device_types = [
		{'id': '42',
		'name': '线型光电感烟火灾探测器'},
		{'id': '23',
		'name': '手动火灾报警按钮'},
		{'id': '30',
		'name': '感温火灾探测器'},
		{'id': '10',
		'name': '可燃气体探测器'},
		{'id': '24',
		'name': '消火栓按钮'},
	];
	
	$scope.selectTypeChange = function(){
		$scope.famPointPosition = [];
		if($scope.device_type == "42"){
		}
	};
	
}]);