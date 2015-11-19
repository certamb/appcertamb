'use strict';

angular.module('configuracion').service('$menuItemsConfiguracion', ['Auth',
    function (Auth) {

        this.menuItems = [];

        var $menuItemsRef = this;

        var menuItemObj = {
            parent: null,

            title: '',
            link: '', // starting with "./" will refer to parent link concatenation
            state: '', // will be generated from link automatically where "/" (forward slashes) are replaced with "."
            icon: '',

            isActive: false,
            label: null,

            menuItems: [],

            setLabel: function (label, color, hideWhenCollapsed) {
                if (typeof hideWhenCollapsed === 'undefined')
                    hideWhenCollapsed = true;

                this.label = {
                    text: label,
                    classname: color,
                    collapsedHide: hideWhenCollapsed
                };

                return this;
            },

            addItem: function (title, link, icon) {
                var parent = this,
                    item = angular.extend(angular.copy(menuItemObj), {
                        parent: parent,

                        title: title,
                        link: link,
                        icon: icon
                    });

                if (item.link) {
                    if (item.link.match(/^\./))
                        item.link = parent.link + item.link.substring(1, link.length);

                    if (item.link.match(/^-/))
                        item.link = parent.link + '-' + item.link.substring(2, link.length);

                    item.state = $menuItemsRef.toStatePath(item.link);
                }

                this.menuItems.push(item);

                return item;
            }
        };

        this.addItem = function (title, link, icon) {
            var item = angular.extend(angular.copy(menuItemObj), {
                title: title,
                link: link,
                state: this.toStatePath(link),
                icon: icon
            });

            this.menuItems.push(item);

            return item;
        };

        this.getAll = function () {
            return this.menuItems;
        };

        this.prepareSidebarMenu = function () {
            this.menuItems = [];

            var rolesSession = [];

            if (Auth.authz.resourceAccess.certamb) {
                rolesSession = Auth.authz.resourceAccess.certamb.roles;
            }

            var direccionRegional = this.addItem('Organizacion', '');

            if (rolesSession.indexOf('ver-direccionesRegionales') !== -1) {
                direccionRegional.addItem('Direccion regional', 'configuracion.app.organizacion.direccionRegional');
            }
            if (rolesSession.indexOf('ver-trabajadores') !== -1) {
                direccionRegional.addItem('Trabajadores', 'configuracion.app.organizacion.trabajador');
            }

            return this;
        };

        this.instantiate = function () {
            return angular.copy(this);
        };

        this.toStatePath = function (path) {
            return path.replace(/\//g, '.').replace(/^\./, '');
        };

    }
]);
