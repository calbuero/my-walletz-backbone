﻿/* jshint browser: true, curly: true, eqeqeq: true, forin: true, latedef: true,
    newcap: true, noarg: true, noempty: true, nonew: true, strict:true,
    undef: true, unused: true */
/* global jQuery: false, _: false, Backbone: false */

(function ($, _, Backbone, App) {
    'use strict';

    var Views = App.Views || (App.Views = {});

    Views.AccountList = Backbone.View.extend({
        el: '#account-list-page',

        initialize: function (options) {
            this.router = options.router;

            this.dataGrid = new App.Components.DataGrid({
                el: this.$('.data-grid'),
                collection: this.collection,
                rowTemplate: _.template(this.$('#account-grid-row-template').html())
            });

            this.listenTo(this.dataGrid, 'sort', this.onSort);
            this.listenTo(this.dataGrid, 'command', this.onCommand);
            this.listenTo(this.dataGrid, 'rowRender', this.onRowRender);
        },

        render: function() {
            this.dataGrid.render();
            return this;
        },

        remove: function() {
            this.dataGrid.remove();
            Backbone.View.prototype.remove.call(this, arguments);
        },

        destroy: function(model) {
            var title = model.get('title');

            var confirmOption = {
                prompt: 'Are you sure you want to delete <strong>' +
                    title +
                    '</strong> account?',
                ok: function () {
                    model.destroy({
                        success: function () {
                            $.showSuccessbar('<strong>' + title + '</strong>' +
                                ' account deleted successfully.');
                        },
                        error: function () {
                            $.showErrorbar('An error has occurred while ' +
                                'deleting <strong>' +
                                title +
                                '</strong> account.');
                        }
                    });
                }
            };

            $.confirm(confirmOption);
        },

        onSort: function(e) {
            e.preventDefault();
            var order = e.order === App.Components.SortOrder.descending ?
                'descending' :
                'ascending';
            this.router.navigate(
                App.clientUrl('/accounts', e.attribute, order),
                true);
        },

        onCommand: function(e) {
            if (e.command !== 'delete') {
                return;
            }
            e.preventDefault();
            this.destroy(e.model);
        },

        onRowRender: function(e) {
            e.viewModel = _.extend(e.dataModel.toJSON(), {
                formattedBalance: function() {
                    return Views.helpers.formatMoney(
                        this.balance,
                        this.currency);
                }
            });
        }
    });

    _.extend(Views.AccountList.prototype, Views.Activable);

})(jQuery, _, Backbone, window.App || (window.App = {}));