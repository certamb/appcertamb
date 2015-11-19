'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.Juridica.CrearPersonaJuridica.DatosPrincipalesController',
    function ($scope, $state, $stateParams, toastr, SGPersonaJuridica, SGCountryCode, SGTipoDocumento, SGTipoEmpresa) {

        $scope.combo = {
            pais: undefined,
            tipoDocumento: undefined,
            tipoEmpresa: undefined
        };
        $scope.combo.selected = {
            pais: undefined,
            tipoDocumento: undefined,
            tipoEmpresa: $scope.view.persona.tipoEmpresa
        };

        $scope.loadCombo = function () {
            SGCountryCode.$getAll().then(function (response) {
                $scope.combo.pais = response;
            });
            SGTipoDocumento.$search({tipoPersona: 'juridica'}).then(function (response) {
                $scope.combo.tipoDocumento = response.items;
            });
            SGTipoEmpresa.$getAll().then(function (response) {
                $scope.combo.tipoEmpresa = response;
            });
        };
        $scope.loadCombo();

        $scope.check = function ($event) {
            if ($event) {
                $event.preventDefault();
            }
            if ($scope.combo.selected.tipoDocumento && $scope.view.persona.numeroDocumento) {
                SGPersonaJuridica.$search({
                    tipoDocumento: $scope.combo.selected.tipoDocumento.abreviatura,
                    numeroDocumento: $scope.view.persona.numeroDocumento
                }).then(function (response) {
                    if (response.items.length) {
                        toastr.warning('Documento de identidad No disponible');
                    } else {
                        toastr.info('Documento de identidad disponible');
                    }
                });
            }
        };

        $scope.goTabRepresentante = function () {
            if ($scope.form.$valid) {
                $scope.view.persona.tipoEmpresa = $scope.combo.selected.tipoEmpresa;
                $state.go('^.representante');
            } else {
                $scope.form.$setSubmitted();
            }
        };

    });
