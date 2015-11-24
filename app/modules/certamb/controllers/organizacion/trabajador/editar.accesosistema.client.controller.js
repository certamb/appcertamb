'use strict';

/* jshint -W098 */
angular.module('certamb').controller('Certamb.Organizacion.Trabajador.Editar.AccesoSistemaController',
  function ($scope, $state, $window, $stateParams, toastr, trabajador, SGDialog, SGUsuarioKeycloak, SGTrabajador) {

    $scope.working = false;

    $scope.view = {
      trabajador: trabajador,
      usuario: trabajador.usuario
    };

    $scope.crearUsuarioKeycloak = function () {
      $window.open(SGUsuarioKeycloak.$getCreateRealmUserUrl());
    };

    $scope.desvincular = function () {
      SGDialog.confirm('Desvincular', 'Estas seguro de quitar el usuario para el trabajador?', function () {
        $scope.view.trabajador.$removeUsuario().then(
          function (response) {
            toastr.success('Trabajador actualizado');
            $scope.view.usuario = undefined;
            $scope.view.trabajador.usuario = undefined;
          },
          function error(err) {
            toastr.error(err.data.errorMessage);
          }
        );
      });
    };

    $scope.save = function () {
      $scope.working = true;
      SGUsuarioKeycloak.$search({username: $scope.view.usuario, max: 1}).then(function (response1) {
        if (response1.length) {
          var criteria = {
            filters: [{name: 'usuario', value: $scope.view.usuario, operator: 'eq'}],
            paging: {page: 1, pageSize: 20}
          };
          SGTrabajador.$search(criteria).then(function (response2) {
            if (!response2.items.length) {
              $scope.view.trabajador.usuario = $scope.view.usuario;
              $scope.view.trabajador.$setUsuario().then(
                function () {
                  toastr.success('Trabajador actualizado');
                  $scope.working = false;
                  $scope.view.trabajador.usuario = $scope.view.usuario;
                },
                function error(err) {
                  $scope.working = false;
                  toastr.error(err.data.errorMessage);
                }
              );
            } else {
              $scope.working = false;
              toastr.warning('Usuario ya fue asignado a otro trabajador');
            }
          });
        } else {
          $scope.working = false;
          toastr.warning('Usuario no encontrado en Keycloak');
        }
      }, function error(err){
        $scope.working = false;
      });

    };

  });
