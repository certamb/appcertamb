'use strict';

angular.module('utils').filter('si_no', function () {
    return function (input, mode) {
        var defaultResult = ['Si', 'No'];
        var modeOneResult = ['Activo', 'Inactivo'];
        var modeTwoResult = ['Abierto', 'Cerrado'];
        var modeTreeResult = ['Descongelado', 'Congelado'];

        var modeFourResult = ['Solicitado', 'Cancelado'];
        var modeFiveResult = ['Confirmado', 'No confirmado'];

        var result = defaultResult;
        if (mode) {
            if (mode.toLowerCase() === 'si') {
                result = defaultResult;
            } else if (mode.toLowerCase() === 'activo') {
                result = modeOneResult;
            } else if (mode.toLowerCase() === 'abierto') {
                result = modeTwoResult;
            } else if (mode.toLowerCase() === 'congelado') {
                result = modeTreeResult;
            } else if (mode.toLowerCase() === 'solicitado') {
                result = modeFourResult;
            } else if (mode.toLowerCase() === 'confirmado') {
                result = modeFiveResult;
            } else {
                result = defaultResult;
            }
        }

        if (input) {
            return result[0];
        }
        return result[1];
    };
});

angular.module('utils').directive('sgMaxDate', function () {
    return {
        require: 'ngModel',
        link: function ($scope, elem, attrs, ngModel) {
            ngModel.$validators.sgmaxdate = function (modelValue, viewValue) {
                var value = modelValue || viewValue;
                return $scope.maxDate >= value;
            };
        }
    };
});


angular.module('utils').service('SGDialog', ['$uibModal', function ($uibModal) {
    var dialog = {};

    var openDialog = function (title, message, btns) {
        var controller = function ($scope, $uibModalInstance, title, message, btns) {
            $scope.title = title;
            $scope.message = message;
            $scope.btns = btns;

            $scope.ok = function () {
                $uibModalInstance.close();
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        };
        controller.$inject = ['$scope', '$uibModalInstance', 'title', 'message', 'btns'];

        return $uibModal.open({
            template: '' +
            "<div class=\"modal-header\">\n" +
            "<button type=\"button\" class=\"close\" ng-click=\"cancel()\">\n" +
            "<span class=\"pficon pficon-close\"></span>\n" +
            "</button>\n" +
            "<h4 class=\"modal-title\">{{title}}</h4>\n" +
            "</div>\n" +
            "<div class=\"modal-body\">{{message}}</div>\n" +
            "<div class=\"modal-footer\">\n" +
            "<button type=\"button\" data-ng-class=\"btns.cancel.cssClass\" ng-click=\"cancel()\">{{btns.cancel.label}}</button>\n" +
            "<button type=\"button\" data-ng-class=\"btns.ok.cssClass\" ng-click=\"ok()\">{{btns.ok.label}}</button>\n" +
            "</div>\n" +
            "",
            controller: controller,
            resolve: {
                title: function () {
                    return title;
                },
                message: function () {
                    return message;
                },
                btns: function () {
                    return btns;
                }
            }
        }).result;
    };

    var escapeHtml = function (str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    };

    dialog.confirmDelete = function (name, type, success) {
        var title = 'Eliminar ' + escapeHtml(type.charAt(0).toUpperCase() + type.slice(1));
        var msg = '?Estas seguro de querer eliminar permanentemente el/la ' + type + ' ' + name + '?';
        var btns = {
            ok: {
                label: 'Eliminar',
                cssClass: 'btn btn-danger'
            },
            cancel: {
                label: 'Cancelar',
                cssClass: 'btn btn-default'
            }
        };

        openDialog(title, msg, btns).then(success);
    };

    dialog.confirmGenerateKeys = function (name, type, success) {
        var title = 'Generate new keys for realm';
        var msg = 'Are you sure you want to permanently generate new keys for ' + name + '?';
        var btns = {
            ok: {
                label: 'Generate Keys',
                cssClass: 'btn btn-danger'
            },
            cancel: {
                label: 'Cancel',
                cssClass: 'btn btn-default'
            }
        };

        openDialog(title, msg, btns).then(success);
    };

    dialog.confirm = function (title, message, success, cancel) {
        var btns = {
            ok: {
                label: title,
                cssClass: 'btn btn-primary'
            },
            cancel: {
                label: 'Cancel',
                cssClass: 'btn btn-default'
            }
        };

        openDialog(title, message, btns).then(success, cancel);
    };

    return dialog;
}]);


angular.module('utils').directive('sgReadOnly', function () {
    var disabled = {};

    var d = {
        replace: false,
        link: function (scope, element, attrs) {
            var disable = function (i, e) {
                if (!e.disabled) {
                    disabled[e.tagName + i] = true;
                    e.disabled = true;
                }
            };

            var enable = function (i, e) {
                if (disabled[e.tagName + i]) {
                    e.disabled = false;
                    delete disabled[i];
                }
            };

            scope.$watch(attrs.sgReadOnly, function (readOnly) {
                if (readOnly) {
                    element.find('input').each(disable);
                    element.find('button').each(disable);
                    element.find('select').each(disable);
                    element.find('textarea').each(disable);
                } else {
                    element.find('input').each(enable);
                    element.find('input').each(enable);
                    element.find('button').each(enable);
                    element.find('select').each(enable);
                    element.find('textarea').each(enable);
                }
            });
        }
    };
    return d;
});


angular.module('utils').directive('sgInput', function () {
    var d = {
        scope: true,
        replace: false,
        link: function (scope, element, attrs) {
            var form = element.children('form');
            var label = element.children('label');
            var input = element.children('input');

            var id = form.attr('name') + '.' + input.attr('name');

            element.attr('class', 'control-group');

            label.attr('class', 'control-label');
            label.attr('for', id);

            input.wrap('<div class="controls"/>');
            input.attr('id', id);

            if (!input.attr('placeHolder')) {
                input.attr('placeHolder', label.text());
            }

            if (input.attr('required')) {
                label.append(' <span class="required">*</span>');
            }
        }
    };
    return d;
});

angular.module('utils').directive('sgEnter', function () {
    return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.sgEnter);
                });

                event.preventDefault();
            }
        });
    };
});

