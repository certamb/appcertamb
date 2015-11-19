'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.Juridica.EditarPersonaJuridica.DatosAdicionalesController',
    function ($scope, personaJuridica, toastr) {

        $scope.working = false;

        $scope.view = {
            persona: personaJuridica
        };

        $scope.save = function () {
            $scope.working = true;
            $scope.view.persona.$save().then(
                function (data) {
                    $scope.working = false;
                    toastr.success('Persona actualizada');
                },
                function error(err) {
                    toastr.error(err.data.errorMessage);
                }
            );
        };

    });




