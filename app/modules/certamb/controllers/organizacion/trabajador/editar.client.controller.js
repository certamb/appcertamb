'use strict';

/* jshint -W098 */
angular.module('certamb').controller('Certamb.Organizacion.Trabajador.EditarController',
    function ($scope, $state, $stateParams, toastr, trabajador, SGDialog) {

        $scope.working = false;

        $scope.view = {
            trabajador: trabajador
        };

        $scope.remove = function () {
            SGDialog.confirm('Eliminar', 'Estas seguro de eliminar el trabajador?', function () {
                $scope.view.trabajador.$remove().then(
                    function (response) {
                        toastr.success('Trabajador eliminado');
                        $state.go('configuracion.app.organizacion.trabajador.buscar');
                    },
                    function error(err) {
                        toastr.error(err.data.message);
                    }
                );
            });
        };

    })
;
