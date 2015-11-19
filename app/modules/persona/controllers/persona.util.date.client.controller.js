'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.Util.DateController', ['$scope',
    function($scope) {

        $scope.opened = false;
        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date(1920, 0, 1);
        };
        $scope.toggleMin();

        $scope.toggleMax = function() {
            $scope.maxDate = $scope.maxDate || new Date();
        };
        $scope.toggleMax();

    }
]);
