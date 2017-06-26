angular.module('Licenta', ['ngCookies', 'ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/homepage', {
                templateUrl: 'views/homepage.html',
                controller: 'HomepageCtrl'
            })
            .when('/basic', {
                templateUrl: 'views/basic-example.html',
                controller: 'TreeController'
            })
            .otherwise({
                redirectTo: '/homepage'
            });
    }])
