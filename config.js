/**
 * Created by Lxy on 2017/12/7.
 */
var config = angular.module('config', []);

config.value('http_url', 'http://release.mtoliv.com/fams/api/v1/'); // http://api.mtoliv.com/fams/api/v1/  http://release.mtoliv.com/fams/api/v1/
//七牛图片地址
config.value('qiniu_url', 'http://p1kdiadwu.bkt.clouddn.com/');
/*菜单*/
config.value('menu_list', [
	{id:'fams_P001',name:'火灾报警',links:'fireAlarm'},
	{id:'fams_P012',name:'水系统报警',links:'waterAlarm'},
	{id:'fams_P023',name:'电气火灾报警',links:'elecAlarm'},
//	{id:'fams_P034',name:'排烟信息',links:'smokeAlarm'},
	{id:'fams_P045',name:'其他监测',links:'otherAlarm'},
	{id:'fams_P056',name:'故障信息',links:'troubleAlarm'},
	{id:'fams_P067',name:'测试单位',links:'testUnit'},
	{id:'fams_P078',name:'单位在线状态',links:'unitOnline'},
	{id:'fams_P079',name:'在线走势图',links:'onlineStatistics'},
	{id:'fams_P080',name:'单位在线数量',links:'onlineCount'},
	{id:'fams_P089',name:'联网单位资料',links:'networkUnit'},
	{id:'fams_P100',name:'值班查岗',links:'checkTask'},
	{id:'fams_P111',name:'记录查询',links:'recordSearch'},
	{id:'fams_P002',name:'警情统计',links:'alarmStatistics'},//监管
	{id:'fams_P004',name:'排名统计',links:'rankingStatistics'},
	{id:'fams_P006',name:'区域警情',links:'areaStatistics'},
	{id:'fams_P008',name:'单位类型火灾统计',links:'unitStatistics'},
	
	{id:'fams_P010',name:'设备安装统计',links:'deviceStatistics'},
	{id:'fams_P013',name:'火灾控制器品牌统计',links:'deviceStatistics_alarm'},
	{id:'fams_P015',name:'接口方式统计',links:'deviceStatistics_interface'},
	
	{id:'fams_P122',name:'发布通知',links:'makeAnnouncement'},
	{id:'fams_P601',name:'统计分析',links:'unitCount'},//用户
	{id:'fams_P611',name:'火灾报警',links:'unitFireAlarm'},
	{id:'fams_P621',name:'水系统报警',links:'unitWaterAlarm'},
	{id:'fams_P631',name:'电气火灾报警',links:'unitElecAlarm'},
//	{id:'fams_P641',name:'排烟信息',links:'unitSmokeAlarm'},
	{id:'fams_P651',name:'其他监测',links:'unitOtherAlarm'},
	{id:'fams_P661',name:'故障信息',links:'unitTroubleAlarm'},
	{id:'fams_P671',name:'单位资料',links:'unitInfo'},
	{id:'fams_P681',name:'值班查岗',links:'unitCheckTask'},
	{id:'fams_P691',name:'记录查询',links:'unitRecordSearch'},
	{id:'fams_P081',name:'单位资料维护',links:'setUnitOnline'},//后台
	{id:'fams_P133',name:'账户管理',links:'accountManage'},
//	{id:'',name:'系统配置',links:'systemSetting'},
	{id:'fams_P144',name:'电话簿维护',links:'phoneList'},
	{id:'fams_P155',name:'字典项维护',links:'dictionary'},
]);
/*echart柱状图配置*/
config.value('echart_round',{
  	title: {
        text: '年度各类型单位火灾报警数量统计',
        x: 'left',
        fontSize:16,
        padding:20,
        textStyle:{
        	fontSize: 16,
        	fontWeight: 'bold',
        	color: '#000000'
        }
	},
	color: ['#76DDFB'],
    legend:{
    	data:[],
    	x:'right',
    	padding:20
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        left: '20',
        right: '20',
        bottom: '20',
        containLabel: true
    },
    xAxis: [],
    yAxis: [],
    series: []
});
/*echart柱状图配置*/
config.value('echart_pie',{
  	title: {
        text: '',
        x: 'center',
        fontSize:16,
        padding:20,
	},
	color: ['#5EBFFF','#D1FC95','#8B84FD','#FF808A','#03F3C6'],
    legend:{
    	orient : 'vertical',
        x : 'right',
        y : 'bottom',
        icon: 'circle',
        textStyle: {
			color: '#474D74',
			fontSize:13
       	},
       	itemWidth:10,
       	itemHeight:10,
        data:[],
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        left: '20',
        right: '20',
        bottom: '20',
        containLabel: true
    },
    xAxis: [],
    yAxis: [],
    series: [{
    	type:'pie',
		radius : '55%',
		center: ['50%', '55%'],
		label: {
            normal: {
                position: 'inner',
                formatter: '{d}%'
            }
        },
		data:[]
    }]
})

