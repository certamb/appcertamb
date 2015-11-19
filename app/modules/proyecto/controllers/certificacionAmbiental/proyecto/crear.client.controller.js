'use strict';

/* jshint -W098 */
angular.module('proyecto').controller('Proyecto.CertificacionAmbiental.Proyecto.CrearController',
    function ($scope, $state, $stateParams, toastr, DIRECCION_REGIONAL, SGDialog, SGDireccionRegional, SGProyecto) {

        $scope.working = false;

        $scope.view = {
            proyecto: SGProyecto.$build()
        };

        $scope.combo = {
            direccionRegional: undefined,
            tipoProyecto: undefined
        };
        $scope.combo.selected = {
            direccionRegional: DIRECCION_REGIONAL ? DIRECCION_REGIONAL : undefined,
            tipoProyecto: undefined
        };

        $scope.loadCombo = function(){
            if ($scope.access.administrarProyectos) {
                SGDireccionRegional.$getAll().then(function(response){
                    $scope.combo.direccionRegional =response;
                });
            } else if ($scope.access.administrarProyectosDireccionRegional) {
                $scope.combo.direccionRegional = [DIRECCION_REGIONAL];
            } else {
                console.log('User not authenticated for this action.');
            }

            $scope.combo.tipoProyecto = [
                {denominacion: 'PERFIL', valor: 'PERFIL'},
                {denominacion: 'FACTIBILIDAD', valor: 'FACTIBILIDAD'}
            ];
        };
        $scope.loadCombo();

        $scope.save = function () {
            SGDialog.confirm('Guardar', '¿Estas seguro de crear el proyecto?', function () {
                $scope.working = true;
                $scope.view.proyecto.direccionRegional = {id: $scope.combo.selected.direccionRegional.id};
                $scope.view.proyecto.tipo = $scope.combo.selected.tipoProyecto.valor;
                $scope.view.proyecto.$save().then(
                    function (response) {
                        toastr.success('Proyecto creado');
                        $scope.working = false;
                        $state.go('^.editar', {proyecto: response.id});
                    },
                    function error(err) {
                        toastr.error(err.data.message);
                    }
                );
            });
        };

    })
;
