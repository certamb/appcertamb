'use strict';

/* jshint -W098 */
angular.module('certamb').controller('Certamb.Organizacion.DireccionRegional.CrearController',
    function ($scope, $state, $stateParams, toastr, SGDireccionRegional) {

        $scope.working = false;

        $scope.view = {
            direccionRegional: SGDireccionRegional.$build()
        };

        $scope.save = function () {
            $scope.working = true;
            $scope.view.direccionRegional.$save($scope.view.direccionRegional).then(
                function (response) {
                    toastr.success('Direccion regional creada');
                    $scope.working = false;
                    $state.go('^.buscar');
                    //$state.go('^.editar', {personaNatural: response.id});
                },
                function error(err) {
                    toastr.error(err.data.message);
                }
            );
        };

    })
;
