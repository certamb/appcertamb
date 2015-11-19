'use strict';

/* jshint -W098 */
angular.module('proyecto').controller('Proyecto.CertificacionAmbiental.Proyecto.Editar.DatosPrincipalesController',
    function ($scope, $state, toastr, proyecto) {

        $scope.working = false;

        $scope.view = {
            proyecto: proyecto
        };

        $scope.combo = {
            tipoProyecto: undefined
        };
        $scope.combo.selected = {
            tipoProyecto: {denominacion: proyecto.tipo, valor: proyecto.tipo}
        };

        $scope.loadCombo = function(){
            $scope.combo.tipoProyecto = [
                {denominacion: 'PERFIL', valor: 'PERFIL'},
                {denominacion: 'FACTIBILIDAD', valor: 'FACTIBILIDAD'}
            ];
        };
        $scope.loadCombo();

        $scope.save = function () {
            $scope.working = true;
            $scope.view.proyecto.tipo = $scope.combo.selected.tipoProyecto.valor;
            $scope.view.proyecto.$save().then(
                function (response) {
                    $scope.working = false;
                    toastr.success('Datos actualizados');
                },
                function error(err) {
                    toastr.error(err.data.message);
                }
            );
        };

    });
