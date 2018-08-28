/**
 * Created by Lxy on 2018/06/04.
 */
app.controller('deviceStatisticsInterfaceController', ['$scope','background_http','$timeout','$base64','$stateParams','echart_round','acceptance_http','all_dic','dic_http','$filter','exp_tool','downloadFiles',
	function($scope,background_http,$timeout,$base64,$stateParams,echart_round,acceptance_http,all_dic,dic_http,$filter,exp_tool,downloadFiles){
	var options_pie,chart,title,filed,legend=[],area_id,values=[];

	$scope.get_pie_list = function(){
		$scope.device_statics_down_show = false;
		area_id = angular.copy($scope.area_id);
		if(exp_tool.is_chinese(area_id)){
			area_id = null
		}
		$scope.company_list = [];//清空左侧单位
		background_http.get_pie_data({'regionId':area_id},function(result){
			init_year();
			legend = []
			title = '接口方式';
			filed = 'facuApiTypeCount';				
			for(var j=0;j<result[filed].length;j++){
				result[filed][j].value = result[filed][j].count;
				values.push(result[filed][j].count);
				if(result[filed][j].id){
					result[filed][j].name = $filter('api_filter')(result[filed][j].id,$scope.api_types);	
				}else { //id为null转其他
					result[filed][j].name = '其他'
				}
					
				legend.push(result[filed][j].name);
			}
			options.title.text = "";
		    options.yAxis.data = legend;
			options.series.data = result[filed];
			chart = echarts.init(document.getElementById('device_pie4'));
			chart.setOption(options);
			chart.off("click");
			chart.on("click", function (param){
				$scope.device_statics_down_show = true;
				if(param.name == '其他'){
					$scope.jsons = {'regionId':area_id,'facuApitypeIdIsNull':true};
				}else{
					$scope.jsons = {'regionId':area_id,'facuApitypeId':param.data.id};
				}
				$scope.get_search();
			});
		})
	};
	
	//获取区域
  	acceptance_http.get_unit_info_areas({customerId:$base64.decode($stateParams.unit)},function(result){
  		$scope.net_areas = result;
  	});
  	$scope.area_id = "按区域筛选";
	
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
	
	//公司
	var limits = true;
	var page_num = 0;
	var page_size = 50;
	var total_page = 0;
	$scope.company_list = [];
	$scope.get_list=function(){
		page_num = page_num+1;
		$scope.jsons.pageNum = page_num;
		$scope.jsons.pageSize = page_size;
		background_http.get_pie_company($scope.jsons,function(result){
			$scope.company_list = result.results;
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
	
	var options =  angular.copy(echart_round);
	//赋值
	options.xAxis={
        type: 'value'
   };
	options.yAxis={
//		min:0,
//      max:20,
        type: 'category',
        data: [], //键
        axisTick: {
            alignWithLabel: true
        },
        axisLabel: {
			fontSize: 13,
		},
   	};
	options.series = {
        type: 'bar',
        barWidth: '40%',
        label: {
            normal: {
                show: true,
                position: 'inside',
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
    var resise;
   	$(window).resize(function(){
		resise = echarts.init(document.getElementById('device_pie4'));
		$timeout(resise.resize, 100);	
    });

	//导出文件
	var urls,params,filenames;
    $scope.download_file = function(){
		urls = "countAlertAndFire/paiChartRightList/export";
		filenames = "联网单位";
        downloadFiles.download(urls,$scope.jsons,'',"GET",filenames);
   	};
}]);