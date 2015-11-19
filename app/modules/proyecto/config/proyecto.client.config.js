'use strict';

// Configuring the Chat module
angular.module('proyecto').run(['Menus',
	function (Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', {
			title: 'Proyectos',
			state: 'proyecto.app'
		});
	}
]);
