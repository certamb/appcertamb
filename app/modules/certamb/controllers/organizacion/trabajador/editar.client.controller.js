'use strict';

/* jshint -W098 */
angular.module('certamb').controller('Certamb.Organizacion.Trabajador.EditarController',
  function ($scope, $state, $stateParams, toastr, trabajador, SGDialog, SGUsuarioKeycloak) {

    $scope.working = false;

    $scope.view = {
      trabajador: trabajador
    };

    $scope.remove = function () {
      SGDialog.confirm('Eliminar', 'Estas seguro de eliminar el trabajador?', function () {

        $scope.working = true;
        if ($scope.view.trabajador.usuario) {

          SGUsuarioKeycloak.$search({username: $scope.view.trabajador.usuario, max: 1}).then(
            function (response) {
              if (response.length) {
                //eliminar usuario
                //var keycloakUser = SGUsuarioKeycloak.$new(response[0].id);
                var keycloakUser = SGUsuarioKeycloak.$new(response[0].username);
                keycloakUser.$remove().then(
                  function () {
                    toastr.success('Usuario eliminado');
                  }, function error(err) {
                    toastr.warning('Usuario no pudo ser eliminado');
                  }
                );

                eliminarTrabajador();
              } else {
                toastr.warning('Usuario no pudo ser eliminado');
                eliminarTrabajador();
              }
            }, function error(err) {
              toastr.warning('Usuario no pudo ser eliminado');
              eliminarTrabajador();
            }
          );

        } else {
          eliminarTrabajador();
        }


        function eliminarTrabajador() {
          $scope.view.trabajador.$remove().then(
            function (response) {
              $scope.working = false;
              toastr.success('Trabajador eliminado');
              $state.go('certamb.app.organizacion.trabajador.buscar');
            },
            function error(err) {
              $scope.working = false;
              toastr.error(err.data.message);
            }
          );
        }


      });
    };

  })
;
