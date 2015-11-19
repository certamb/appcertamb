'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.TipoDocumento.CrearTipoDocumentoController',
    function ($scope, $state, SGTipoDocumento, SGTipoPersona, toastr) {

        $scope.working = false;

        $scope.view = {
            tipoDocumento: SGTipoDocumento.$build()
        };

        $scope.combo = {
            tipoPersona: SGTipoPersona.$getAll().$object
        };
        $scope.combo.selected = {
            tipoPersona: undefined
        };

        $scope.save = function () {
            $scope.view.tipoDocumento.tipoPersona = $scope.combo.selected.tipoPersona;

            $scope.working = true;

            $scope.view.tipoDocumento.$save().then(
                function (response) {
                    toastr.success('Tipo documento creado');
                    $scope.working = false;
                    $state.go('^.editar', {documento: $scope.view.tipoDocumento.abreviatura});
                },
                function error(err) {
                    toastr.error(err.data.errorMessage);
                }
            );
        };

        $scope.cancel = function () {
            $state.go('^.buscar');
        };

    });
