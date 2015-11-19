'use strict';

// Setting up route
angular.module('configuracion').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        // Check if user has role
        var checkUserRole = function (role, $q, $timeout, $http, $location, Auth) {

            // Initialize a new promise
            var deferred = $q.defer();

            // ver-personas
            if (Auth.authz.hasResourceRole(role, 'certamb')) {
                $timeout(deferred.resolve);
            }

            // Not ver-personas
            else {
                $timeout(deferred.reject);
                //$location.url('/auth/login');
                alert('No tiene los permisos para poder acceder a esta pagina');
                $location.path('/');
            }

            return deferred.promise;
        };

        $urlRouterProvider.when('/configuracion/app', '/configuracion/app/organizacion/direccionesRegionales');

        $urlRouterProvider.when('/configuracion/app/organizacion/direccionesRegionales', '/configuracion/app/organizacion/direccionesRegionales/buscar');

        $urlRouterProvider.when('/configuracion/app/organizacion/trabajadores', '/configuracion/app/organizacion/trabajadores/buscar');
        $urlRouterProvider.when('/configuracion/app/organizacion/trabajadores/editar/:trabajador', '/configuracion/app/organizacion/trabajadores/editar/:trabajador/resumen');

        $stateProvider
            .state('configuracion', {
                abstract: true,
                url: '/configuracion',
                templateUrl: 'modules/configuracion/views/_body.html',
                controller: 'ConfiguracionController'
            })
            .state('configuracion.home', {
                url: '/home',
                templateUrl: 'modules/configuracion/views/index.html',
                ncyBreadcrumb: {
                    label: 'Index'
                }
            })
            .state('configuracion.app', {
                url: '/app',
                template: '<div ui-view></div>',
                ncyBreadcrumb: {
                    skip: true // Never display this state in breadcrumb.
                }
            })

            .state('configuracion.app.organizacion', {
                url: '/organizacion',
                template: '<div ui-view></div>',
                abstract: true
            })
            .state('configuracion.app.proceso', {
                url: '/proceso',
                template: '<div ui-view></div>',
                abstract: true
            })
            .state('configuracion.app.sistema', {
                url: '/sistema',
                template: '<div ui-view></div>',
                abstract: true
            })

            //Direccion regional
            .state('configuracion.app.organizacion.direccionRegional', {
                url: '/direccionesRegionales',
                template: '<div ui-view></div>',
                ncyBreadcrumb: {
                    skip: true // Never display this state in breadcrumb.
                }
            })
            .state('configuracion.app.organizacion.direccionRegional.buscar', {
                url: '/buscar',
                templateUrl: 'modules/configuracion/views/organizacion/direccionRegional/form-buscar.html',
                controller: 'Configuracion.Organizacion.DireccionRegional.BuscarController',
                resolve: {
                    loggedin: function ($q, $timeout, $http, $location, Auth) {
                        return checkUserRole('ver-direccionesRegionales', $q, $timeout, $http, $location, Auth);
                    }
                },
                ncyBreadcrumb: {
                    label: 'Home'
                }
            })
            .state('configuracion.app.organizacion.direccionRegional.crear', {
                url: '/crear',
                templateUrl: 'modules/configuracion/views/organizacion/direccionRegional/form-crear.html',
                controller: 'Configuracion.Organizacion.DireccionRegional.CrearController',
                resolve: {
                    loggedin: function ($q, $timeout, $http, $location, Auth) {
                        return checkUserRole('ver-direccionesRegionales', $q, $timeout, $http, $location, Auth);
                    }
                },
                ncyBreadcrumb: {
                    label: 'Crear direccion regional',
                    parent: 'configuracion.app.organizacion.direccionRegional.buscar'
                }
            })
            .state('configuracion.app.organizacion.direccionRegional.editar', {
                url: '/editar/:direccionRegional',
                templateUrl: 'modules/configuracion/views/organizacion/direccionRegional/form-editar.html',
                resolve: {
                    loggedin: function ($q, $timeout, $http, $location, Auth) {
                        return checkUserRole('ver-direccionesRegionales', $q, $timeout, $http, $location, Auth);
                    },
                    direccionRegional: function ($state, $stateParams, SGDireccionRegional) {
                        return SGDireccionRegional.$find($stateParams.direccionRegional);
                    }
                },
                controller: 'Configuracion.Organizacion.DireccionRegional.EditarController',
                ncyBreadcrumb: {
                    label: 'Editar direccion regional',
                    parent: 'configuracion.app.organizacion.direccionRegional.buscar'
                }
            })

            //Trabajadores
            .state('configuracion.app.organizacion.trabajador', {
                url: '/trabajadores',
                template: '<div ui-view></div>',
                ncyBreadcrumb: {
                    skip: true // Never display this state in breadcrumb.
                }
            })
            .state('configuracion.app.organizacion.trabajador.buscar', {
                url: '/buscar',
                templateUrl: 'modules/configuracion/views/organizacion/trabajador/form-buscar.html',
                controller: 'Configuracion.Organizacion.Trabajador.BuscarController',
                resolve: {
                    loggedin: function ($q, $timeout, $http, $location, Auth) {
                        return checkUserRole('ver-trabajadores', $q, $timeout, $http, $location, Auth);
                    }
                },
                ncyBreadcrumb: {
                    label: 'Home'
                }
            })
            .state('configuracion.app.organizacion.trabajador.crear', {
                url: '/crear',
                templateUrl: 'modules/configuracion/views/organizacion/trabajador/form-crear.html',
                controller: 'Configuracion.Organizacion.Trabajador.CrearController',
                resolve: {
                    loggedin: function ($q, $timeout, $http, $location, Auth) {
                        return checkUserRole('ver-trabajadores', $q, $timeout, $http, $location, Auth);
                    }
                },
                ncyBreadcrumb: {
                    label: 'Crear trabajador',
                    parent: 'configuracion.app.organizacion.trabajador.buscar'
                }
            })
            .state('configuracion.app.organizacion.trabajador.editar', {
                url: '/editar/:trabajador',
                templateUrl: 'modules/configuracion/views/organizacion/trabajador/form-editar.html',
                resolve: {
                    loggedin: function ($q, $timeout, $http, $location, Auth) {
                        return checkUserRole('ver-trabajadores', $q, $timeout, $http, $location, Auth);
                    },
                    trabajador: function ($state, $stateParams, SGTrabajador) {
                        return SGTrabajador.$find($stateParams.trabajador);
                    }
                },
                controller: 'Configuracion.Organizacion.Trabajador.EditarController',
                ncyBreadcrumb: {
                    label: 'Editar trabajador',
                    parent: 'configuracion.app.organizacion.trabajador.buscar'
                }
            })
            .state('configuracion.app.organizacion.trabajador.editar.resumen', {
                url: '/resumen',
                templateUrl: 'modules/configuracion/views/organizacion/trabajador/form-editar-resumen.html',
                controller: 'Configuracion.Organizacion.Trabajador.Editar.ResumenController',
                resolve: {
                    loggedin: function ($q, $timeout, $http, $location, Auth) {
                        return checkUserRole('ver-trabajadores', $q, $timeout, $http, $location, Auth);
                    }
                },
                ncyBreadcrumb: {
                    label: 'Resumen'
                }
            })
            .state('configuracion.app.organizacion.trabajador.editar.accesoSistema', {
                url: '/accesoSistema',
                templateUrl: 'modules/configuracion/views/organizacion/trabajador/form-editar-accesosistema.html',
                controller: 'Configuracion.Organizacion.Trabajador.Editar.AccesoSistemaController',
                resolve: {
                    loggedin: function ($q, $timeout, $http, $location, Auth) {
                        return checkUserRole('ver-trabajadores', $q, $timeout, $http, $location, Auth);
                    }
                },
                ncyBreadcrumb: {
                    label: 'Acceso al sistema'
                }
            });
    }
]);
