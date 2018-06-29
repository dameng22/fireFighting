/**
 * Created by Lxy on 2018/06/04.
 */
app.controller('deviceStatisticsController', ['$scope','background_http','$timeout','$base64','$stateParams','echart_pie','acceptance_http','all_dic','dic_http','$filter','exp_tool',
	function($scope,background_http,$timeout,$base64,$stateParams,echart_pie,acceptance_http,all_dic,dic_http,$filter,exp_tool){
	var options_pie,chart,title,filed,legend=[];
	//饼图
	var legend = [],area_id;
	$scope.get_pie_list = function(){
		options_pie =  angular.copy(echart_pie);
		area_id = angular.copy($scope.area_id);
		if(exp_tool.is_chinese(area_id)){
			area_id = null
		}
		$scope.company_list = [];//清空左侧单位
		background_http.get_pie_data({'regionId':area_id},function(result){
			for(var i = 1;i<5;i++){
				legend = []
				//饼图
				if(i == 1){
					title = '通讯模式';
					filed = 'modelTypeCount';
				}else if(i == 2){
					title = '运营商';
					filed = 'operatorCount'
				}else if(i == 3){
					title = '火灾控制器品牌';
					filed = 'facuManufacturerIdCount';
				}else if(i == 4){
					title = '接口方式';
					filed = 'facuApiTypeCount';
				}
				for(var j=0;j<result[filed].length;j++){
					result[filed][j].value = result[filed][j].count;
					result[filed][j].chart_type = i;
					if(result[filed][j].id){
						if(i == 1){
							result[filed][j].name = $filter('model_filter')(result[filed][j].id,$scope.type_list);
						}else if(i == 2){
							result[filed][j].name = $filter('dic_filter')(result[filed][j].id,$scope.operate_list);
						}else if(i == 3){
							result[filed][j].name = $filter('dic_filter')(result[filed][j].id,$scope.manu_list);
						}else if(i == 4){
							result[filed][j].name = $filter('api_filter')(result[filed][j].id,$scope.api_types);
						}
					}else { //id为null转其他
						result[filed][j].name = '其他'
					}
					legend.push(result[filed][j].name);
				}
				options_pie.title.text = title;
			    options_pie.legend.data = legend;
				options_pie.series[0].data = result[filed];
				chart = echarts.init(document.getElementById('device_pie'+i));
				chart.setOption(options_pie);
				chart.on("click", function (param){
					if(param.data.chart_type == 1){
						if(param.name == '其他'){
							$scope.jsons = {'regionId':area_id,'modelTypeIdIsNull':true};
						}else{
							$scope.jsons = {'regionId':area_id,'modelTypeId':param.data.id};
						}
					}else if(param.data.chart_type == 2){
						if(param.name == '其他'){
							$scope.jsons = {'regionId':area_id,'operatorIdIsNull':true};
						}else{
							$scope.jsons = {'regionId':area_id,'operatorId':param.data.id};
						}
					}else if(param.data.chart_type == 3){
						if(param.name == '其他'){
							$scope.jsons = {'regionId':area_id,'facuManufacturerIdIsNull':true};
						}else{
							$scope.jsons = {'regionId':area_id,'facuManufacturerId':param.data.id};
						}
					}else if(param.data.chart_type == 4){
						if(param.name == '其他'){
							$scope.jsons = {'regionId':area_id,'facuApitypeIdIsNull':true};
						}else{
							$scope.jsons = {'regionId':area_id,'facuApitypeId':param.data.id};
						}
					}
					$scope.get_search();
				});
			}
		})
	};
	//字典项
	$scope.operate_list = all_dic.operateCompany;
	$scope.get_dic = function(){
		//通讯模式
		dic_http.get_fam_type({customerId:$base64.decode($stateParams.unit),isdisable:false},function(result){
			$scope.type_list = $filter("orderBy")(result,"code");
			//控制器制造商
			dic_http.get_manufacturer({customerId:$base64.decode($stateParams.unit),isdisable:false,typeId:1},function(result){
				$scope.manu_list = $filter("orderBy")(result,"code");
				//接口类型
				acceptance_http.get_api_types({customerId:$base64.decode($stateParams.unit)},function(result){
					$scope.api_types = result;
					$scope.get_pie_list(); //饼图
				});
			});
		});
	};
	$scope.get_dic();
	var resise;
   	$(window).resize(function(){
   		for(var i = 1;i<5;i++){
   			resise = echarts.init(document.getElementById('device_pie'+i));
   			$timeout(resise.resize, 100);
   		};
    });
	//获取区域
  	acceptance_http.get_unit_info_areas({customerId:$base64.decode($stateParams.unit)},function(result){
  		$scope.net_areas = result;
  	});
  	$scope.area_id = "按区域筛选";
  	//公司
	var limits = true;
	var page_num = 0;
	var page_size = 20;
	var total_page = 0;
	$scope.company_list = [];
	$scope.get_list=function(){
		page_num = page_num+1;
		$scope.jsons.pageNum = page_num;
		$scope.jsons.pageSize = page_size;
		background_http.get_pie_company($scope.jsons,function(result){
			$scope.company_list = $scope.company_list.concat(result.results);
			limits = true;
			total_page = result.totalPage;
		})
	};
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
	$scope.get_search=function(type){
		page_num = 0;
		$scope.company_list = [];
		$scope.get_list();
	};
}]);