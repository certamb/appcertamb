'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.Natural.EditarPersonaNatural.DatosPrincipalesController',
    function ($scope, $state, toastr, personaNatural, SGCountryCode, SGSexo, SGEstadoCivil) {

        $scope.working = false;

        $scope.view = {
            persona: personaNatural
        };
        $scope.view.persona.fechaNacimiento = new Date($scope.view.persona.fechaNacimiento);

        $scope.combo = {
            pais: undefined,
            sexo: undefined,
            estadoCivil: undefined
        };
        $scope.combo.selected = {
            sexo: personaNatural.sexo,
            estadoCivil: personaNatural.estadoCivil
        };

        $scope.loadCombos = function () {
            SGSexo.$getAll().then(function (response) {
                $scope.combo.sexo = response;
            });
            SGEstadoCivil.$getAll().then(function (response) {
                $scope.combo.estadoCivil = response;
            });
        };
        $scope.loadCombos();

        $scope.save = function () {
            $scope.view.persona.sexo = $scope.combo.selected.sexo;
            $scope.view.persona.estadoCivil = $scope.combo.selected.estadoCivil;
            $scope.working = true;
            $scope.view.persona.$save().then(
                function (response) {
                    $scope.working = false;
                    toastr.success('Persona actualizada');
                },
                function error(err) {
                    toastr.error(err.data.errorMessage, 'Error');
                }
            );
        };

    });
