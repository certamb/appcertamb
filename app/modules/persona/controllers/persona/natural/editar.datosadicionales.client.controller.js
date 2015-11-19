'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.Natural.EditarPersonaNatural.DatosAdicionalesController',
    function ($scope, personaNatural, toastr) {

        $scope.working = false;

        $scope.view = {
            persona: personaNatural
        };

        $scope.save = function () {
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
