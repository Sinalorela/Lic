angular.module('Licenta')

    // super simple service
    // each function returns a promise object 
    .factory('AIService', ['$http', '$routeParams', function ($http, $routeParams) {
        return {
            get: function () {
                return $http.get('/api/homepage');
            },
            post: function () {
                return $http.get('/api/homepage');
            }
        }
    }]);

(function (ng) {
    var treeServiceApp = ng.module('tree.service', ['tree.factory']);
    treeServiceApp.service("TreeService", ["$http", "URLConfig", function ($http, URLConfig) {
        this.getTree = function () {
            return $http.get(URLConfig.tree);
        };
    }]);
})(angular);
