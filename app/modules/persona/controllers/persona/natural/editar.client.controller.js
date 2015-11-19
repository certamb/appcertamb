'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.Natural.EditarPersonaNaturalController',
	function ($scope, $state, toastr, personaNatural, SGDialog) {

		$scope.view = {
			persona: personaNatural
		};

		$scope.remove = function(){
			SGDialog.confirm('Eliminar', '¿Estas seguro de eliminar la persona?', function () {
				$scope.view.persona.$remove().then(
					function (response) {
						toastr.success('Persona eliminada');
						$state.go('persona.app.persona.natural.buscar');
					},
					function error(err) {
						toastr.error(err.data.errorMessage);
					}
				);
			});
		};

	});
