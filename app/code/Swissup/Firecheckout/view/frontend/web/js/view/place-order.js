define([
    'jquery',
    'ko',
    'uiComponent',
    'Magento_Checkout/js/model/quote',
    'Swissup_Firecheckout/js/model/firecheckout'
], function($, ko, Component, quote, firecheckout) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'Swissup_Firecheckout/place-order'
        },
        message: ko.observable(false),

        placeOrder: firecheckout.placeOrder.bind(firecheckout),

        initialize: function() {
            this._super();

            // instant button title update
            quote.paymentMethod.subscribe(function(method) {
                // var radio = $('#' + method.method),
                //     form = radio.parents('.payment-method'),
                //     button = $('.action.checkout', form);

                // if (button) {
                //     $('.action.checkout span', '.place-order').text(button.text());
                // }
            });
        }
    });
});
