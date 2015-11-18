'use strict';

// Setting up sidebar
angular.module('admin').controller('AdminSidebarController',
	function ($scope, $menuItemsAdmin) {

		$scope.menuItems = $menuItemsAdmin.prepareSidebarMenu().getAll();

	}
);
