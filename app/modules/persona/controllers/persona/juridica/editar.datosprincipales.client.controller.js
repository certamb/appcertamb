'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.Juridica.EditarPersonaJuridica.DatosPrincipalesController',
    function ($scope, $state, personaJuridica, SGCountryCode, SGTipoDocumento, SGTipoEmpresa, SGPersonaJuridica, toastr) {

        $scope.working = false;

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

        $scope.view = {
            persona: personaJuridica
        };

        $scope.save = function () {
            $scope.view.persona.codigoPais = $scope.combo.selected.pais.alpha3Code;
            $scope.view.persona.tipoEmpresa = $scope.combo.selected.tipoEmpresa;
            $scope.working = true;
            $scope.view.persona.$save().then(
                function (response) {
                    $scope.working = false;
                    toastr.success('Persona actualizada');
                },
                function error(err) {
                    toastr.error(err.data.errorMessage);
                }
            );
        };

    });

