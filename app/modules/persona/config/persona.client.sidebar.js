'use strict';

// Setting up sidebar
angular.module('persona').controller('PersonaSidebarController',
	function ($scope, Auth, $menuItemsPersona) {

		$scope.menuItems = $menuItemsPersona.prepareSidebarMenu().getAll();

	}
);
