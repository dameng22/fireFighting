/**
 * Created by Lxy on 2017/12/10.
 */
app.controller('unitStatisticsController', ['$scope','$timeout','echart_round','superivse_http','$rootScope', function($scope,$timeout,echart_round,superivse_http,$rootScope){
	var values = [];
	//单位类型
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
                chart.setOption(options);
            }
        });
	}
	var categorys=[
		'公众集散场所', 
		'医院、养老院和寄宿制的学校、托儿所', 
		'国家机关', 
		'广播电台、电视台和邮政、通信枢纽', 
		'客运车站、码头、民用机场', 
		'公共图书馆、展览馆、博物馆、档案馆', 
		'发电厂（站）和电网经营企业', 
		'易燃易爆化学物品的生产、充装、储存', 
		'劳动密集型生产、加工企业',
		'重要的科研单位',
		'高层公共建筑',
		'地下公共建筑和城市重要的交通隧道',
		'大型仓库和堆场',
		'重点工程的施工现场',
		'其他发生火灾可能性较大和一旦发生火灾较大的场所',
		'其他',
	];
	var options =  angular.copy(echart_round);
	//赋值
	options.xAxis={
        type: 'value'
    };
	options.yAxis={
        type: 'category',
        data: categorys, //键
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
                position: 'inside'
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
}]);