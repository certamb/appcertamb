'use strict';

/* jshint -W098 */
angular.module('configuracion').controller('Configuracion.Organizacion.DireccionRegional.EditarController',
    function ($scope, $state, $stateParams, toastr, direccionRegional, SGDireccionRegional) {

        $scope.working = false;

        $scope.view = {
            direccionRegional: direccionRegional
        };

        $scope.save = function () {
            $scope.working = true;
            $scope.view.direccionRegional.$save($scope.view.direccionRegional).then(
                function (response) {
                    toastr.success('Direccion regional actualizada');
                    $scope.working = false;
                },
                function error(err) {
                    toastr.error(err.data.message);
                }
            );
        };

    })
;
