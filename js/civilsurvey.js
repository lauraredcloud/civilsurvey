'use strict';

var app = angular.module('civilSurvey', ['ngSanitize','ngAnimate']);

app.controller('surveyCtrl', function($scope,$http,$attrs) {

	$scope.surveyValues = {}; // Respondent values
	$scope.pageIndex = 0;
	$scope.surveyFinished = false;
	$scope.submittedPage = false;
	
    $scope.nextPage = function(valid){
    	$scope.submittedPage = true;
    	if(valid){
    		$scope.pageIndex++;
    		if($scope.pageIndex == $scope.survey.pages.length - 1) $scope.surveyFinished = true;
    	}
    };
});

app.directive("survey", function($http,$location) {
    return {
      restrict: 'E',
      templateUrl: "../../templates/survey.html",
      link: function(scope, element, attrs){
			var fullSpath = $location.absUrl()+attrs.src;
			
			$http.get(fullSpath)
			.success(function(response) {
				console.log("loaded survey at "+fullSpath);
				scope.survey = response.survey;
			})
			.error(function(response) {
				scope.surveyError = "Could not load "+fullSpath;
			});
	    }
    };
});

app.controller('questionCtrl', function($scope,$http,$location) {

	$scope.questionData = {}; // Question metadata from JSON
	$scope.questionError = "";
	$scope.submitted = 0;
	$scope.input_types = ["text","number","email","url"];
	
	$scope.loadQuestion = function(qpath){
		var fullQpath = $location.absUrl()+qpath;
    	$http.get(fullQpath)
    	.success(function(response){
    		$scope.questionData = response.question;
    		$scope.submitted = 0;
    	})
    	.error(function(response){
    		$scope.questionError = "Could not load "+fullQpath;
    	});
    }
	
});

app.directive("question", function() {
    return {
      restrict: 'E',
      templateUrl: "../../templates/question.html"
    };
});