//字典项
config.value('all_dic',{
	networkState: [
        {id: 0, name: "联网"},
        {id: 1, name: "未联网"}
    ],
    supervisionGrade: [
        {id: 0, name: "特级防火单位"},
        {id: 1, name: "一级防火单位"},
        {id: 2, name: "二级防火单位"},
        {id: 3, name: "三级防火单位"}
    ],
    //siteType: [
//      {id: 0, name: "公共集散场所"},
//      {id: 1, name: "医院、养老院和寄宿制的学校、托儿所"},
//      {id: 2, name: "国家机关"},
//      {id: 3, name: "广播电台、电视台和邮政、通信枢纽"},
//      {id: 4, name: "客运车站、码头、民用机场"},
//      {id: 5, name: "公共图书馆、展览馆、博物馆、档案馆"},
//      {id: 6, name: "发电厂（站）和电网经营企业"},
//      {id: 7, name: "易燃易爆化学物品的生产、充装、储存"},
//      {id: 8, name: "劳动密集型生产、加工企业"},
//      {id: 9, name: "重要的科研单位"},
//      {id: 10, name: "高层公共建筑"},
//      {id: 11, name: "地下公共建筑和城市重要的交通隧道"},
//      {id: 12, name: "大型仓库和堆场"},
//      {id: 13, name: "重点工程的施工现场"},
//      {id: 14, name: "其他发生火灾可能性较大和一旦发生火灾较大的场所"},
//      {id: 15, name: "其他"}
// 		{id: 0, name: "商场、市场"},
//      {id: 1, name: "宾馆、酒店、饭店"},
//      {id: 2, name: "公共娱乐场所"},
//      {id: 3, name: "医院、养老院"},
//      {id: 4, name: "学校、托儿所、幼儿园"},
//      {id: 5, name: "国家机关"},
//      {id: 6, name: "广播、电视台、邮政通信枢纽"},
//      {id: 7, name: "客运车站、码头、民用机场"},
//      {id: 8, name: "公共图书馆、展览馆、博物馆、档案馆、体育馆、会场"},
//      {id: 9, name: "劳动密集型生产、加工企业"},
//      {id: 10, name: "重要的科研单位"},
//      {id: 11, name: "高层公共建筑"},
//      {id: 12, name: "大型仓库、堆场"},
//      {id: 13, name: "丙、丁类企业"},
//      {id: 14, name: "文物保护单位"},
//      {id: 15, name: "发电厂、电网经营企业"},
//      {id: 16, name: "易燃易爆单位"},
//      {id: 17, name: "在建"},
//  ],
    communicationModel: [
        {id: 0, name: "有线宽带"},
        {id: 1, name: "2G"},
        {id: 2, name: "4G"},
        {id: 3, name: "Wi-Fi"}
    ],
    serviceState: [
        {id: 0, name: "停运"},
        {id: 1, name: "试运行"},
        {id: 2, name: "有效"},
        {id: 3, name: "其他"}
    ],
    famFacusType: [
        {id: 0, name: "火灾报警控制器"},
        {id: 1, name: "联动控制器"},
        {id: 2, name: "可燃气体报警控制器"},
        {id: 3, name: "电气火灾控制器"}
    ],
    subSystem: [
        {id: 0, name: "火灾报警子系统"}
    ],
    buildingStructure:[
        {id: 0, name: "砖木结构"},
        {id: 1, name: "混合结构"},
        {id: 2, name: "钢筋混凝土结构"},
        {id: 3, name: "钢结构"},
        {id: 4, name: "轻钢结构"},
        {id: 5, name: "其他结构"}
    ],
    fireProofDoorTypes:[
        {id: 0, name: "甲级防火门"},
        {id: 1, name: "乙级防火门"},
        {id: 2, name: "丙级防火门"}
    ],
    usingTypes:[
        {id: 0, name: "饭店、旅店"},
        {id: 1, name: "公寓、住宅"},
        {id: 2, name: "体育场馆"},
        {id: 3, name: "俱乐部、夜总会、歌舞厅"},
        {id: 4, name: "电影院、剧院、礼堂"},
        {id: 5, name: "办公、商务"},
        {id: 6, name: "科研"},
        {id: 7, name: "医院"},
        {id: 8, name: "教学"},
        {id: 9, name: "商业"},
        {id: 10, name: "交通"},
        {id: 11, name: "文物馆"},
        {id: 12, name: "通信枢纽、电视广播发射"},
        {id: 13, name: "厂房"},
        {id: 14, name: "库房"},
        {id: 15, name: "油气罐站"},
        {id: 16, name: "综合建筑"},
        {id: 17, name: "其他"},
        {id: 18, name: "金融"}
    ],
    stairForms:[
        {id: 0, name: "敞开楼梯间"},
        {id: 1, name: "封闭楼梯"},
        {id: 2, name: "防烟楼梯间"},
        {id: 3, name: "室外疏散楼梯"}
    ],
    fireRisks:[
        {id: 0, name: "甲级"},
        {id: 1, name: "乙级"},
        {id: 2, name: "丙级"},
        {id: 3, name: "丁级"},
        {id: 4, name: "戊级"},
	    {id: 5, name: "民用"}
    ],
    resistanceRates:[
        {id: 0, name: "市消防重点单位"},
        {id: 1, name: "区消防重点单位 "}
    ],
    fireRates:[
        {id: 0, name: "特级"},
        {id: 1, name: "一级"},
        {id: 2, name: "二级"},
        {id: 3, name: "三级"}
    ],
    buildingCategorys:[
        {id: 0, name: "民用建筑"},
        {id: 1, name: "工业建筑"},
        {id: 2, name: "构筑物"}
    ],
    taskList:[
        {id: 0, name: "查岗"},
        {id: 1, name: "校时"},
    ],
    operateCompany:[
        {id: "0", name: "移动"},
        {id: "1", name: "电信"},
        {id: "2", name: "联通"}
    ],
    pictureType:[
        {id: 0, name: "其他"},
        {id: 1, name: "封面图片"},
        {id: 2, name: "单位外观图"},
        {id: 3, name: "东座楼"},
        {id: 4, name: "西座楼"},
        {id: 5, name: "南座楼"},
        {id: 6, name: "北座楼"}
    ],
    surfaceType:[
        {id: 10, name: "平面图"}
    ],
    alarm_type:[
//		{'id':1,'name':'火灾报警'},
//		{'id':2,'name':'电气火灾报警'},
//		{'id':3,'name':'水系统报警'} 
		{'id':1,'name':'火灾监控设备'},
		{'id':2,'name':'电气火灾监控设备'},
		{'id':3,'name':'水系统监控设备'}
	],
    trouble_type:[
        	//{'id':0,'name':'其他故障'},
		{'id':2,'name':'主电故障'},
		{'id':3,'name':'备电故障'},
		{'id':5,'name':'与监控中心通信信道故障'},
		{'id':6,'name':'监测连接线路故障'},
		{'id':0,'name':'其他故障'},
	],
	ctrl_type:[
		//{'id':0,'name':'其他故障'},
		{'id':2,'name':'主电故障'},
		{'id':3,'name':'备电故障'},
		{'id':4,'name':'总线故障'},
		{'id':0,'name':'其他故障'},
	],
	detect_type:[
		//{'id':0,'name':'其他故障'},
		{'id':1,'name':'电源故障'},
		{'id':0,'name':'其他故障'},
	],
    month_to_number:[
		{'id':'一月','name':'01'},
		{'id':'二月','name':'02'},
		{'id':'三月','name':'03'},
		{'id':'四月','name':'04'},
		{'id':'五月','name':'05'},
		{'id':'六月','name':'06'},
		{'id':'七月','name':'07'},
		{'id':'八月','name':'08'},
		{'id':'九月','name':'09'},
		{'id':'十月','name':'10'},
		{'id':'十一月','name':'11'},
		{'id':'十二月','name':'12'},
	]

})