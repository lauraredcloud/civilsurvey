'use strict';

var app = angular.module('civilSurvey', ['ngSanitize','ngAnimate']);

app.controller('surveyCtrl', function($scope,$http) {

	$scope.surveyValues = {}; // Respondent values
	$scope.pageIndex = 0;
	$scope.surveyFinished = false;
	$scope.submittedPage = false;

	$http.get("json/survey.json")
    .success(function(response) {
    	$scope.survey = response.survey;
    });
    
    $scope.nextPage = function(valid){
    	$scope.submittedPage = true;
    	if(valid){
    		$scope.pageIndex++;
    		if($scope.pageIndex == $scope.survey.pages.length - 1) $scope.surveyFinished = true;
    	}
    };
});

app.directive("survey", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/survey.html"
    };
});

app.controller('questionCtrl', function($scope,$http) {

	$scope.questionData = {}; // Question metadata from JSON
	$scope.questionError = "";
	$scope.submitted = 0;
	$scope.input_types = ["text","number","email","url"];
	
	$scope.loadQuestion = function(qname){
    	$http.get("json/"+qname+".json")
    	.success(function(response){
    		$scope.questionData = response.question;
    		$scope.submitted = 0;
    	})
    	.error(function(response){
    		$scope.questionError = "Could not load "+qname+".json!";
    	});
    }
	
});

app.directive("question", function() {
    return {
      restrict: 'E',
      templateUrl: "templates/question.html"
    };
});