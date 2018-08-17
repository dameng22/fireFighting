/**
 * Created by Lxy on 2017/12/7.
 */
var routers = angular.module('routers', ['ui.router']);
routers.config(['$stateProvider', '$urlRouterProvider','$httpProvider', function($stateProvider, $urlRouterProvider,$httpProvider){
	$stateProvider.state('checkTask', { //信息受理 巡检任务
        url:'/checkTask/:token/:unit/:sys',
        templateUrl: './template/AcceptanceSys/checkTask.html',
        controller:'checkTaskController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/checkTaskController.js?pro=35');
			}]
        }
    }).state('keepWatch', { //信息受理 值班查岗
        url:'/keepWatch/:token/:unit/:sys',
        templateUrl: './template/AcceptanceSys/keepWatch.html',
        controller:'keepWatchController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/keepWatchController.js?pro=35');
			}]
        }
    }).state('fixTiming', { //信息受理 设备校时
        url:'/fixTiming/:token/:unit/:sys',
        templateUrl: './template/AcceptanceSys/fixTiming.html',
        controller:'fixTimingController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/fixTimingController.js?pro=35');
			}]
        }
    }).state('networkUnit', { //信息受理 联网单位资料
        url:'/networkUnit/:token/:unit/:sys',
        templateUrl: './template/AcceptanceSys/networkUnit.html',
        controller:'networkUnitController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/networkUnitController.js?pro=35');
			}]
        }
    }).state('testUnit', { //信息受理 测试单位
        url:'/testUnit/:token/:unit/:sys',
        templateUrl: './template/AcceptanceSys/testUnit.html',
        controller:'testUnitController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/testUnitController.js?pro=35');
			}]
        }
    }).state('unitOnline', { //信息受理 单位在线状态 火灾
        url:'/unitOnline/:token/:unit/:sys',
        templateUrl: './template/AcceptanceSys/unitOnline.html',
        controller:'unitOnlineController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/unitOnlineController.js?pro=35');
			}]
        }
    }).state('unitOnlineElec', { //信息受理 单位在线状态  电气
        url:'/unitOnlineElec/:token/:unit/:sys',
        templateUrl: './template/AcceptanceSys/unitOnlineElec.html',
        controller:'unitOnlineElecController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/unitOnlineElecController.js?pro=35');
			}]
        }
    }).state('unitOnlineWater', { //信息受理 单位在线状态 水系统
        url:'/unitOnlineWater/:token/:unit/:sys',
        templateUrl: './template/AcceptanceSys/unitOnlineWater.html',
        controller:'unitOnlineWaterController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/unitOnlineWaterController.js?pro=35');
			}]
        }
    }).state('onlineCount', { //信息受理 单位在线数量
        url:'/onlineCount/:token/:unit/:sys',
        templateUrl: './template/AcceptanceSys/onlineCount.html',
        controller:'onlineCountController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/onlineCountController.js?pro=35');
			}]
        }
    }).state('fireAlarm', { //信息受理 火灾报警
        url:'/fireAlarm/:token/:unit/:sys',
        templateUrl: './template/AcceptanceSys/fireAlarm.html',
        controller:'fireAlarmController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/fireAlarmController.js?pro=35');
			}]
        }
    }).state('fireAlarmMonitor', { //信息受理 火灾报警
        url:'/fireAlarmMonitor/:token/:unit/:sys',
        templateUrl: './template/AcceptanceSys/fireAlarmMonitor.html',
        controller:'fireAlarmMonitorController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/fireAlarmMonitorController.js?pro=35');
			}]
        }
    }).state('troubleAlarm', { //信息受理 故障信息
        url:'/troubleAlarm/:token/:unit/:sys',
        templateUrl: './template/AcceptanceSys/troubleAlarm.html',
        controller:'troubleAlarmController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/troubleAlarmController.js?pro=35');
			}]
        }
    }).state('recordSearch', { //信息受理 记录查询
        url:'/recordSearch/:token/:unit/:sys',
        params:{"recordId":null,"view_record":null},
        templateUrl: './template/AcceptanceSys/recordSearch.html',
        controller:'recordSearchController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/recordSearchController.js?pro=35');
			}]
        }
    }).state('waterAlarm', { //信息受理 水系统
        url:'/waterAlarm/:token/:unit/:sys',
        templateUrl: './template/AcceptanceSys/waterAlarm.html',
        controller:'waterAlarmController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/waterAlarmController.js?pro=35');
			}]
        }
    }).state('elecAlarm', { //信息受理 电气故障
        url:'/elecAlarm/:token/:unit/:sys',
        templateUrl: './template/AcceptanceSys/elecAlarm.html',
        controller:'elecAlarmController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/elecAlarmController.js?pro=35');
			}]
        }
    }).state('smokeAlarm', { //信息受理 排烟信息
        url:'/smokeAlarm/:token/:unit/:sys',
        templateUrl: './template/AcceptanceSys/smokeAlarm.html',
        controller:'smokeAlarmController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/smokeAlarmController.js?pro=35');
			}]
        }
    }).state('otherAlarm', { //信息受理 其他故障
        url:'/otherAlarm/:token/:unit/:sys',
        templateUrl: './template/AcceptanceSys/otherAlarm.html',
        controller:'otherAlarmController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/AcceptanceSys/otherAlarmController.js?pro=35');
			}]
        }
    }).state('setUnitOnline', { //后台管理 单位资料维护
        url:'/setUnitOnline/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/setUnitOnline.html',
        controller:'setUnitOnlineController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/setUnitOnlineController.js?pro=35');
			}]
        }
    }).state('setUnitDetail', { //后台管理 单位资料维护
        url:'/setUnitDetail/:unit_id/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/setUnitDetail.html',
        controller:'setUnitDetailController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/setUnitDetailController.js?pro=35');
			}]
        }
    }).state('setUnitDetail.baseInfo', { //后台管理 单位资料维护  基本信息
        url:'/baseInfo/:unit_id/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/unitsub/baseInfo.html',
        controller:'baseInfoController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/unitsub/baseInfoController.js?pro=35');
			}]
        }
    }).state('setUnitDetail.transDevice', { //后台管理 单位资料维护  传输装置
        url:'/transDevice/:unit_id/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/unitsub/transDevice.html',
        controller:'transDeviceController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/unitsub/transDeviceController.js?pro=35');
			}]
        }
    }).state('setUnitDetail.buildingInfo', { //后台管理 单位资料维护  建筑物信息
        url:'/buildingInfo/:unit_id/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/unitsub/buildingInfo.html',
        controller:'buildingInfoController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/unitsub/buildingInfoController.js?pro=35');
			}]
        }
    }).state('setUnitDetail.fireCtrl', { //后台管理 单位资料维护  火灾控制器
        url:'/fireCtrl/:unit_id/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/unitsub/fireCtrl.html',
        controller:'fireCtrlController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/unitsub/fireCtrlController.js?pro=35');
			}]
        }
    }).state('setUnitDetail.waterSystem', { //后台管理 单位资料维护  水系统
        url:'/waterSystem/:unit_id/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/unitsub/waterSystem.html',
        controller:'waterSystemController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/unitsub/waterSystemController.js?pro=35');
			}]
        }
    }).state('setUnitDetail.outdoor', { //后台管理 单位资料维护  室外设施
        url:'/outdoor/:unit_id/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/unitsub/outdoor.html',
        controller:'outdoorController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/unitsub/outdoorController.js?pro=35');
			}]
        }
    }).state('setUnitDetail.indoor', { //后台管理 单位资料维护  室内消防栓
        url:'/indoor/:unit_id/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/unitsub/indoor.html',
        controller:'indoorController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/unitsub/indoorController.js?pro=35');
			}]
        }
    }).state('setUnitDetail.picture', { //后台管理 单位资料维护  图片信息
        url:'/picture/:unit_id/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/unitsub/picture.html',
        controller:'pictureController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/unitsub/pictureController.js?pro=35');
			}]
        }
    }).state('setUnitDetail.surface', { //后台管理 单位资料维护  消防图纸
        url:'/surface/:unit_id/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/unitsub/surface.html',
        controller:'surfaceController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/unitsub/surfaceController.js?pro=35');
			}]
        }
    }).state('setUnitDetail.surface.location', { //后台管理 单位资料维护  消防图纸  点位信息
        url:'/location/:unit_id/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/unitsub/location.html',
        controller:'locationController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/unitsub/locationController.js?pro=35');
			}]
        }
    }).state('setUnitDetail.map', { //后台管理 单位资料维护  地图
        url:'/map/:unit_id/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/unitsub/map.html',
        controller:'mapController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/unitsub/mapController.js?pro=35');
			}]
        }
    }).state('setUnitDetail.plan', { //后台管理 单位资料维护 灭火预案
        url:'/plan/:unit_id/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/unitsub/plan.html',
        controller:'planController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/unitsub/planController.js?pro=35');
			}]
        }
    }).state('logs', { //后台管理 日志
        url:'/logs/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/logs.html',
        controller:'logsController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/logsController.js?pro=35');
			}]
        }
    }).state('phoneList', { //后台管理 电话簿
        url:'/phoneList/:viewType/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/phoneList.html',
        controller:'phoneListController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/phoneListController.js?pro=35');
			}]
        }
    }).state('dictionary', { //后台管理 字典项
        url:'/dictionary/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/dictionary.html',
        controller:'dictionaryController',
        redirectTo: 'dictionary.manufacturer',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/dictionaryController.js?pro=35');
			}]
        }
    }).state('dictionary.manufacturer', { //后台管理 字典项 制造商
        url:'/manufacturer/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/dicsub/manufacturer.html',
        controller:'manufacturerController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/dicsub/manufacturerController.js?pro=35');
			}]
        }
    }).state('dictionary.controllerBrand', { //后台管理 字典项 控制器品牌
        url:'/controllerBrand/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/dicsub/controllerBrand.html',
        controller:'ctrlBrandController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/dicsub/ctrlBrandController.js?pro=35');
			}]
        }
    }).state('dictionary.controllerVersion', { //后台管理 字典项 控制器型号
        url:'/controllerVersion/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/dicsub/controllerVersion.html',
        controller:'ctrlVersionController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/dicsub/ctrlVersionController.js?pro=35');
			}]
        }
    }).state('dictionary.deviceType', { //后台管理 字典项 设备型号
        url:'/deviceType/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/dicsub/deviceType.html',
        controller:'deviceTypeController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/dicsub/deviceTypeController.js?pro=35');
			}]
        }
    }).state('dictionary.communication', { //后台管理 字典项 通讯方式
        url:'/communication/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/dicsub/communication.html',
        controller:'communicationController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/dicsub/communicationController.js?pro=35');
			}]
        }
    }).state('dictionary.apiType', { //后台管理 字典项 接口分类
        url:'/apiType/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/dicsub/apiType.html',
        controller:'apiTypeController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/dicsub/apiTypeController.js?pro=35');
			}]
        }
    }).state('dictionary.operator', { //后台管理 字典项 运营商
        url:'/operator/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/dicsub/operator.html',
        controller:'operatorController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/dicsub/operatorController.js?pro=35');
			}]
        }
    }).state('dictionary.systemSetting', { //后台管理 字典项 系统设置
        url:'/systemSetting/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/dicsub/systemSetting.html',
        controller:'systemSettingController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/dicsub/systemSettingController.js?pro=35');
			}]
        }
    }).state('accountManage', { //后台管理 账户管理
        url:'/accountManage/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/accountManage.html',
        controller:'accountManageController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/accountManageController.js?pro=35');
			}]
        }
    }).state('accountManage.addAccount', { //后台管理 账户弹窗
        url:'/addAccount/:account_id/:type_id/:token/:unit/:sys',
        params:{"show_win":null},
        templateUrl: './template/backgroundSys/addAccount.html',
        controller:'addAccountController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/addAccountController.js?pro=35');
			}]
        }
    }).state('deviceStatistics', { //后台管理 安装设备统计
        url:'/deviceStatistics/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/deviceStatistics.html',
        controller:'deviceStatisticsController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/deviceStatisticsController.js?pro=35');
			}]
        }
    }).state('alarmControls', { //后台管理 火灾控制器品牌统计
        url:'/alarmControls/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/alarmControls.html',
        controller:'deviceStatisticsAlarmController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/deviceStatisticsAlarmController.js?pro=35');
			}]
        }
    }).state('interfaceStatistics', { //后台管理 接口方式统计
        url:'/interfaceStatistics/:token/:unit/:sys',
        templateUrl: './template/backgroundSys/interfaceStatistics.html',
        controller:'deviceStatisticsInterfaceController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/backgroundSys/deviceStatisticsInterfaceController.js?pro=35');
			}]
        }
    }).state('unitStatistics', { //监管管理 单位类型火灾统计
        url:'/unitStatistics/:token/:unit/:sys',
        templateUrl: './template/superviseSys/unitStatistics.html',
        controller:'unitStatisticsController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/superviseSys/unitStatisticsController.js?pro=35');
			}]
        }
    }).state('areaStatistics', { //监管管理 单位类型火灾统计
        url:'/areaStatistics/:token/:unit/:sys',
        templateUrl: './template/superviseSys/areaStatistics.html',
        controller:'areaStatisticsController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/superviseSys/areaStatisticsController.js?pro=35');
			}]
        }
    }).state('alarmStatistics', { //监管管理 警情统计
        url:'/alarmStatistics/:token/:unit/:sys',
        templateUrl: './template/superviseSys/alarmStatistics.html',
        controller:'alarmStatisticsController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/superviseSys/alarmStatisticsController.js?pro=36');
			}]
        }
    }).state('makeAnnouncement', { //监管管理 发布通知
        url:'/makeAnnouncement/:token/:unit/:sys',
        templateUrl: './template/superviseSys/makeAnnouncement.html',
        controller:'makeAnnouncementController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/superviseSys/makeAnnouncementController.js?pro=35');
			}]
        }
    }).state('rankingStatistics', { //监管管理 排名
        url:'/rankingStatistics/:token/:unit/:sys',
        templateUrl: './template/superviseSys/rankingStatistics.html',
        controller:'rankingStatisticsController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/superviseSys/rankingStatisticsController.js?pro=35');
			}]
        }
    }).state('onlineStatistics', { //监管管理 在线走势
        url:'/onlineStatistics/:token/:unit/:sys',
        templateUrl: './template/superviseSys/onlineStatistics.html',
        controller:'onlineStatisticsController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/superviseSys/onlineStatisticsController.js?pro=35');
			}]
        }
    }).state('unitCheckTask', { //联网单位 巡检任务
        url:'/unitCheckTask/:token/:unit/:sys',
        templateUrl: './template/foregroundSys/checkTask.html',
        controller:'checkTaskController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/foregroundSys/checkTaskController.js?pro=35');
			}]
        }
    }).state('unitKeepWatch', { //联网单位 值班查岗
        url:'/unitKeepWatch/:token/:unit/:sys',
        templateUrl: './template/foregroundSys/keepWatch.html',
        controller:'keepWatchController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/foregroundSys/keepWatchController.js?pro=35');
			}]
        }
    }).state('unitInfo', { //联网单位 联网单位资料
        url:'/unitInfo/:token/:unit/:sys',
        templateUrl: './template/foregroundSys/networkUnit.html',
        controller:'networkUnitController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/foregroundSys/networkUnitController.js?pro=35');
			}]
        }
    }).state('unitFireAlarm', { //联网单位 火灾报警
        url:'/unitFireAlarm/:token/:unit/:sys',
        templateUrl: './template/foregroundSys/fireAlarm.html',
        controller:'fireAlarmController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/foregroundSys/fireAlarmController.js?pro=35');
			}]
        }
    }).state('unitTroubleAlarm', { //联网单位 故障信息
        url:'/unitTroubleAlarm/:token/:unit/:sys',
        templateUrl: './template/foregroundSys/troubleAlarm.html',
        controller:'troubleAlarmController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/foregroundSys/troubleAlarmController.js?pro=35');
			}]
        }
    }).state('unitRecordSearch', { //联网单位 记录查询
        url:'/unitRecordSearch/:token/:unit/:sys',
        params:{"recordId":null,"view_record":null},
        templateUrl: './template/foregroundSys/recordSearch.html',
        controller:'recordSearchController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/foregroundSys/recordSearchController.js?pro=35');
			}]
        }
    }).state('notice', { //联网单位 通知
        url:'/notice/:token/:unit/:sys',
        templateUrl: './template/foregroundSys/notice.html',
        controller:'noticeController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/foregroundSys/noticeController.js?pro=35');
			}]
        }
    }).state('unitCount', { //联网单位 统计分析
        url:'/unitCount/:token/:unit/:sys',
        templateUrl: './template/foregroundSys/unitCount.html',
        controller:'unitCountController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/foregroundSys/unitCountController.js?pro=36');
			}]
        }
    }).state('unitWaterAlarm', { //联网单位 水系统
        url:'/unitWaterAlarm/:token/:unit/:sys',
        templateUrl: './template/foregroundSys/waterAlarm.html',
        controller:'waterAlarmController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/foregroundSys/waterAlarmController.js?pro=35');
			}]
        }
    }).state('unitElecAlarm', { //联网单位 电气故障
        url:'/unitElecAlarm/:token/:unit/:sys',
        templateUrl: './template/foregroundSys/elecAlarm.html',
        controller:'elecAlarmController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/foregroundSys/elecAlarmController.js?pro=35');
			}]
        }
    }).state('unitSmokeAlarm', { //信息受理 排烟信息
        url:'/unitSmokeAlarm/:token/:unit/:sys',
        templateUrl: './template/foregroundSys/smokeAlarm.html',
        controller:'smokeAlarmController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/foregroundSys/smokeAlarmController.js?pro=35');
			}]
        }
    }).state('unitOtherAlarm', { //联网单位 其他故障
        url:'/unitOtherAlarm/:token/:unit/:sys',
        templateUrl: './template/foregroundSys/otherAlarm.html',
        controller:'otherAlarmController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/foregroundSys/otherAlarmController.js?pro=35');
			}]
        }
    }).state('downloads', { //联网单位 二维码下载
        url:'/downloads/:token/:unit/:sys',
        templateUrl: './template/foregroundSys/downloads.html',
        controller:'downloadsController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/foregroundSys/downloadsController.js?pro=35');
			}]
        }
    }).state('fullScreenMap', { //新开窗地图
        url:'/fullScreenMap/:token/:unit/:sys',
        templateUrl: './template/common/fullScreenMap.html',
        controller:'fullScreenMapController',
        resolve:{
            deps:['$ocLazyLoad', function($ocLazyLoad){
				return $ocLazyLoad.load('./controllers/common/fullScreenMapController.js?pro=35');
			}]
        }
    });
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
}]);