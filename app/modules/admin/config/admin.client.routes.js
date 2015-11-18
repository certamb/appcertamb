'use strict';

// Setting up route
angular.module('admin').config(['$stateProvider', '$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {


		$urlRouterProvider.when('/persona/app', '/persona/app/personas/naturales');

		$stateProvider
			.state('admin', {
				abstract: true,
				url: '/admin',
				templateUrl: 'modules/admin/views/_body.html',
				controller: 'AdminController'
			})
			.state('admin.home', {
				url: '/home',
				templateUrl: 'modules/admin/views/index.html',
				ncyBreadcrumb: {
					label: 'Index'
				}
			})
			.state('admin.app', {
				url: '/app',
				template: '<div ui-view></div>',
				ncyBreadcrumb: {
					skip: true // Never display this state in breadcrumb.
				}
			})

			.state('admin.app.menu1', {
				url: '/menu1',
				template: '<div ui-view></div>',
				abstract: true
			})
			.state('admin.app.menu2', {
				url: '/menu2',
				template: '<div ui-view></div>',
				abstract: true
			})

			//Menu1
			.state('admin.app.menu1.submenu1', {
				url: '/submenu1',
				template: '<div ui-view></div>',
				ncyBreadcrumb: {
					skip: true // Never display this state in breadcrumb.
				}
			})
			.state('admin.app.menu1.submenu1.buscar', {
				url: '/buscar',
				templateUrl: 'modules/admin/views/menu1/submenu1/form-buscar.html',
				ncyBreadcrumb: {
					label: 'Home'
				}
			})

      //Menu2
      .state('admin.app.menu2.submenu1', {
        url: '/submenu1',
        template: '<div ui-view></div>',
        ncyBreadcrumb: {
          skip: true // Never display this state in breadcrumb.
        }
      })
      .state('admin.app.menu2.submenu1.buscar', {
        url: '/buscar',
        templateUrl: 'modules/admin/views/menu2/submenu1/form-buscar.html',
        ncyBreadcrumb: {
          label: 'Home'
        }
      });
	}
]);