angular.module('utils').directive('sgSave', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        link: function ($scope, elem, attr, ctrl) {
            elem.addClass('btn btn-primary');
            elem.attr('type","submit');
            elem.bind('click', function () {
                $scope.$apply(function () {
                    var form = elem.closest('form');
                    if (form && form.attr('name')) {
                        var ngValid = form.find('.ng-valid');
                        if ($scope[form.attr('name')].$valid) {
                            //ngValid.removeClass('error');
                            ngValid.parent().removeClass('has-error');
                            /* jshint -W069 */
                            $scope['save']();
                        } else {
                            console.log('Missing or invalid field(s). Please verify the fields in red.');
                            //ngValid.removeClass('error');
                            ngValid.parent().removeClass('has-error');

                            var ngInvalid = form.find('.ng-invalid');
                            //ngInvalid.addClass('error');
                            ngInvalid.parent().addClass('has-error');
                        }
                    }
                });
            });
        }
    };
}]);

angular.module('utils').directive('sgReset', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        link: function ($scope, elem, attr, ctrl) {
            elem.addClass('btn btn-default');
            elem.attr('type', 'submit');
            elem.bind('click', function () {
                $scope.$apply(function () {
                    var form = elem.closest('form');
                    if (form && form.attr('name')) {
                        form.find('.ng-valid').removeClass('error');
                        form.find('.ng-invalid').removeClass('error');
                        /* jshint -W069 */
                        $scope['reset']();
                    }
                });
            });
        }
    };
}]);

angular.module('utils').directive('sgCancel', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        link: function ($scope, elem, attr, ctrl) {
            elem.addClass('btn btn-default');
            elem.attr('type', 'submit');
        }
    };
}]);

angular.module('utils').directive('sgDelete', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        link: function ($scope, elem, attr, ctrl) {
            elem.addClass('btn btn-danger');
            elem.attr('type', 'submit');
        }
    };
}]);

