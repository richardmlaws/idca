define([
    "jquery",
    'uiComponent',
    'Magento_Customer/js/customer-data',
    'ko',
    'underscore',
    'mage/apply/main'
], function ($, Component, customerData, ko, _, mage) {
    'use strict';

    var _options = {},
    calls = 0,
    Modals;

    Modals = {
        elements: {},
        add: function (id, element) {
            this.elements[id] = element;
        },
        show: function(value, key) {
            var id = 'ajaxpro-' + key;

            var self = this;
            if (self.elements[id]) {
                var element = self.elements[id];
                self.hide();
                element.trigger('openModal');
            }
        },
        hide: function() {
            $('.block-ajaxpro').each(function(i, el) {
                $(el).trigger('closeModal');
            });
        }
    }

    // ko.bindingHandlers.htmlWithBinding = {
    //    'init': function() {
    //         return { 'controlsDescendantBindings': true };
    //     },
    //     'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    //         // console.log('start htmlWithBinding');
    //         // console.log(element);
    //         // console.log(arguments);
    //         // element.innerHTML = valueAccessor();
    //         $(element).html(valueAccessor());
    //         ko.applyBindingsToDescendants(bindingContext, element);
    //     }
    // };

    return Component.extend({

        ajaxpro: {},

        initialize: function(options) {
            var self = this,
            sections = ['ajaxpro-cart', 'ajaxpro-product'];
            // console.log(' Ajaxpro init');
            // customerData.invalidate(sections);
            // console.log($.initNamespaceStorage('mage-cache-storage-section-invalidation').localStorage.get());

            _.each(sections, function(section) {
                var ajaxproData = customerData.get(section);
                // ajaxproData.extend({disposableCustomerData: section});
                self.update(ajaxproData());
                ajaxproData.subscribe(self._subscribe, self);
            });
            // Modals.hideAll();

            // console.log('ajaxpro component init');
            // $.extend(true, _options, options);
            // console.log(options);
            // _.each(_.union(sections, ['wishlist', 'compare-products']), function(section) {
            //     var ajaxproData = customerData.get(section);
            //     ajaxproData.subscribe(function (updatedData) {
            //         console.log('mage.apply');
            //         console.log(updatedData);
            //         // ko.applyBindings();
            //         $(mage.apply);
            //     })

            // });
            return this._super();
        },
        _subscribe: function (updatedData) {
            // console.log('called subscribe func');
            calls--;
            this.isLoading(calls > 0);
            this.update(updatedData);
            _.each(updatedData, $.proxy(Modals.show, Modals));

            // ko.applyBindings();
            $(mage.apply);
        },
        isLoading: ko.observable(false),

        isActive: function() {
            return true;
        },
        setModalElement: function(element) {
            var el = $(element).closest('.block-ajaxpro');
            if (el) {
                Modals.add(element.id, el);
            }
        },

        // {

        version: function() {
            return '1.0.0';
        },
        // init: function(options){
        //     console.log('ajaxpro init');
        //     console.log(options);
        // },
        // Ajaxpro: function(options) {
        //     this.init(options);
        // },
    // }

        /**
         * Update mini shopping cart content.
         *
         * @param {Object} updatedData
         * @returns void
         */
        update: function(updatedData) {
            // console.log('called "update" func');
            // console.log(updatedData);
            _.each(updatedData, function (value, key) {
                if (!this.ajaxpro.hasOwnProperty(key)) {
                    this.ajaxpro[key] = ko.observable();
                }
                this.ajaxpro[key](value);
            }, this);
        },

        /**
         * Get ajaxpro param by name.
         * @param {String} name
         * @returns {*}
         */
        getAjaxproParam: function(name) {
            // console.log(name);
            if (!_.isUndefined(name)) {
                if (!this.ajaxpro.hasOwnProperty(name)) {
                    this.ajaxpro[name] = ko.observable();
                }
            }

            return this.ajaxpro[name]();
        }
    });
});