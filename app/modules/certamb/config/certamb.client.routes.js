'use strict';

// Setting up route
angular.module('certamb').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    /*var checkUserRole = function (role, $q, $timeout, $http, $location, Auth) {
      var deferred = $q.defer();
      if (Auth.authz.hasResourceRole(role, 'certamb_app')) {
        $timeout(deferred.resolve);
      }
      else {
        $timeout(deferred.reject);
        alert('No tiene los permisos para poder acceder a esta pagina');
        $location.path('/');
      }
      return deferred.promise;
    };*/

    var checkUserRole = function (role, $q, $timeout, $http, $location, Auth) {
      var realm = 'certamb_app';
      var result = false;
      var deferred = $q.defer();

      if(angular.isArray(role)){
        for(var i=0;i<role.length;i++){
          if (Auth.authz.hasResourceRole(role[i], realm)) {
            result = true;
          }
        }
      } else {
        if (Auth.authz.hasResourceRole(role, 'certamb_app')) {
          result = true;
        }
      }

      if (result) {
        $timeout(deferred.resolve);
      } else {
        $timeout(deferred.reject);
        alert('No tiene los permisos para poder acceder a esta pagina');
        $location.path('/');
      }
      return deferred.promise;
    };

    // $urlRouterProvider.when('/certamb/app', '/certamb/app/organizacion/direccionesRegionales');
    $urlRouterProvider.when('/certamb/app/organizacion/direccionesRegionales', '/certamb/app/organizacion/direccionesRegionales/buscar');
    $urlRouterProvider.when('/certamb/app/organizacion/trabajadores', '/certamb/app/organizacion/trabajadores/buscar');
    $urlRouterProvider.when('/certamb/app/organizacion/trabajadores/editar/:trabajador', '/certamb/app/organizacion/trabajadores/editar/:trabajador/resumen');


    //$urlRouterProvider.when('/certamb/app', '/certamb/app/certificacionesAmbientales/proyectos');
    $urlRouterProvider.when('/certamb/app/certificacionesAmbientales/proyectos', '/certamb/app/certificacionesAmbientales/proyectos/buscar');
    $urlRouterProvider.when('/certamb/app/certificacionesAmbientales/proyectos/editar/:proyecto', '/certamb/app/certificacionesAmbientales/proyectos/editar/:proyecto/resumen');

    $stateProvider
      .state('certamb', {
        abstract: true,
        url: '/certamb',
        templateUrl: 'modules/certamb/views/_body.html',
        controller: 'CertambController'
      })
      .state('certamb.home', {
        url: '/home',
        templateUrl: 'modules/certamb/views/index.html',
        ncyBreadcrumb: {
          label: 'Index'
        }
      })
      .state('certamb.app', {
        url: '/app',
        template: '<div ui-view></div>',
        ncyBreadcrumb: {
          skip: true // Never display this state in breadcrumb.
        }
      })

      .state('certamb.app.organizacion', {
        url: '/organizacion',
        template: '<div ui-view></div>',
        abstract: true
      })
      .state('certamb.app.proceso', {
        url: '/proceso',
        template: '<div ui-view></div>',
        abstract: true
      })
      .state('certamb.app.sistema', {
        url: '/sistema',
        template: '<div ui-view></div>',
        abstract: true
      })

      //Direccion regional
      .state('certamb.app.organizacion.direccionRegional', {
        url: '/direccionesRegionales',
        template: '<div ui-view></div>',
        ncyBreadcrumb: {
          skip: true // Never display this state in breadcrumb.
        }
      })
      .state('certamb.app.organizacion.direccionRegional.buscar', {
        url: '/buscar',
        templateUrl: 'modules/certamb/views/organizacion/direccionRegional/form-buscar.html',
        controller: 'Certamb.Organizacion.DireccionRegional.BuscarController',
        resolve: {
          loggedin: function ($q, $timeout, $http, $location, Auth) {
            return checkUserRole('ver-direccionesRegionales', $q, $timeout, $http, $location, Auth);
          }
        },
        ncyBreadcrumb: {
          label: 'Home'
        }
      })
      .state('certamb.app.organizacion.direccionRegional.crear', {
        url: '/crear',
        templateUrl: 'modules/certamb/views/organizacion/direccionRegional/form-crear.html',
        controller: 'Certamb.Organizacion.DireccionRegional.CrearController',
        resolve: {
          loggedin: function ($q, $timeout, $http, $location, Auth) {
            return checkUserRole('administrar-direccionesRegionales', $q, $timeout, $http, $location, Auth);
          }
        },
        ncyBreadcrumb: {
          label: 'Crear direccion regional',
          parent: 'certamb.app.organizacion.direccionRegional.buscar'
        }
      })
      .state('certamb.app.organizacion.direccionRegional.editar', {
        url: '/editar/:direccionRegional',
        templateUrl: 'modules/certamb/views/organizacion/direccionRegional/form-editar.html',
        resolve: {
          loggedin: function ($q, $timeout, $http, $location, Auth) {
            return checkUserRole('administrar-direccionesRegionales', $q, $timeout, $http, $location, Auth);
          },
          direccionRegional: function ($state, $stateParams, SGDireccionRegional) {
            return SGDireccionRegional.$find($stateParams.direccionRegional);
          }
        },
        controller: 'Certamb.Organizacion.DireccionRegional.EditarController',
        ncyBreadcrumb: {
          label: 'Editar direccion regional',
          parent: 'certamb.app.organizacion.direccionRegional.buscar'
        }
      })

      //Trabajadores
      .state('certamb.app.organizacion.trabajador', {
        url: '/trabajadores',
        template: '<div ui-view></div>',
        ncyBreadcrumb: {
          skip: true // Never display this state in breadcrumb.
        }
      })
      .state('certamb.app.organizacion.trabajador.buscar', {
        url: '/buscar',
        templateUrl: 'modules/certamb/views/organizacion/trabajador/form-buscar.html',
        controller: 'Certamb.Organizacion.Trabajador.BuscarController',
        resolve: {
          loggedin: function ($q, $timeout, $http, $location, Auth) {
            return checkUserRole(['ver-trabajadores', 'ver-trabajadores-direccionRegional'], $q, $timeout, $http, $location, Auth);
          }
        },
        ncyBreadcrumb: {
          label: 'Home'
        }
      })
      .state('certamb.app.organizacion.trabajador.crear', {
        url: '/crear',
        templateUrl: 'modules/certamb/views/organizacion/trabajador/form-crear.html',
        controller: 'Certamb.Organizacion.Trabajador.CrearController',
        resolve: {
          loggedin: function ($q, $timeout, $http, $location, Auth) {
            return checkUserRole(['ver-trabajadores', 'ver-trabajadores-direccionRegional'], $q, $timeout, $http, $location, Auth);
          }
        },
        ncyBreadcrumb: {
          label: 'Crear trabajador',
          parent: 'certamb.app.organizacion.trabajador.buscar'
        }
      })
      .state('certamb.app.organizacion.trabajador.editar', {
        url: '/editar/:trabajador',
        templateUrl: 'modules/certamb/views/organizacion/trabajador/form-editar.html',
        resolve: {
          loggedin: function ($q, $timeout, $http, $location, Auth) {
            return checkUserRole(['administrar-trabajadores', 'administrar-trabajadores-direccionRegional'], $q, $timeout, $http, $location, Auth);
          },
          trabajador: function ($q, $state, $stateParams, $timeout, SGTrabajador, DIRECCION_REGIONAL) {
            var deferred = $q.defer();
            SGTrabajador.$find($stateParams.trabajador).then(
              function(response){
                if(!DIRECCION_REGIONAL || !response.direccionRegional){
                  $timeout(deferred.resolve(response));
                } else {
                  if (DIRECCION_REGIONAL.id === response.direccionRegional.id) {
                    $timeout(deferred.resolve(response));
                  } else {
                    $timeout(deferred.reject);
                  }
                }
              }, function error(err) {
                $timeout(deferred.reject);
              }
            );
            return deferred.promise;
          }
        },
        controller: 'Certamb.Organizacion.Trabajador.EditarController',
        ncyBreadcrumb: {
          label: 'Editar trabajador',
          parent: 'certamb.app.organizacion.trabajador.buscar'
        }
      })
      .state('certamb.app.organizacion.trabajador.editar.resumen', {
        url: '/resumen',
        templateUrl: 'modules/certamb/views/organizacion/trabajador/form-editar-resumen.html',
        controller: 'Certamb.Organizacion.Trabajador.Editar.ResumenController',
        resolve: {
          loggedin: function ($q, $timeout, $http, $location, Auth) {
            return checkUserRole(['administrar-trabajadores', 'administrar-trabajadores-direccionRegional'], $q, $timeout, $http, $location, Auth);
          }
        },
        ncyBreadcrumb: {
          label: 'Resumen'
        }
      })
      .state('certamb.app.organizacion.trabajador.editar.accesoSistema', {
        url: '/accesoSistema',
        templateUrl: 'modules/certamb/views/organizacion/trabajador/form-editar-accesosistema.html',
        controller: 'Certamb.Organizacion.Trabajador.Editar.AccesoSistemaController',
        resolve: {
          loggedin: function ($q, $timeout, $http, $location, Auth) {
            return checkUserRole(['administrar-trabajadores', 'administrar-trabajadores-direccionRegional'], $q, $timeout, $http, $location, Auth);
          }
        },
        ncyBreadcrumb: {
          label: 'Acceso al sistema'
        }
      })


      .state('certamb.app.certificacionAmbiental', {
        url: '/certificacionesAmbientales',
        template: '<div ui-view></div>',
        abstract: true
      })
      .state('certamb.app.administracion', {
        url: '/administracion',
        template: '<div ui-view></div>',
        abstract: true
      })

      //Proyecto
      .state('certamb.app.certificacionAmbiental.proyecto', {
        url: '/proyectos',
        template: '<div ui-view></div>',
        ncyBreadcrumb: {
          skip: true // Never display this state in breadcrumb.
        }
      })
      .state('certamb.app.certificacionAmbiental.proyecto.buscar', {
        url: '/buscar',
        templateUrl: 'modules/certamb/views/certificacionAmbiental/proyecto/form-buscar.html',
        controller: 'Certamb.CertificacionAmbiental.Proyecto.BuscarController',
        resolve: {
          loggedin: function ($q, $timeout, $http, $location, Auth) {
            return checkUserRole(['ver-proyectos', 'ver-proyectos-direccionRegional'], $q, $timeout, $http, $location, Auth);
          }
        },
        ncyBreadcrumb: {
          label: 'Home'
        }
      })
      .state('certamb.app.certificacionAmbiental.proyecto.crear', {
        url: '/crear',
        templateUrl: 'modules/certamb/views/certificacionAmbiental/proyecto/form-crear.html',
        controller: 'Certamb.CertificacionAmbiental.Proyecto.CrearController',
        resolve: {
          loggedin: function ($q, $timeout, $http, $location, Auth) {
            return checkUserRole(['administrar-proyectos', 'administrar-proyectos-direccionRegional'], $q, $timeout, $http, $location, Auth);
          }
        },
        ncyBreadcrumb: {
          label: 'Crear solicitud de certificacion ambiental',
          parent: 'certamb.app.certificacionAmbiental.proyecto.buscar'
        }
      })
      .state('certamb.app.certificacionAmbiental.proyecto.editar', {
        url: '/editar/:proyecto',
        templateUrl: 'modules/certamb/views/certificacionAmbiental/proyecto/form-editar.html',
        resolve: {
          loggedin: function ($q, $timeout, $http, $location, Auth) {
            return checkUserRole(['administrar-proyectos', 'administrar-proyectos-direccionRegional'], $q, $timeout, $http, $location, Auth);
          },
          proyecto: function ($state, $stateParams, SGProyecto) {
            return SGProyecto.$find($stateParams.proyecto);
          }
        },
        controller: 'Certamb.CertificacionAmbiental.Proyecto.EditarController',
        ncyBreadcrumb: {
          label: 'Editar proyecto',
          parent: 'certamb.app.certificacionAmbiental.proyecto.buscar'
        }
      })
      .state('certamb.app.certificacionAmbiental.proyecto.editar.resumen', {
        url: '/resumen',
        templateUrl: 'modules/certamb/views/certificacionAmbiental/proyecto/form-editar-resumen.html',
        controller: 'Certamb.CertificacionAmbiental.Proyecto.Editar.ResumenController',
        resolve: {
          loggedin: function ($q, $timeout, $http, $location, Auth) {
            return checkUserRole(['administrar-proyectos', 'administrar-proyectos-direccionRegional'], $q, $timeout, $http, $location, Auth);
          }
        },
        ncyBreadcrumb: {
          skip: true // Never display this state in breadcrumb.
        }
      })
      .state('certamb.app.certificacionAmbiental.proyecto.editar.datosPrincipales', {
        url: '/datosPrincipales',
        templateUrl: 'modules/certamb/views/certificacionAmbiental/proyecto/form-editar-datosPrincipales.html',
        controller: 'Certamb.CertificacionAmbiental.Proyecto.Editar.DatosPrincipalesController',
        resolve: {
          loggedin: function ($q, $timeout, $http, $location, Auth) {
            return checkUserRole(['administrar-proyectos', 'administrar-proyectos-direccionRegional'], $q, $timeout, $http, $location, Auth);
          },
          proyecto: function($state, $stateParams, $timeout, SGProyecto, DIRECCION_REGIONAL){
            var deferred = $q.defer();
            SGProyecto.$find($stateParams.proyecto).then(
              function(response){
                if (DIRECCION_REGIONAL.id === response.direccionRegional.id) {
                  $timeout(deferred.resolve);
                } else {
                  $timeout(deferred.reject);
                }
              }, function error(err) {
                $timeout(deferred.reject);
              }
            );
          }
        },
        ncyBreadcrumb: {
          label: 'Datos principales'
        }
      })
      .state('certamb.app.certificacionAmbiental.proyecto.editar.procedimiento', {
        url: '/procedimientos',
        templateUrl: 'modules/certamb/views/certificacionAmbiental/proyecto/form-editar-procedimiento.html',
        controller: 'Certamb.CertificacionAmbiental.Proyecto.Editar.ProcedimientoController',
        resolve: {
          loggedin: function ($q, $timeout, $http, $location, Auth) {
            return checkUserRole(['administrar-proyectos', 'administrar-proyectos-direccionRegional'], $q, $timeout, $http, $location, Auth);
          },
          proyecto: function($state, $stateParams, $timeout, SGProyecto, DIRECCION_REGIONAL){
            var deferred = $q.defer();
            SGProyecto.$find($stateParams.proyecto).then(
              function(response){
                if (DIRECCION_REGIONAL.id === response.direccionRegional.id) {
                  $timeout(deferred.resolve);
                } else {
                  $timeout(deferred.reject);
                }
              }, function error(err) {
                $timeout(deferred.reject);
              }
            );
          }
        },
        ncyBreadcrumb: {
          label: 'Procedimientos'
        }
      });
  }
]);