angular.module('utils').filter('remove', function () {
    return function (input, remove, attribute) {
        if (!input || !remove) {
            return input;
        }

        var out = [];
        for (var i = 0; i < input.length; i++) {
            var e = input[i];

            if (Array.isArray(remove)) {
                for (var j = 0; j < remove.length; j++) {
                    if (attribute) {
                        if (remove[j][attribute] === e[attribute]) {
                            e = null;
                            break;
                        }
                    } else {
                        if (remove[j] === e) {
                            e = null;
                            break;
                        }
                    }
                }
            } else {
                if (attribute) {
                    if (remove[attribute] === e[attribute]) {
                        e = null;
                    }
                } else {
                    if (remove === e) {
                        e = null;
                    }
                }
            }

            if (e !== null) {
                out.push(e);
            }
        }

        return out;
    };
});

angular.module('utils').filter('capitalize', function () {
    return function (input) {
        if (!input) {
            return;
        }
        var result = input.substring(0, 1).toUpperCase();
        var s = input.substring(1);
        for (var i = 0; i < s.length; i++) {
            var c = s[i];
            if (c.match(/[A-Z]/)) {
                result = result.concat(' ');
            }
            result = result.concat(c);
        }
        return result;
    };
});

angular.module("sgtemplate/modal/modal.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("sgtemplate/modal/modal.html",
        "<div class=\"modal-header\">\n" +
        "<button type=\"button\" class=\"close\" ng-click=\"cancel()\">\n" +
        "<span class=\"pficon pficon-close\">?</span>\n" +
        "</button>\n" +
        "<h4 class=\"modal-title\">{{title}}</h4>\n" +
        "</div>\n" +
        "<div class=\"modal-body\">{{message}}</div>\n" +
        "<div class=\"modal-footer\">\n" +
        "<button type=\"button\" data-ng-class=\"btns.cancel.cssClass\" ng-click=\"cancel()\">{{btns.cancel.label}}</button>\n" +
        "<button type=\"button\" data-ng-class=\"btns.ok.cssClass\" ng-click=\"ok()\">{{btns.ok.label}}</button>\n" +
        "</div>\n" +
        ""
    );
}]);

