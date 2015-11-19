'use strict';

// Configuring the Chat module
angular.module('configuracion').run(['Menus', 'Auth',
	function (Menus, Auth) {
		var roles = Auth.authz.realmAccess.roles;
		if (roles.indexOf('REPRESENTANTE_DIRECCION_REGIONAL') !== -1 || roles.indexOf('REPRESENTANTE_RECURSOS_NATURALES') !== -1) {
			// Set top bar menu items
			Menus.addMenuItem('topbar', {
				title: 'Configuracion',
				state: 'configuracion.app'
			});
		}
	}
]);
