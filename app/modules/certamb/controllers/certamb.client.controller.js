'use strict';

/* jshint -W098 */
angular.module('certamb').controller('CertambController', ['$scope', 'Auth',
  function ($scope, Auth) {

    $scope.package = {
      name: 'certamb'
    };

    function getAccess(role) {
      if (!Auth) {
        return false;
      }

      var rolesSession = Auth.authz.resourceAccess.certamb_app.roles;
      if (rolesSession.indexOf(role) !== -1) {
        return true;
      }

      return false;
    }

    $scope.access = {
      get createRealm() {
        return Auth.user && Auth.user.createRealm;
      },

      get verDireccionesRegionales() {
        return getAccess('ver-direccionesRegionales');
      },
      get verTrabajadores() {
        return getAccess('ver-trabajadores');
      },
      get verTrabajadoresDireccionRegional() {
        return getAccess('ver-trabajadores-direccionRegional');
      },
      get verProyectos() {
        return getAccess('ver-proyectos');
      },
      get verProyectosDireccionRegional() {
        return getAccess('ver-proyectos-direccionRegional');
      },

      get administrarDireccionesRegionales() {
        return getAccess('administrar-direccionesRegionales');
      },
      get administrarTrabajadores() {
        return getAccess('administrar-trabajadores');
      },
      get administrarTrabajadoresDireccionRegional() {
        return getAccess('administrar-trabajadores-direccionRegional');
      },
      get administrarProyectos() {
        return getAccess('administrar-proyectos');
      },
      get administrarProyectosDireccionRegional() {
        return getAccess('administrar-proyectos-direccionRegional');
      },

      get eliminarDireccionRegional() {
        return getAccess('eliminar-direccionesRegionales');
      },
      get eliminarTrabajadores() {
        return getAccess('eliminar-trabajadores');
      },
      get eliminarTrabajadoresDireccionRegional() {
        return getAccess('eliminar-trabajadores-direccionRegional');
      },
      get eliminarProyectos() {
        return getAccess('eliminar-proyectos');
      },
      get eliminarProyectosDireccionRegional() {
        return getAccess('eliminar-proyectos-direccionRegional');
      }

    };

  }
]);
