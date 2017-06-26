var app = angular.module('Licenta')
    app.controller('HomepageCtrl', ['$scope','$window', '$routeParams', '$filter', '$http', 'AIService', function ($scope, $window, $routeParams, $filter, $http, AIService) {

        $scope.dataFromBack = [];

        $scope.sub = function () {
            $http.post('/view', $scope.parentData).
                success(function (data) {
                    $scope.dataFromBack.push(data);
                    console.log($scope.dataFromBack);
                    console.log($scope.parentData);
//                    var target = document.getElementById('target');
//                    var firstElem = angular.element("<div class='parent' ng-model='parentData.desc'>"+ $scope.parentData.desc +"</div>");
//                    angular.element(target).append(firstElem);
                    $scope.jsonObj = [];
                    data.forEach(function (value) {
						value = value.replace("if",  '/\\');

                        var id = value;
                        var name = value;
                        item = {}
                        item ["id"] = id;
                        item ["name"] = name;
                       $scope.jsonObj.push(item);
                    });
                   	$scope.vm = {};
					$scope.vm.Courses = $scope.jsonObj;
                    console.log("posted successfully");
                }).error(function (data) {
                    console.error("error in posting");
                })
        };
		
		$scope.OpenCourse = function(courseId) {
				$http.post('/ceva', courseId).
					success(function (data) {
						console.log(courseId.name);
						console.log(data);
						$scope.jsonObj = [];
					var target = document.getElementById(courseId);
						data.forEach(function (value) {
							value = value.replace("if",  '/\\');
							var id = value;
							var name = value;
							item = {}
							item ["id"] = id;
							item ["name"] = name;
							$scope.jsonObj.push(item);
							console.log("posted successfully " + courseId.id);
							$scope.cv = {};
							$scope.cv.CoursesChild = $scope.jsonObj;
							var firstElem = angular.element("<div ng-repeat=\"course in cv.Courses\" id=\""+ item.id+ "\" ng-click=\"OpenCourse(course)\" ><label >"+ item.name + "</label></div>");
							angular.element(target).append(firstElem);
						});
						console.log("posted successfully inner " +  item.name );
					}).error(function (data) {
						console.error("error in posting");
					})
			
			$window.alert("Called " + courseId.id + courseId.name);
			};
	console.log("posted successfully course");
	console.log($scope.jsonObj);
    }]);

 	
	