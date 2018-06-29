/**
 * Created by Lxy on 2017/12/28.
 */
app.controller('otherAlarmController', ['$scope','$timeout', function($scope,$timeout){
	$timeout(function(){
		var player = new EZUIPlayer('myPlayer');
	    player.on('error', function(){
	        console.log('error');
	    });
	    player.on('play', function(){
	        console.log('play');
	    });
	    player.on('pause', function(){
	        console.log('pause');
	    });
	},1000);
}]);