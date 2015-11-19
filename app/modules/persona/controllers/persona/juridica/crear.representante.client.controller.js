'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.Juridica.CrearPersonaJuridica.RepresentanteController',
    function ($scope, $state, toastr, SGTipoDocumento, SGPersonaNatural) {

        $scope.verificarDatos = function () {
            if (!$scope.view.persona.razonSocial) {
                $state.go('^.datosPrincipales');
            }
        };
        $scope.verificarDatos();

        $scope.view = {
            representante: $scope.view.persona.representanteLegal
        };

        $scope.combo = {
            tipoDocumento: undefined
        };
        $scope.combo.selected = {
            tipoDocumento: undefined
        };

        $scope.loadCombo = function () {
            SGTipoDocumento.$search({tipoPersona: 'natural'}).then(function (response) {
                $scope.combo.tipoDocumento = response.items;
            });
        };
        $scope.loadCombo();

        $scope.setRepresentante = function ($event) {
            if ($event) {
                $event.preventDefault();
            }
            if ($scope.combo.selected.tipoDocumento && $scope.view.representante.numeroDocumento) {
                SGPersonaNatural.$search({
                    tipoDocumento: $scope.combo.selected.tipoDocumento.abreviatura,
                    numeroDocumento: $scope.view.representante.numeroDocumento
                }).then(function (response) {
                    if (response.items.length) {
                        $scope.view.representante = response.items[0];
                        $scope.$parent.view.persona.representanteLegal = response.items[0];
                        toastr.info('Persona encontrada');
                    } else {
                        toastr.warning('Persona no encontrada');
                    }
                });
            }
        };

    });
