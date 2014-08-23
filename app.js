var myApp = angular.module('myApp', []);

function MainCtrl($scope, Data){
  $scope.showHeaders = true;
  $scope.page = 'None';
  
  $scope.reversedMessage = function(message) {
    return message.split("").reverse().join("");
	}
}
