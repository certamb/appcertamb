'use strict';

/* jshint -W098 */
angular.module('persona').directive('sgDocumentoIdentidad',function(TipoDocumento, PersonaNatural, personaConfig, Notifications){
    return {
        restrict:'E',
        replace: false,
        require: ['^form','ngModel'],
        link: function($scope, elem, attrs, ngModel){
            /*formulario*/
            $scope.sgForm = ngModel[0];

            /*valores*/
            $scope.view = {
                tipoDocumento: undefined,
                numeroDocumento: undefined
            };
            $scope.combo = {
                tipoDocumento: TipoDocumento.$search({tipoPersona: $scope.tipoPersona.toUpperCase()})
            };

            /*cargar tipo documento si es un parametro*/
            $scope.combo.tipoDocumento.$then(function() {
                if(!angular.isUndefined($scope.tipoDocumento) && $scope.tipoDocumento){
                    for(var i = 0; i<$scope.combo.tipoDocumento.length ; i += 1){
                        if($scope.combo.tipoDocumento[i].abreviatura.toLowerCase() === $scope.tipoDocumento.toLowerCase()){
                            $scope.view.tipoDocumento = $scope.combo.tipoDocumento[i];
                        }
                    }
                }
            });

            /**/
            $scope.$watch('view.tipoDocumento', function(newValue, oldValue){
                if(!angular.isUndefined(newValue) && !angular.isUndefined(oldValue)){
                    $scope.numeroDocumento = '';
                }
                if(!angular.isUndefined(newValue)){
                    $scope.tipoDocumento = $scope.view.tipoDocumento.abreviatura;
                }
            }, true);


            /*Verificar persona*/
            $scope.check = function($event){
                if(!angular.isUndefined($event))
                    $event.preventDefault();
                if(!angular.isUndefined($scope.tipoDocumento) && !angular.isUndefined($scope.numeroDocumento)){
                    var result = PersonaNatural.$single(personaConfig.urlPrefix + '/personas/naturales/buscar').$fetch({tipoDocumento:$scope.tipoDocumento, numeroDocumento: $scope.numeroDocumento});
                    result.$then(function(data) {
                        if(!data.$response.data){
                            Notifications.info('Documento de identidad disponible');
                        } else {
                            Notifications.warn('Documento de identidad no disponible');
                        }
                    });
                }
            };

        },
        scope: {
            nombre: '@',
            tipoPersona: '@',
            tipoDocumento: '=',
            numeroDocumento: '=',
            requerido: '@'
        },
        template: '' +
        '<div class="col-sm-4">'+
        '<div class="form-group" ng-class="{ \'has-error\' : sgForm.sgTipoDocumento.$invalid && (sgForm.sgTipoDocumento.$touched || sgForm.$submitted)}">'+
        '<label>Tipo documento</label>'+
        '<ui-select name="sgTipoDocumento" ng-model="view.tipoDocumento" theme="bootstrap" required>'+
        '<ui-select-match placeholder="Seleccione">{{$select.selected.abreviatura}}</ui-select-match>'+
        '<ui-select-choices repeat="item in combo.tipoDocumento | filter: $select.search">'+
        '<div ng-bind-html="item.abreviatura | highlight: $select.search"></div>'+
        '</ui-select-choices>'+
        '</ui-select>'+
        '<div ng-messages="sgForm.sgTipoDocumento.$error" ng-if="sgForm.sgTipoDocumento.$touched || sgForm.$submitted">'+
        '<div class="help-block" ng-message="required">Ingrese documento.</div>'+
        '</div>'+
        '</div>'+
        '</div>'+

        '<div class="col-sm-4" ng-class="{ \'has-error\' : sgForm.sgNumeroDocumento.$invalid && (sgForm.sgNumeroDocumento.$touched || sgForm.$submitted)}">'+
        '<div class="form-group">'+
        '<label>N&uacute;mero documento</label>'+
        '<div class="input-group">'+
        '<input type="text" name="sgNumeroDocumento" ng-model="numeroDocumento" ui-keypress="{13:\'check($event)\'}" ng-pattern="/^[0-9]+$/" ng-minlength="view.tipoDocumento.cantidadCaracteres" ng-maxlength="view.tipoDocumento.cantidadCaracteres" class="form-control" ng-required="{{requerido}}"/>'+
        '<span class="input-group-btn"><button type="button" ng-click="check()" tooltip="Check" tooltip-trigger="mouseenter" tooltip-placement="bottom" class="btn btn-default"><span class="glyphicon glyphicon-check"></span></button></span>'+
        '</div>'+
        '<div ng-messages="sgForm.sgNumeroDocumento.$error" ng-if="sgForm.sgNumeroDocumento.$touched || sgForm.$submitted">'+
        '<div class="help-block" ng-message="required">Ingrese numero documento.</div>'+
        '<div class="help-block" ng-message="minlength">Debe tener <span ng-bind="view.tipoDocumento.cantidadCaracteres"></span> digitos.</div>'+
        '<div class="help-block" ng-message="maxlength">Debe tener <span ng-bind="view.tipoDocumento.cantidadCaracteres"></span> digitos.</div>'+
        '<div class="help-block" ng-message="pattern">Numero invalido.</div>'+
        '</div>'+
        '</div>'+
        '</div>'
    };
});
