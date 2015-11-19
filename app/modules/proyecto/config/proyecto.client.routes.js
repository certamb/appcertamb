'use strict';

// Setting up route
angular.module('proyecto').config(['$stateProvider', '$urlRouterProvider',
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

        $urlRouterProvider.when('/proyectos/app', '/proyectos/app/certificacionesAmbientales/proyectos');

        $urlRouterProvider.when('/proyectos/app/certificacionesAmbientales/proyectos', '/proyectos/app/certificacionesAmbientales/proyectos/buscar');
        $urlRouterProvider.when('/proyectos/app/certificacionesAmbientales/proyectos/editar/:proyecto', '/proyectos/app/certificacionesAmbientales/proyectos/editar/:proyecto/resumen');

        $stateProvider
            .state('proyecto', {
                abstract: true,
                url: '/proyectos',
                templateUrl: 'modules/proyecto/views/_body.html',
                controller: 'ProyectoController'
            })
            .state('proyecto.home', {
                url: '/home',
                templateUrl: 'modules/proyecto/views/index.html',
                ncyBreadcrumb: {
                    label: 'Index'
                }
            })
            .state('proyecto.app', {
                url: '/app',
                template: '<div ui-view></div>',
                ncyBreadcrumb: {
                    skip: true // Never display this state in breadcrumb.
                }
            })

            .state('proyecto.app.certificacionAmbiental', {
                url: '/certificacionesAmbientales',
                template: '<div ui-view></div>',
                abstract: true
            })
            .state('proyecto.app.administracion', {
                url: '/administracion',
                template: '<div ui-view></div>',
                abstract: true
            })

            //Proyecto
            .state('proyecto.app.certificacionAmbiental.proyecto', {
                url: '/proyectos',
                template: '<div ui-view></div>',
                ncyBreadcrumb: {
                    skip: true // Never display this state in breadcrumb.
                }
            })
            .state('proyecto.app.certificacionAmbiental.proyecto.buscar', {
                url: '/buscar',
                templateUrl: 'modules/proyecto/views/certificacionAmbiental/proyecto/form-buscar.html',
                controller: 'Proyecto.CertificacionAmbiental.Proyecto.BuscarController',
                resolve: {
                    loggedin: function ($q, $timeout, $http, $location, Auth) {
                        return checkUserRole('ver-proyectos', $q, $timeout, $http, $location, Auth);
                    }
                },
                ncyBreadcrumb: {
                    label: 'Home'
                }
            })
            .state('proyecto.app.certificacionAmbiental.proyecto.crear', {
                url: '/crear',
                templateUrl: 'modules/proyecto/views/certificacionAmbiental/proyecto/form-crear.html',
                controller: 'Proyecto.CertificacionAmbiental.Proyecto.CrearController',
                resolve: {
                    loggedin: function ($q, $timeout, $http, $location, Auth) {
                        return checkUserRole('ver-proyectos', $q, $timeout, $http, $location, Auth);
                    }
                },
                ncyBreadcrumb: {
                    label: 'Crear solicitud de certificacion ambiental',
                    parent: 'proyecto.app.certificacionAmbiental.proyecto.buscar'
                }
            })
            .state('proyecto.app.certificacionAmbiental.proyecto.editar', {
                url: '/editar/:proyecto',
                templateUrl: 'modules/proyecto/views/certificacionAmbiental/proyecto/form-editar.html',
                resolve: {
                    loggedin: function ($q, $timeout, $http, $location, Auth) {
                        return checkUserRole('ver-proyectos', $q, $timeout, $http, $location, Auth);
                    },
                    proyecto: function ($state, $stateParams, SGProyecto) {
                        return SGProyecto.$find($stateParams.proyecto);
                    }
                },
                controller: 'Proyecto.CertificacionAmbiental.Proyecto.EditarController',
                ncyBreadcrumb: {
                    label: 'Editar proyecto',
                    parent: 'proyecto.app.certificacionAmbiental.proyecto.buscar'
                }
            })
            .state('proyecto.app.certificacionAmbiental.proyecto.editar.resumen', {
                url: '/resumen',
                templateUrl: 'modules/proyecto/views/certificacionAmbiental/proyecto/form-editar-resumen.html',
                controller: 'Proyecto.CertificacionAmbiental.Proyecto.Editar.ResumenController',
                resolve: {
                    loggedin: function ($q, $timeout, $http, $location, Auth) {
                        return checkUserRole('ver-proyectos', $q, $timeout, $http, $location, Auth);
                    }
                },
                ncyBreadcrumb: {
                    skip: true // Never display this state in breadcrumb.
                }
            })
            .state('proyecto.app.certificacionAmbiental.proyecto.editar.datosPrincipales', {
                url: '/datosPrincipales',
                templateUrl: 'modules/proyecto/views/certificacionAmbiental/proyecto/form-editar-datosPrincipales.html',
                controller: 'Proyecto.CertificacionAmbiental.Proyecto.Editar.DatosPrincipalesController',
                resolve: {
                    loggedin: function ($q, $timeout, $http, $location, Auth) {
                        return checkUserRole('ver-proyectos', $q, $timeout, $http, $location, Auth);
                    }
                },
                ncyBreadcrumb: {
                    label: 'Datos principales'
                }
            })
            .state('proyecto.app.certificacionAmbiental.proyecto.editar.procedimiento', {
                url: '/procedimientos',
                templateUrl: 'modules/proyecto/views/certificacionAmbiental/proyecto/form-editar-procedimiento.html',
                controller: 'Proyecto.CertificacionAmbiental.Proyecto.Editar.ProcedimientoController',
                resolve: {
                    loggedin: function ($q, $timeout, $http, $location, Auth) {
                        return checkUserRole('ver-proyectos', $q, $timeout, $http, $location, Auth);
                    }
                },
                ncyBreadcrumb: {
                    label: 'Procedimientos'
                }
            });
    }
]);
