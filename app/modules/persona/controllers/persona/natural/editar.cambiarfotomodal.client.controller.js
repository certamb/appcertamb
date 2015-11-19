'use strict';

/* jshint -W098 */
angular.module('persona').controller('Persona.Natural.EditarPersonaNatural.CambiarFotoModalController',
	function ($scope, $timeout, $uibModalInstance, personaNatural, toastr, Upload, SGPersonaNatural) {

		$scope.view = {
			persona: personaNatural
		};

		$scope.uploader = {
			progress: 0
		};

		$scope.upload = function (files) {
			if (files && files.length) {
				var file = files[0];

				$scope.view.persona.$setFoto(file).progress(function (evt) {
					$scope.uploader.progress = parseInt(100.0 * evt.loaded / evt.total);
				}).success(function (data, status, headers, config) {
					toastr.success('Foto actualizada satisfactoriamente');
					$scope.loadPersona();
					$timeout(function() {
						$scope.uploader.progress = 0;
					}, 1000);
				}).error(function(){
					toastr.error('Error al subir el archivo');
				});

			}
		};

		$scope.loadPersona = function(){
			$scope.view.persona = SGPersonaNatural.$find($scope.view.persona.id).$object;
		};

		$scope.ok = function () {
			$uibModalInstance.close($scope.view.persona);
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	});
