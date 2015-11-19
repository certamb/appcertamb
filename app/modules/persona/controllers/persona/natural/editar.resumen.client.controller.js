'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.Natural.EditarPersonaNatural.ResumenController',
    function ($scope, $uibModal, personaNatural) {

        $scope.view = {
            persona: personaNatural
        };

        $scope.openCambiarFotoModal = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/modules/persona/client/views/natural/form-editar-cambiarFoto.html',
                controller: 'Persona.Natural.EditarPersonaNatural.CambiarFotoModalController',
                size: 'lg',
                resolve: {
                    personaNatural: function () {
                        return $scope.view.persona;
                    }
                }
            });

            modalInstance.result.then(function (persona) {
                $scope.view.persona = persona;
            }, function () {
            });

        };

    });
