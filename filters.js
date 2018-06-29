/**
 * Created by Lxy on 2017/12/7.
 */
var filters = angular.module('filters', []);
filters.filter('dic_filter', function(){
    return function(text, params){
        if(params&&params.length&&params!=null&&params!=''){
            var lenght = params.length;
            for(var i = 0; i < lenght; i++){
                if(text == params[i].id){
                    text = params[i].name;
                    return text;
                    break;
                }
            }
        }
    }
});
filters.filter('area_filter', function(){
    return function(text, params){
        if(params&&params.length&&params!=null&&params!=''){
            var lenght = params.length;
            for(var i = 0; i < lenght; i++){
                if(text == params[i].id){
                    text = params[i].regionName;
                    return text;
                    break;
                }
            }
        }
    }
});
filters.filter('model_filter', function(){
    return function(text, params){
        if(params&&params.length&&params!=null&&params!=''){
        	var flag = false;
            var lenght = params.length;
            for(var i = 0; i < lenght; i++){
                if(text == params[i].id){
                    text = params[i].modeName;
                    flag = true;
                    break;
                }
            }
            if(flag){
            	return text;
            }else{
            	return '';
            }
        }
    }
});
/*消防大队*/
filters.filter('fams_filter', function(){
    return function(text, params){
        if(params&&params.length&&params!=null&&params!=''){
            var lenght = params.length;
            for(var i = 0; i < lenght; i++){
                if(text == params[i].id){
                    text = params[i].superiorName;
                    return text;
                    break;
                }
            }
        }
    }
});
/*建筑物*/
filters.filter('bulding_filter', function(){
    return function(text, params){
        if(params&&params.length&&params!=null&&params!=''){
            var lenght = params.length;
            for(var i = 0; i < lenght; i++){
                if(text == params[i].id){
                    text = params[i].code;
                    return text;
                    break;
                }
            }
        }
    }
});
/*接口类型*/
filters.filter('api_filter', function(){
    return function(text, params){
        if(params&&params.length&&params!=null&&params!=''){
            var lenght = params.length;
            for(var i = 0; i < lenght; i++){
                if(text == params[i].id){
                    text = params[i].typeName;
                    return text;
                    break;
                }
            }
        }
    }
});
//去重
filters.filter('unique', function () {
  	return function (collection, keyname) {
    	var output = [],
      	keys = [];
    	angular.forEach(collection, function (item) {
	      	var key = item[keyname];
	      	if (keys.indexOf(key) === -1) {
	        	keys.push(key);
	        	output.push(item);
	     	 }
    	});
    	return output;
  };
});
/*分屏左侧单位编码过滤*/
filters.filter('code_filter', function(){
    return function(text, params){
        if(params&&params.length&&params!=null&&params!=''){
            var lenght = params.length;
            for(var i = 0; i < lenght; i++){
                if(text == params[i].id){
                    text = params[i].code;
                    return text;
                    break;
                }
            }
        }
    }
});
/*分屏左侧单位名称过滤*/
filters.filter('name_filter', function(){
    return function(text, params){
        if(params&&params.length&&params!=null&&params!=''){
            var lenght = params.length;
            for(var i = 0; i < lenght; i++){
                if(text == params[i].id){
                    text = params[i].name;
                    return text;
                    break;
                }
            }
        }
    }
});
/*分屏左侧地址过滤*/
filters.filter('address_filter', function(){
    return function(text, params){
        if(params&&params.length&&params!=null&&params!=''){
            var lenght = params.length;
            for(var i = 0; i < lenght; i++){
                if(text == params[i].id){
                    text = params[i].address.address;
                    return text;
                    break;
                }
            }
        }
    }
});
/*分屏左侧联系电话过滤*/
filters.filter('contact_filter', function(){
    return function(text, params){
        if(params&&params.length&&params!=null&&params!=''){
            var lenght = params.length;
            for(var i = 0; i < lenght; i++){
                if(text == params[i].id){
                    text = params[i].famCustomerSite.contactinfo;
                    return text;
                    break;
                }
            }
        }
    }
});
/*分屏左侧消控室过滤*/
filters.filter('ctrl_filter', function(){
    return function(text, params){
        if(params&&params.length&&params!=null&&params!=''){
            var lenght = params.length;
            for(var i = 0; i < lenght; i++){
                if(text == params[i].id){
                    text = params[i].famCustomerSite.controlRoomContactinfo;
                    return text;
                    break;
                }
            }
        }
    }
});
/*制造商电话过滤*/
filters.filter('manu_contact', function(){
    return function(text, params){
        if(params&&params.length&&params!=null&&params!=''){
            var lenght = params.length;
            for(var i = 0; i < lenght; i++){
                if(text == params[i].id){
                    text = params[i].contactinfo;
                    return text;
                    break;
                }
            }
        }
    }
});
/*区域拼音过滤*/
filters.filter('area_code', function(){
    return function(text, params){
        if(params&&params.length&&params!=null&&params!=''){
            var lenght = params.length;
            var flag = false;
            for(var i = 0; i < lenght; i++){
                if(text == params[i].id){
                    text = params[i].regionPinyin;
                    flag = true;
                    break;
                }
            }
            if(flag){
            	return text;
            }else{
            	return 'AB'
            }
        }
    }
});
filters.filter('region_name', function(){
    return function(text, params){
        if(params&&params.length&&params!=null&&params!=''){
            var lenght = params.length;
            for(var i = 0; i < lenght; i++){
                if(text == params[i].regionName){
                    text = params[i].id;
                    return text;
                    break;
                }
            }
        }
    }
});