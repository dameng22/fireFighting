/**
 * Created by Lxy on 2017/12/7.
 */
var app=angular.module('login',['services','components','config','base64']);
app.controller('loginController', ['$scope','$http','login','$base64','$rootScope',function ($scope,$http,login,$base64,$rootScope) {
    $('#loginForm').keydown(function (e) {
        if (e.keyCode === 13) {
            $scope.login();
        }
    });
    if(!localStorage.user_type){
    	localStorage.setItem("user_type", JSON.stringify([]));//默认为空
    };
    console.log()
    $scope.login = function (type) {
        if (!$scope.username){
            $scope.error_tishi_text = "用户名不能为空";
            return;
        }
        if (!$scope.pwd){
            $scope.error_tishi_text = "密码不能为空";
            return;
        }
        var data = {
            username:$scope.username,
            password:md5($scope.pwd).toUpperCase(),
        }
        login.entry(data,function(res,transfer){
			if(transfer.status == 200){
		      	$rootScope.sys_token = $base64.encode(res.tokenType + ' ' + res.token);
			    login.user({}, function(result){
					localStorage.time_stamp = new Date().getTime();//监控平台
					var sys_role = result.accounts[0].roleIdentifiers[0];
					var trans = $base64.encode(res.tokenType + ' ' + res.token)+'/'+$base64.encode(result.accounts[0].customerId)+'/'+sys_role;
					var temp = JSON.parse(localStorage.user_type);
					if(temp.indexOf(sys_role)==-1){ //只能登陆一个账户
						temp.push(sys_role);
					}else{
						temp[temp.indexOf(sys_role)] = sys_role;
					}
					localStorage.setItem("user_type", JSON.stringify(temp));
					if(sys_role.indexOf('fams_famadmin')!=-1){
						location.href = "./index.html#/fireAlarm/"+trans;
					}else if(sys_role.indexOf('fams_systemuser')!=-1){
						login.unit({accountId:result.accounts[0].accountId}, function(res){
							localStorage.unit_id = res[0].customerSiteId;	
							login.unit_info({accountId:result.accounts[0].accountId,roleName:result.accounts[0].roleIdentifiers[0]}, function(res){
								localStorage.cus_unit_name = res[0].customerSite.name;
								location.href = "./index.html#/unitCount/"+trans;
							});
						});
						
					}else if(sys_role.indexOf('fams_org')!=-1){
						location.href = "./index.html#/alarmStatistics/"+trans;
					}else if(sys_role.indexOf('fams_systemadmin')!=-1){
						location.href = "./index.html#/unitOnline/"+trans;
					}
			    });
			}
       	},function(error){
       		$scope.error_tips = "用户名或密码错误";
       	})
    };
}]);