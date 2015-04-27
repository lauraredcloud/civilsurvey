// Introduce the module
var app = angular.module('civilSurvey', ['ngSanitize','ngAnimate']);

// Get the current script path, so I don't have to use relative URLs
var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length-1].src;

// Survey Controller
app.controller('surveyCtrl', function($scope,$http,$attrs) {

	$scope.surveyValues = {}; // Respondent values
	$scope.pageIndex = 0;
	$scope.surveyFinished = false;
	$scope.submittedPage = false;
	
	// Allows me to check if a value is an object in the template logic
	$scope.isObject = angular.isObject;
	
	// Submit and go to the next page
    $scope.nextPage = function(valid){
    	$scope.submittedPage = true;
    	if(valid){
    		$scope.submittedPage = false; // Reset submitted for next page
    		$scope.pageIndex++;
    		if($scope.pageIndex == $scope.survey.pages.length - 1){
    			$scope.surveyFinished = true;
    		}
    	}
    };
    
    // Update the number of checks (hidden) number field, so I can validate a checkbox question for required, minimum number of checks, and maximum number of checks. 
    $scope.updateNumchecks = function(qname){
    	$scope.surveyValues[qname].numChecks = $scope.surveyValues[qname].numChecks || 0;
    	var count = 0;

    	if($scope.surveyValues[qname] != undefined){
    	
			jQuery.each($scope.surveyValues[qname], function(k,v){
				if(k != "numChecks" && v === true){
					count++;
				}
			});
			$scope.surveyValues[qname].numChecks = count;
		}
    };
    
});

// Question Controller
app.controller('questionCtrl', function($scope,$http,$location) {

	$scope.questionData = {}; // Question metadata from JSON
	$scope.questionError = "";
	$scope.submitted = 0;
	$scope.input_types = ["text","number","email","url"];
	
	// Load a question from JSON
	$scope.loadQuestion = function(qpath){
		var fullQpath = $location.absUrl()+qpath;
    	$http.get(fullQpath)
    	.success(function(response){    	
    		$scope.questionData = response.question;
    		$scope.shuffleOptions();
    		$scope.submitted = 0;
    	})
    	.error(function(response){
    		$scope.questionError = "Could not load "+fullQpath;
    	});
    };
    
    // Shuffle options, if needed
    $scope.shuffleOptions = function(){
		// Randomize options, if needed
		if($scope.questionData.shuffle){
		
			var shuffledOps = [];
			var nonShuffledOps = [];
		
			// Remove shuffle exempt from array
			angular.forEach($scope.questionData.options,function(v){
				console.log(v);
				if(v.shuffle_exempt){
					nonShuffledOps.push(v);
				}
				else {
					shuffledOps.push(v);
				}
			});
			
			// Do the shuffle
			var shuffledOps = shuffleOptions(shuffledOps);
			
			// Merge the non-shuffle things back onto the array
			shuffledOps = shuffledOps.concat(nonShuffledOps);
			
			// Replace the original array
			$scope.questionData.options = shuffledOps;
		}
    }
	
});

// Survey Template
app.directive("survey", function($http,$location) {
    return {
      restrict: 'E',
      templateUrl: currentScriptPath.replace('js/civilsurvey.js', 'templates/survey.html'),
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

// Question Template
app.directive("question", function() {
    return {
      restrict: 'E',
      templateUrl: currentScriptPath.replace('js/civilsurvey.js', 'templates/question.html')
    };
});

// Individual question type templates
app.directive("inputText", function(){
	return {
		restrict: 'E',
		templateUrl: currentScriptPath.replace('js/civilsurvey.js', 'templates/inputText.html')
	};
});

///////////////
/// Support ///
///////////////

// Fisher–Yates shuffle algorithm
function shuffleOptions(array) {
	console.log("shuffle options");
  var m = array.length, t, i;

  // While there remain elements to shuffle
  while (m) {
	// Pick a remaining element…
	i = Math.floor(Math.random() * m--);

	// And swap it with the current element.
	t = array[m];
	array[m] = array[i];
	array[i] = t;
  }

  return array;
};