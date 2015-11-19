'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.TipoDocumento.EditarTipoDocumentoController',
    function ($scope, $state, toastr, tipoDocumento, SGDialog, SGTipoDocumento, SGTipoPersona) {

        $scope.working = false;

        $scope.view = {
            tipoDocumento: tipoDocumento
        };

        $scope.combo = {
            tipoPersona: SGTipoPersona.$getAll().$object
        };
        $scope.combo.selected = {
            tipoPersona: tipoDocumento.tipoPersona
        };

        $scope.enable = function(){
            SGDialog.confirm('Activar', '¿Estas seguro de activar el documento?', function () {
                $scope.view.tipoDocumento.$enable().then(
                    function (response) {
                        $scope.view.tipoDocumento.estado = true;
                        toastr.success('Tipo documento activado');
                    },
                    function error(err) {
                        toastr.error(err.data.errorMessage);
                    }
                );
            });
        };

        $scope.disable = function(){
            SGDialog.confirm('Desactivar', '¿Estas seguro de desactivar el documento?', function () {
                $scope.view.tipoDocumento.$disable().then(
                    function (response) {
                        $scope.view.tipoDocumento.estado = false;
                        toastr.success('Tipo documento desactivado');
                    },
                    function error(err) {
                        toastr.error(err.data.errorMessage);
                    }
                );
            });
        };

        $scope.remove = function(){
            SGDialog.confirm('Eliminar', '¿Estas seguro de eliminar el documento?', function () {
                $scope.view.tipoDocumento.$remove().then(
                    function (response) {
                        toastr.success('Tipo documento eliminado');
                        $state.go('^.buscar');
                    },
                    function error(err) {
                        toastr.error(err.data.errorMessage);
                    }
                );
            });
        };

        $scope.save = function () {
            $scope.view.tipoDocumento.tipoPersona = $scope.combo.selected.tipoPersona;
            $scope.working = true;
            $scope.view.tipoDocumento.$save().then(
                function (response) {
                    $scope.working = false;
                    toastr.success('Tipo documento actualizado');
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
