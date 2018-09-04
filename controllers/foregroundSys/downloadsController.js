/**
 * Created by Lxy on 2017/12/24.
 */
app.controller('downloadsController', ['$scope','foreground_http','$timeout','$filter','myself_alert','superivse_http','$http','$rootScope',
	function($scope,foreground_http,$timeout,$filter,myself_alert,superivse_http,$http,$rootScope){
		if($rootScope.sys_role.indexOf('fams_systemuser')>=0){
			$("#user_img").show();
			$("#supervise_img").hide();
			$("#user_img").css('margin-right','261px');
		}
		if($rootScope.sys_role.indexOf('fams_org')>=0){
			$("#user_img").hide();
			$("#supervise_img").show();
			$("#supervise_img").css('margin-left','261px');
		}
	foreground_http.get_sys_setting({'code':[2,3,4,5]},function(result){
		$scope.contact = result;
		$scope.telephone = $filter('filter')(result,function(item){if(item.code == 5){return item}});
		$scope.cellphone = $filter('filter')(result,function(item){if(item.code == 4){return item}});
		$scope.ios = $filter('filter')(result,function(item){if(item.code == 3){return item}});
		$scope.android = $filter('filter')(result,function(item){if(item.code == 2){return item}});
	});
	$scope.delete_contact = function(index,id,type){
		if(id){
			foreground_http.delete_sys_setting({'id':id})
		}
		if(type == 0){
			$scope.telephone.splice(index,1);
		}else if(type == 1){
			$scope.cellphone.splice(index,1);
		}
		myself_alert.dialog_show("删除成功!");
	};
	var code,name;
	$scope.add_contact = function(type,add_name){
		if(type == 0){//报修电话
			code = 5;
			name = '故障保修电话';
			$scope.telephone.push({'code':code,'value':add_name,'name':name});
			$scope.add_phone = null;
		}else if(type == 1){
			code = 4;
			name = '监控中心电话';
			$scope.cellphone.push({'code':code,'value':add_name,'name':name});
			$scope.add_mobile = null;
		}
	};
	$scope.save = function(){
		var tell = $scope.telephone.concat($scope.cellphone);
		var qcode = $scope.ios.concat($scope.android);
		foreground_http.modify_sys_setting_list(tell.concat(qcode),function(){
			myself_alert.dialog_show("保存成功!");
			$scope.can_edit = false;
		})
	};
	$("#upload_ios").change(function(e){
		$scope.file_list = e.target.files[0];
		if(!/\.(GIF|JPG|PNG|BMP|JPEG)$/.test(($scope.file_list.name).toUpperCase())){
           myself_alert.dialog_show("只能上传图片");
           return;
       	}
		superivse_http.get_upload_token({},function(result){
			if(result.token){
				var fd = new FormData();
				fd.append('file', $scope.file_list);
				fd.append('filename', $scope.file_list.name);
				$http({
					method:'POST',
					url:'http://up-z0.qiniu.com/?token='+result.token, //+'&unique_names=false'
					data: fd,
					headers: {'Content-Type':undefined},
					transformRequest: angular.identity
				}).success(function(result,status){
					$scope.ios[0].value = result.key;
				});
			}
		});
	});
	$("#upload_android").change(function(e){
		$scope.file_list = e.target.files[0];
		if(!/\.(GIF|JPG|PNG|BMP|JPEG)$/.test(($scope.file_list.name).toUpperCase())){
           myself_alert.dialog_show("只能上传图片");
           return;
       	}
		superivse_http.get_upload_token({},function(result){
			if(result.token){
				var fd = new FormData();
				fd.append('file', $scope.file_list);
				fd.append('filename', $scope.file_list.name);
				$http({
					method:'POST',
					url:'http://up-z0.qiniu.com/?token='+result.token, //+'&unique_names=false'
					data: fd,
					headers: {'Content-Type':undefined},
					transformRequest: angular.identity
				}).success(function(result,status){
					$scope.android[0].value = result.key;
				});
			}
		});
	});
}]);