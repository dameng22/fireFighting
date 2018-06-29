/**
 * Created by Lxy on 2017/12/7.
 */
var app = angular.module('myApp', ['ui.bootstrap', 'oc.lazyLoad', 'angular-loading-bar', 'ngAnimate', 'ngTouch', 'services', 'routers', 'filters', 'components', 'config','base64']);

app.config(["$provide", "$compileProvider", "$controllerProvider", "$filterProvider","$httpProvider",
	function ($provide, $compileProvider, $controllerProvider, $filterProvider,$httpProvider) {
		app.controller = $controllerProvider.register;
		app.directive = $compileProvider.directive;
		app.filter = $filterProvider.register;
		app.factory = $provide.factory;
		app.service = $provide.service;
		app.constant = $provide.constant;
	}
]);
app.run(['$rootScope','router_state','$state','menu_list','trans','navData','login',
    function($rootScope,router_state,$state,menu_list,trans,navData,login){
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        	router_state.state = toState.name;
            $rootScope.router_state = toState.name;
            $rootScope.sub_state = toState.name;
            $rootScope.real_state = toState.name;
            
            if($rootScope.router_state.indexOf("setUnitDetail")>-1){
            	$rootScope.router_state = 'setUnitOnline'; 
            }
            if($rootScope.router_state.indexOf("dictionary")>-1){
            	$rootScope.router_state = 'dictionary'; 
            }
            if($rootScope.sub_state.indexOf("setUnitDetail.surface")>-1){
            	$rootScope.sub_state = 'setUnitDetail.surface'; 
            }
            if(toState.redirectTo){
		        event.preventDefault();
		        $state.go(toState.redirectTo, toParams)
		    }
            if(!navData.data){
            	login.user({}, function(result){
					$rootScope.users_name = result.userDisplayName;
                    navData.user = result.userDisplayName;
					navData.data = result.accounts[0].permissionMap;
					$rootScope.unitList = trans.currentTree(menu_list,navData.data);
			    });
            }else{
                $rootScope.users_name = navData.user;
            	$rootScope.unitList = trans.currentTree(menu_list,navData.data);
            } 
        });
    }
]);
app.controller('mainController', ['$scope','$state','$location','acceptance_http','exp_tool','$rootScope','$interval','new_fire','router_state','qiniu_url','$http','weather','$stateParams','login','$base64',
	function ($scope,$state,$location,acceptance_http,exp_tool,$rootScope,$interval,new_fire,router_state,qiniu_url,$http,weather,$stateParams,login,$base64) {
    var sys = $location.path().split('/');
   	$rootScope.sys_role = sys[sys.length-1];
   	$rootScope.sys_unit = sys[sys.length-2];
   	$rootScope.sys_token = sys[sys.length-3];
    //菜单跳转
    $scope.current_menu=function(list){
   		$state.go(list,{'token':$scope.sys_token,'sys':$scope.sys_role,'unit':$scope.sys_unit},{reload:true});
    };
    //七牛地址
    $rootScope.qiuNiuUrl = qiniu_url;
    //当前用户
    $scope.cus_unit_name = localStorage.cus_unit_name;//联网单位名称
	//地图新开窗跳转
	$scope.open_window = function(type){
		var route_names;
		if(type == 'map'){
			route_names = '#/fullScreenMap'+'/'+$scope.sys_token+'/'+$scope.sys_unit+'/'+$scope.sys_role;
		}else if(type == 'contact'){
			route_names = '#/phoneList/view'+'/'+$scope.sys_token+'/'+$scope.sys_unit+'/'+$scope.sys_role;
		}
        var url = $location.absUrl().split("#/")[0]+route_names; 
        window.open(url,"_blank"); 
    }; 
	//左侧导航在线数量
	$scope.show_notes=function(links){
		if(links == 'fireAlarm' || links == 'troubleAlarm' || links == 'testUnit'){// || links == 'unitOnline'
			return true
		}
	};
	//修改密码下拉菜单
		$scope.modify_pwd_show = false;
	$scope.show_modify_pwd=function(){
		$scope.modify_pwd_show = !$scope.modify_pwd_show;
	};
	//修改密码弹窗
	$scope.show_pwd_revise=function(){
		$scope.pwd_show = true;
	}
	//换岗弹框
	$scope.show_relieve_guard=function(){
		$scope.guard_show = true;
	}
	//退出
	$scope.log_out = function(){
		var temp = JSON.parse(localStorage.user_type);
		temp.splice(temp.indexOf($rootScope.sys_role),1);
		localStorage.setItem("user_type", JSON.stringify(temp));
		location.href="./login.html";
	}
	//左侧树数量 alarm火警  allOnline全部在线  malfunction故障 online在线   testFire测试
	$scope.new_fire_num = 0;
	function get_nav_tips(){
		if(router_state.state == 'fireAlarmMonitor' || $rootScope.view_contact){
			return;
		}
		acceptance_http.get_info_count({"clientId":localStorage.time_stamp},function(result){
			$scope.count_tips = result;
			if($scope.count_tips.alertCount>0){
				$scope.fire_alert = true;
				$scope.voice_play();
			}else{
				$scope.fire_alert = false;
				$scope.voice_pause();
			}
		});
	};
	$scope.show_counts = function(menu){
		if($scope.count_tips){
			switch(menu){
				case 'fireAlarm':
					return $scope.count_tips.alarm;
					break;
				case 'troubleAlarm':
					return $scope.count_tips.malfunction;
					break;
			}
		}
		if($scope.unit_count_tips){
			switch(menu){
				case 'testUnit':
					return $scope.unit_count_tips.testFire;
					break;
//				case 'unitOnline':
					return $scope.unit_count_tips.online +'/' + $scope.unit_count_tips.allOnline;
					break;
			}
		}	
	};
	var get_data;
	function get_unit_tips(){
		get_data = acceptance_http.get_unit_info_count;
		if(typeof(get_data) == "function"){
			get_data({time:new Date()},function(result){
				$scope.unit_count_tips = result;
				$scope.$broadcast('map_counts', {data:result});
			});
		}
	}
	if($rootScope.sys_role.indexOf('fams_famadmin')>=0){
    	get_unit_tips();
    	$interval(get_unit_tips, 60000);
    	if($rootScope.sys_role.indexOf('fams_famadmin')>=0){
    		get_nav_tips();
    		$interval(get_nav_tips, 30000);
    	}
	}
	//火灾弹窗
	$scope.fire_true = function(){
    	if($rootScope.router_state != 'fireAlarm'){
    		$state.go("fireAlarm",{'token':$scope.sys_token,'sys':$scope.sys_role,'unit':$scope.sys_unit});
    	}else{
    		$state.reload("fireAlarm");
    	}
    	$rootScope.selectFirst = true;//默认选中第一条
		new_fire.count = 0;
		localStorage.time_stamp = new Date().getTime();
		$scope.fire_alert = false;
		$scope.voice_pause();
    };
    $scope.fire_cancel = function(){
    	new_fire.count = 0;
    	localStorage.time_stamp = new Date().getTime();
        $scope.fire_alert = false;
        $scope.voice_pause();
    };
	//只能输入数字
    var match;
    $("body").delegate("input[type=number]", "blur", function(e){
        match = exp_tool.check_number_input(e.target.value);
        if (match){
            match = match.join('');
        }
        $(e.target).val(match);
    });
	//分屏火灾控制器数量
	$scope.$on("monitor_count", function(event, obg) {
        $scope.monitor_num = obg;
   	})
	$scope.$on("count_tips", function(event, obg) {
        $scope.count_tips = obg;
   	})
	$scope.$on("unit_count_tips", function(event, obg) {
        $scope.unit_count_tips = obg;
   	})
	//处理中
	$scope.$on("loading", function(event, obg) {
        $scope.loading_show = obg;
   	})
	//系统菜单切换
	if($rootScope.sys_role.indexOf('fams_famadmin')>=0){
		$rootScope.system_name = "消防物联网远程监控系统";
		$scope.Acceptance_show = true;
		$scope.supervise_show = false;
		$scope.background_show = false;
		$scope.foreground_show = false;
	}else if($rootScope.sys_role.indexOf('fams_org')>=0){
		$rootScope.system_name = "消防监管单位管理系统";
		$scope.Acceptance_show = false;
		$scope.supervise_show = true;
		$scope.background_show = false;
		$scope.foreground_show = false;
	}else if($rootScope.sys_role.indexOf('fams_systemuser')>=0){
		$rootScope.system_name = "消防用户服务系统";
		$scope.Acceptance_show = false;
		$scope.supervise_show = false;
		$scope.background_show = false;
		$scope.foreground_show = true;
	}else if($rootScope.sys_role.indexOf('fams_systemadmin')>=0){
		$rootScope.system_name = "后台管理系统";
		$scope.Acceptance_show = false;
		$scope.supervise_show = false;
		$scope.background_show = true;
		$scope.foreground_show = false;
	};
	//天气
	var wea_city;
	if($base64.decode($rootScope.sys_unit) == 'ANLITAI_2017_FAKE'){
		wea_city = '广州';
	}else{
		wea_city = '佛山';
	};
	$http({
        method: "get",
        params:{"key":"76aaa3f404990b54a2630febed57402f","city":wea_city},
        url:"http://restapi.amap.com/v3/weather/weatherInfo"
   	}).success(function(result){
        $scope.wea_city = result.lives[0].city + ' ';
        $scope.wea_detail = result.lives[0].weather + ' ' + result.lives[0].temperature + '°C ' + result.lives[0].winddirection + '风 ' + result.lives[0].windpower + '级';
        $scope.wea_tyle = weather.get(result.lives[0].weather);//天气图标
   	});
   	//播放警报
	$scope.voice_play = function(index){
		var audio=document.getElementById("fire_alarm_voice");
		audio.load();
    	audio.play();
	};
	$scope.voice_pause = function(index){
		var audio=document.getElementById("fire_alarm_voice");
    	audio.pause();
	};
}]);