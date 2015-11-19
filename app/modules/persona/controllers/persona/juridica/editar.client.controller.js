'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.Juridica.EditarPersonaJuridicaController',
    function ($scope, $state, toastr, personaJuridica, SGDialog) {

        $scope.view = {
            persona: personaJuridica
        };

        $scope.remove = function(){
            SGDialog.confirm('Eliminar', '¿Estas seguro de eliminar la persona?', function () {
                $scope.view.persona.$remove().then(
                    function (response) {
                        toastr.success('Persona eliminada');
                        $state.go('persona.app.persona.juridica.buscar');
                    },
                    function error(err) {
                        toastr.error(err.data.errorMessage);
                    }
                );
            });
        };

    });

