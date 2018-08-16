/**
 * Created by Lxy on 2017/12/10.
 */
app.controller('unitStatisticsController', ['$scope','$timeout','echart_round','superivse_http','$rootScope','$base64','$stateParams','downloadFiles', function($scope,$timeout,echart_round,superivse_http,$rootScope,$base64,$stateParams,downloadFiles){
	var values = [];
	//单位类型
	$scope.unit_statics_show = false;
	$scope.categorys = [];
	$scope.name = [];
	superivse_http.get_site_type({customerId:$base64.decode($stateParams.unit)},function(result_categorys){
        for(var i=0;i<result_categorys.length;i++){
        	$scope.categorys.push(result_categorys[i].name);
        }
        options.yAxis.data = $scope.categorys;
        if ($rootScope.system_name == '消防监管单位管理系统'){
	        superivse_http.get_year_fire_by_unit_systemRole({},function(result){
	            values = [];
	            for(var i=0;i<result.length;i++){
	                values.push(result[i].yearActualFire);
	            }
	            if($rootScope.router_state == 'unitStatistics'){ //防止点击过快报错
	                init_year();
	                chart = echarts.init(document.getElementById('unit_chart'));
	                chart.setOption(options);
	                chart.off("click");
	    			chart.on("click", function(param){
	    				$scope.show_type = param.seriesIndex;
	    				for(var ii=0;ii<result_categorys.length;ii++){
	    					$scope.name.push(result_categorys[ii].name);
				        	if(param.name == result_categorys[ii].name){
				        		$scope.siteTypeId = result_categorys[ii].id;
				        	}
				        }						
	    				$scope.get_search();
						$scope.unit_statics_show = true;
	    			});
	            }
	        });
		}else {
	        superivse_http.get_year_fire_by_unit({},function(result){
	            values = [];
	            for(var i=0;i<result.length;i++){
	                values.push(result[i].yearActualFire);
	            }
	            if($rootScope.router_state == 'unitStatistics'){ //防止点击过快报错
	                init_year();
	                chart = echarts.init(document.getElementById('unit_chart'));
	                chart.clear();
	                chart.setOption(options);
	                chart.off("click");
	    			chart.on("click", function(param){
	    				$scope.show_type = param.seriesIndex;
	    				for(var ii=0;ii<result_categorys.length;ii++){
	    					$scope.name.push(result_categorys[ii].name);
				        	if(param.name == result_categorys[ii].name){
				        		$scope.siteTypeId = result_categorys[ii].id;
				        	}
				       }						
	    				$scope.get_search();
						$scope.unit_statics_show = true;
	    			});
	            }
	        });
		}
    });
    
    $scope.type_id = [1,2];
    var today = new Date();
	var current_year = today.getFullYear();
	//单位列表
	var limits = true;
	var page_num = 0;
	var page_size = 20;
	var total_page = 0;
	var param;
	$scope.unit_statistic_list = [];
	$scope.get_list=function(){
		page_num = page_num+1;
	   	param = {'alertType':0,'endStatus':$scope.type_id,'siteType':$scope.siteTypeId};
	   	if ($rootScope.system_name == '消防监管单位管理系统'){
	   		superivse_http.get_unit_statist_alert_system(param,function(result){
				$scope.unit_statistic_list = $scope.unit_statistic_list.concat(result.results);
				limits = true;
				total_page = result.totalPage;
				$scope.all_count = result.count;
			});
	   	} else {
	   		superivse_http.get_unit_statist_alert(param,function(result){
				$scope.unit_statistic_list = $scope.unit_statistic_list.concat(result.results);
				limits = true;
				total_page = result.totalPage;
				$scope.all_count = result.count;
			});
	   	}	
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
		$scope.unit_statistic_list = [];
		$scope.get_list();
	};
	
	var options =  angular.copy(echart_round);
	//赋值
	options.xAxis={
        type: 'value'
   };
	options.yAxis={
        type: 'category',
        data: [], //键
        axisTick: {
            alignWithLabel: true
        }
   	};
	options.series = {
        type: 'bar',
        barWidth: '40%',
        label: {
            normal: {
                show: true,
                position: 'right',
            }
            
        },
        itemStyle:{
	        normal:{
	            //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
	            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
	                {
	                    offset: 0,
	                    color: '#76DDFB'
	                }, {
	                    offset: 1,
	                    color: '#53A8E2'
	                }
	            ])
	        }
	    } 
    };
    function init_year(){	
    	options.series.data = values;
    }
    $(window).resize(function(){
    	$timeout(chart.resize, 100);
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
    	if($rootScope.system_name == '消防监管单位管理系统'){
    		urls = "countAlertAndFire/countThisYearBySiteTypeId/alert/export/systemRole";
    	} else {
    		urls = "countAlertAndFire/countThisYearBySiteTypeId/alert/export";
    	}
		params = {'alertType':0,'endStatus':$scope.type_id,'siteType':$scope.siteTypeId};
		filenames = '年度各类型单位火灾报警数量统计';
        downloadFiles.download(urls,params,'',"GET",filenames);
   	};
}]);