/* jshint ignore:start */
function resolveSgUbigeoTemplate(tElement, tAttrs) {
    var layout = tAttrs.formLayout;
    if (!layout)
        layout = 'horizontal';

    if (layout === 'basic') {
        return ''
            + '<div class="row">'
            + '<div class="col-sm-4">'
            + '<div class="form-group" ng-class="{ \'has-error\' : formSgUbigeo.departamento.$invalid && (formSgUbigeo.departamento.$touched || formSgUbigeo.$submitted)}">'
            + '<label>Departamento</label>'
            + '<ui-select name="departamento" ng-model="ubigeo.departamento">'
            + '<ui-select-match placeholder="Seleccione">{{$select.selected.denominacion}}</ui-select-match>'
            + '<ui-select-choices repeat="item in departamentos | filter: $select.search">'
            + '<div ng-bind-html="item.denominacion | highlight: $select.search"></div>'
            + '<small ng-bind-html="item.codigo | highlight: $select.search"></small>'
            + '</ui-select-choices>'
            + '</ui-select>'
            + '<div ng-messages="formSgUbigeo.departamento.$error" ng-if="formSgUbigeo.departamento.$touched || formSgUbigeo.$submitted">'
            + '<div class="help-block" ng-message="required">Ingrese departamento.</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '<div class="col-sm-4">'
            + '<div class="form-group" ng-class="{ \'has-error\' : formSgUbigeo.provincia.$invalid && (formSgUbigeo.provincia.$touched || formSgUbigeo.$submitted)}">'
            + '<label>Provincia</label>'
            + '<ui-select name="provincia" ng-model="ubigeo.provincia">'
            + '<ui-select-match placeholder="Seleccione">{{$select.selected.denominacion}}</ui-select-match>'
            + '<ui-select-choices repeat="item in provincias | filter: $select.search">'
            + '<div ng-bind-html="item.denominacion | highlight: $select.search"></div>'
            + '<small ng-bind-html="item.codigo | highlight: $select.search"></small>'
            + '</ui-select-choices>'
            + '</ui-select>'
            + '<div ng-messages="formSgUbigeo.provincia.$error" ng-if="formSgUbigeo.provincia.$touched || formSgUbigeo.$submitted">'
            + '<div class="help-block" ng-message="required">Ingrese provincia.</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '<div class="col-sm-4">'
            + '<div class="form-group" ng-class="{ \'has-error\' : formSgUbigeo.provincia.$invalid && (formSgUbigeo.provincia.$touched || formSgUbigeo.$submitted)}">'
            + '<label>Distrito</label>'
            + '<ui-select name="distrito" ng-model="ubigeo.distrito">'
            + '<ui-select-match placeholder="Seleccione">{{$select.selected.denominacion}}</ui-select-match>'
            + '<ui-select-choices repeat="item in distritos | filter: $select.search">'
            + '<div ng-bind-html="item.denominacion | highlight: $select.search"></div>'
            + '<small ng-bind-html="item.codigo | highlight: $select.search"></small>'
            + '</ui-select-choices>'
            + '</ui-select>'
            + '<div ng-messages="formSgUbigeo.distrito.$error" ng-if="formSgUbigeo.distrito.$touched || formSgUbigeo.$submitted">'
            + '<div class="help-block" ng-message="required">Ingrese provincia.</div>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>'
    } else if (layout === 'inline') {

    } else if (layout === 'horizontal') {
        return ''
            + '<div class="form-group" ng-class="{ \'has-error\' : (formSgUbigeo.departamento.$invalid || formSgUbigeo.provincia.$invalid || formSgUbigeo.distrito.$invalid) && (formSgUbigeo.departamento.$touched || formSgUbigeo.$submitted)}">'
            + '<label class="col-sm-2 control-label">Ubigeo:</label>'
            + '<div class="col-sm-3">'
            + '<ui-select name="departamento" ng-model="ubigeo.departamento">'
            + '<ui-select-match placeholder="Departamento">{{$select.selected.denominacion}}</ui-select-match>'
            + '<ui-select-choices repeat="item in departamentos | filter: $select.search">'
            + '<div ng-bind-html="item.denominacion | highlight: $select.search"></div>'
            + '<small ng-bind-html="item.codigo | highlight: $select.search"></small>'
            + '</ui-select-choices>'
            + '</ui-select>'
            + '<div ng-messages="formSgUbigeo.departamento.$error" ng-if="formSgUbigeo.departamento.$touched || formSgUbigeo.$submitted">'
            + '<div class="help-block" ng-message="required">Ingrese departamento.</div>'
            + '</div>'
            + '</div>'
            + '<div class="col-sm-3">'
            + '<ui-select name="provincia" ng-model="ubigeo.provincia">'
            + '<ui-select-match placeholder="Provincia">{{$select.selected.denominacion}}</ui-select-match>'
            + '<ui-select-choices repeat="item in provincias | filter: $select.search">'
            + '<div ng-bind-html="item.denominacion | highlight: $select.search"></div>'
            + '<small ng-bind-html="item.codigo | highlight: $select.search"></small>'
            + '</ui-select-choices>'
            + '</ui-select>'
            + '<div ng-messages="formSgUbigeo.provincia.$error" ng-if="formSgUbigeo.provincia.$touched || formSgUbigeo.$submitted">'
            + '<div class="help-block" ng-message="required">Ingrese provincia.</div>'
            + '</div>'
            + '</div>'
            + '<div class="col-sm-3">'
            + '<ui-select name="distrito" ng-model="ubigeo.distrito">'
            + '<ui-select-match placeholder="Distrito">{{$select.selected.denominacion}}</ui-select-match>'
            + '<ui-select-choices repeat="item in distritos | filter: $select.search">'
            + '<div ng-bind-html="item.denominacion | highlight: $select.search"></div>'
            + '<small ng-bind-html="item.codigo | highlight: $select.search"></small>'
            + '</ui-select-choices>'
            + '</ui-select>'
            + '<div ng-messages="formSgUbigeo.distrito.$error" ng-if="formSgUbigeo.distrito.$touched || formSgUbigeo.$submitted">'
            + '<div class="help-block" ng-message="required">Ingrese provincia.</div>'
            + '</div>'
            + '</div>'
            + '</div>'
    }
}
/* jshint ignore:end */

