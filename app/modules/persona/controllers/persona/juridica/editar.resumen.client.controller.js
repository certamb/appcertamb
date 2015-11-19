'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.Juridica.EditarPersonaJuridica.ResumenController',
    function ($scope, $state, personaJuridica) {

        $scope.view = {
            persona: personaJuridica
        };

        $scope.view.load = {
            accionistas: []
        };

        $scope.loadAccionistas = function () {
            $scope.view.persona.SGAccionista().$getAll().then(function (response) {
                $scope.view.load.accionistas = response;
            });
        };
        $scope.loadAccionistas();

        $scope.verPersona = function (item) {
            $state.go('^.^.editarPersonaNatural.resumen', {id: item.id});
        };

    });

