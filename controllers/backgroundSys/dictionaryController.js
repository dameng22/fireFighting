/**
 * Created by Lxy on 2017/12/24.
 */
app.controller('dictionaryController', ['$scope','$state','$stateParams', function($scope,$state,$stateParams){
//	$state.go("dictionary.manufacturer");
	$scope.dic_list = [
		{"links":"dictionary.manufacturer","name":"制造商"},
		{"links":"dictionary.deviceType","name":"设备型号"},	
		{"links":"dictionary.controllerBrand","name":"控制器品牌"},
		{"links":"dictionary.controllerVersion","name":"控制器型号"},
		{"links":"dictionary.communication","name":"装置通讯方式"},
		{"links":"dictionary.apiType","name":"接口分类"},
		{"links":"dictionary.operator","name":"运营商"},	
		{"links":"dictionary.systemSetting","name":"系统设置"},
	];
	$scope.go_sub = function(urls){
		$state.go(urls,{'token':$stateParams.token,'sys':$stateParams.sys,'unit':$stateParams.unit})
	}
	
}]);