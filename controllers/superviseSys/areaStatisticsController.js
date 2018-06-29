/**
 * Created by Lxy on 2017/12/10.
 */
app.controller('areaStatisticsController', ['$scope','$timeout','echart_round','superivse_http','acceptance_http','$rootScope','$base64','$stateParams','all_dic','$filter','downloadFiles',
	function($scope,$timeout,echart_round,superivse_http,acceptance_http,$rootScope,$base64,$stateParams,all_dic,$filter,downloadFiles){
	$scope.month_to_number = all_dic.month_to_number
	//获取区域
	if($rootScope.system_name == '消防监管单位管理系统'){
   		top_data = superivse_http.get_auth_current_month;
   		btm_data = superivse_http.get_auth_area_every_month
   	}else{
   		top_data = superivse_http.get_current_month;
   		btm_data = superivse_http.get_area_every_month
   	}
	
	var categorys = []; //区域数组
  	acceptance_http.get_unit_info_areas({customerId:$base64.decode($stateParams.unit)},function(result){
  		$scope.net_areas = result;
  		$scope.current_area = $scope.net_areas[0].id;
  		for(var j=0;j<result.length;j++){
  			categorys.push(result[j].regionName);
  		}
  		$scope.get_region_data();
  	})
	//本月各区
	//火警
	var values = [];
	//误报
	var values2 = [];

	//各区域每月
	$scope.get_region_data = function(){
		values_line = [];//火警各区域每月
		values2_line = [];//误报各区域每月
		values3_line = [];//故障各区域每月
		$scope.unit_list = [];
		btm_data({regionId:$scope.current_area},function(result){
			for(var i = 0;i<result.length;i++){
				values_line.push(result[i].monthActualFire);
				values2_line.push(result[i].monthFalseFire);
				values3_line.push(result[i].monthAlert);
			}
			if($rootScope.router_state == 'areaStatistics'){ //防止点击过快报错
				init_line();
				chart_line = echarts.init(document.getElementById('area_line'));
				chart_line.clear();
	    		chart_line.setOption(options_line);
	    		chart_line.off("click");
	    		chart_line.on("click", function (param){
//					console.log(param.seriesIndex)	//当前线
					$scope.show_type = param.seriesIndex;
					if(param.seriesIndex == 0){ //火警
						$scope.type_id = 0;
						$scope.end_id = 2
					}else if(param.seriesIndex == 1){//误报
						$scope.type_id = 0;
						$scope.end_id = 1
					}else if(param.seriesIndex == 2){//故障
						$scope.type_id = 1;
						$scope.end_id = null
					}
					$scope.current_month = $filter('dic_filter')(param.name,$scope.month_to_number);
					$scope.get_search();
					$scope.detail_show = true;
				});
			}
		});
        top_data({},function(result){
            for(var k = 0;k<result.length;k++){
                values.push(result[k].monthActualFire); //本月各区火警
                values2.push(result[k].monthFalseFire); //本月各区误报
            }
            if($rootScope.router_state == 'areaStatistics'){ //防止点击过快报错
                init_bar();
                chart = echarts.init(document.getElementById('area_bar'));
                chart.clear();
                chart.setOption(options);
                chart.off("click");
	    		chart.on("click", function (param){
					$scope.current_area = $filter('region_name')(param.name,$scope.net_areas);
					$scope.$apply();
					$scope.get_region_data();
				});
            }
        });
	};
	$scope.show_types = function(){
		if($scope.show_type == 0){
			return '火警';
		}else if($scope.show_type == 1){
			return '误报';
		}else if($scope.show_type == 2){
			return '故障';
		}
	}
	var today = new Date();
	var current_year = today.getFullYear();
	//单位列表
	var limits = true;
	var page_num = 0;
	var page_size = 20;
	var total_page = 0;
	var param;
	$scope.unit_list = [];
	$scope.get_list=function(){
		page_num = page_num+1;
	   	param = {'regionId':$scope.current_area,'alertType':$scope.type_id,'endStatus':$scope.end_id,'time':current_year+'-' +$scope.current_month,'pageNum':page_num,'pageSize':page_size};
		superivse_http.get_region_area(param,function(result){
			$scope.unit_list = $scope.unit_list.concat(result.results);
			limits = true;
			total_page = result.totalPage;
			$scope.all_count = result.count;
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
		        onTotalScrollOffset: 20
		   }
		});
	};
	$timeout(scrollDate, 10);
	$scope.get_search=function(){
		page_num = 0;
		$scope.unit_list = [];
		$scope.get_list();
	};
	var options =  angular.copy(echart_round);
	//柱状图
	options.title.text="本月各区报警数量统计";
	options.legend.data = ['火警','误报'];
	options.color=['#FC5A87','#4786FF'];
	options.xAxis={
        type: 'category',
        data: categorys, //键
        axisTick: {
            alignWithLabel: true
        }
    };
	options.yAxis={
        type: 'value'
   	};
   	options.series = [{
		name:'火警',
        type: 'bar',
        barGap:0,
        barWidth: '40%',
        label: {
            normal: {
                show: true,
                position: 'inside'
            }
        }
   	},{
   		name:'误报',
        type: 'bar',
        barGap:0,
        barWidth: '40%',
        label: {
            normal: {
                show: true,
                position: 'inside'
            }
        }
   	}];
	function init_bar(){
		options.xAxis.data = categorys;
		options.series[0].data = values;
		options.series[1].data = values2;
	}
	//折线图初始化
	var month=[
		'一月', 
		'二月', 
		'三月', 
		'四月', 
		'五月', 
		'六月', 
		'七月', 
		'八月', 
		'九月',
		'十月',
		'十一月',
		'十二月'
	];
    //折线图
    var options_line =  angular.copy(echart_round);
    options_line.title.text="各区12个月火警／误报／故障 报警数量对比走势图";
	options_line.legend={
    	data:['火警','误报','故障'],
    	x:'right',
    	padding:[23,150,0,0]
    }
	options_line.color=['#FC7678','#BA76FF','#FAD961']
	options_line.xAxis={
        type: 'category',
        data: month, //键
        axisTick: {
            alignWithLabel: true
        }
    };
	options_line.yAxis={
        type: 'value',
   	};
   	options_line.series = [{
		name:'火警',
        type: 'line',
        smooth:true,
        symbol:'rectangle',
        label: {
            normal: {
                show: true,
                position: 'inside'
            }
        }
   	},{
   		name:'误报',
        type: 'line',
        smooth:true,
        symbol:'rectangle',
        label: {
            normal: {
                show: true,
                position: 'inside'
            }
        }
   	},{
   		name:'故障',
        type: 'line',
		smooth:true,
        symbol:'rectangle',
        label: {
            normal: {
                show: true,
                position: 'inside'
            }
        }
   	}];
	function init_line(){
		options_line.series[0].data = values_line;
		options_line.series[1].data = values2_line;
		options_line.series[2].data = values3_line;
	};
    $(window).resize(function(){
    	$timeout(chart.resize, 100);
    	$timeout(chart_line.resize, 100);	
    });
    //警情状态  terminalStatusId：0自动火警  1确认火警  2紧急火警 
  	$scope.danger_status = function(id){
  		if(id == 0){
  			return '自动火警';
  		}else if(id == 1){
  			return '确认火警';
  		}else if(id == 2){
  			return '紧急火警 ';
  		}
  	};
  	$scope.status_format = function(process,end){
		switch(process){
			case 0:
				return '未处理';
			case 1:
				return '待确认';
			case -1:
				return '单位确认';
			case 2:
				if($scope.show_type==0 || $scope.show_type == 1){
					switch(end){
						case 0:
							return '未知火警';
						case 1:
							return '误报火警';
						case 2:
							return '真实火警';
						case 3:
							return '测试火警';
					}
				}else if($scope.show_type==2){
					return '已处理';
				}
		}
    };
    var urls,params,filenames;
    $scope.download_file = function(){
		urls = "countAlertAndFire/countThisMonthActualFire/alertByRegionId/exportAlertByRegionId";
		params = {'regionId':$scope.current_area,'alertType':$scope.type_id,'endStatus':$scope.end_id,'time':current_year+'-' +$scope.current_month};
		filenames = $filter('area_filter')($scope.current_area,$scope.net_areas) + $scope.current_month + '月' + $scope.show_types();
        downloadFiles.download(urls,params,'',"GET",filenames);
   	};
}]);