angular.module('utils').directive('sgUbigeo', ['MaestroService', function (MaestroService) {
    return {
        restrict: 'E',
        replace: false,
        require: ['^form', 'ngModel'],
        link: function ($scope, elem, attrs, ngModel) {

            ngModel[1].$validators.sgubigeo = function (modelValue, viewValue) {
                var value = modelValue || viewValue;
                value = value ? value : '';
                //false representa error y true represeta exito
                if ($scope.requerido)
                    return (value.length === 6);
                else
                    return (value.length === 6 || value.length === 0);
            };

            MaestroService.getDepartamentos().then(function (data) {
                $scope.departamentos = data;
                $scope.activeListener();
            });

            $scope.provincias = undefined;
            $scope.distritos = undefined;

            $scope.ubigeo = {
                departamento: undefined,
                provincia: undefined,
                distrito: undefined
            };

            $scope.$watch('ubigeo.departamento', function () {
                if (!angular.isUndefined($scope.ubigeo.departamento) && $scope.ubigeo.departamento) {
                    MaestroService.getProvinciasByCodigo($scope.ubigeo.departamento.codigo).then(function (data) {
                        $scope.provincias = data;
                    });
                    ngModel[0].$setDirty();
                } else {
                    $scope.ubigeo.provincia = undefined;
                    $scope.ubigeo.distrito = undefined;

                    $scope.provincias = undefined;
                    $scope.distritos = undefined;
                }
            });
            $scope.$watch('ubigeo.provincia', function () {
                if (!angular.isUndefined($scope.ubigeo.provincia) && $scope.ubigeo.provincia) {
                    MaestroService.getDistritosByCodigo($scope.ubigeo.departamento.codigo, $scope.ubigeo.provincia.codigo).then(function (data) {
                        $scope.distritos = data;
                    });
                } else {
                    $scope.ubigeo.distrito = undefined;

                    $scope.distritos = undefined;
                }
            });
            $scope.$watch('ubigeo.distrito', function () {
                if (!angular.isUndefined($scope.ubigeo.distrito) && $scope.ubigeo.distrito) {
                    var ubigeo = $scope.ubigeo.departamento.codigo + $scope.ubigeo.provincia.codigo + $scope.ubigeo.distrito.codigo;
                    ngModel[1].$setViewValue(ubigeo);
                }
            });

            $scope.activeListener = function () {
                var listener = $scope.$watch(function () {
                    return ngModel[1].$modelValue;
                }, function () {
                    if (ngModel[1].$modelValue && ngModel[1].$modelValue.length === 6 && angular.isUndefined($scope.provincias) && angular.isUndefined($scope.distritos)) {

                        for (var i = 0; i < $scope.departamentos.length; i++) {
                            if ($scope.departamentos[i].codigo === ngModel[1].$modelValue.substring(0, 2)) {
                                $scope.ubigeo.departamento = $scope.departamentos[i];
                                break;
                            }
                        }

                        MaestroService.getProvinciasByCodigo($scope.ubigeo.departamento.codigo).then(function (data) {
                            $scope.provincias = data;
                            for (var i = 0; i < $scope.provincias.length; i++) {
                                if ($scope.provincias[i].codigo === ngModel[1].$modelValue.substring(2, 4)) {
                                    $scope.ubigeo.provincia = $scope.provincias[i];
                                    break;
                                }
                            }

                            MaestroService.getDistritosByCodigo($scope.ubigeo.departamento.codigo, $scope.ubigeo.provincia.codigo).then(function (data) {
                                $scope.distritos = data;
                                for (var i = 0; i < $scope.distritos.length; i++) {
                                    if ($scope.distritos[i].codigo === ngModel[1].$modelValue.substring(4, 6)) {
                                        $scope.ubigeo.distrito = $scope.distritos[i];
                                        break;
                                    }
                                }
                            });
                        });

                        listener();
                    } else {
                        listener();
                    }
                });
            };
        },
        scope: {
            requerido: '@',
            formLayout: '@'
        },
        template: resolveSgUbigeoTemplate // jshint ignore:line
    };
}]);
