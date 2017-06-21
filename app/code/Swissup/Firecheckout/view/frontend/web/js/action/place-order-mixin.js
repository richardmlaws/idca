define([
    'jquery',
    'mage/utils/wrapper',
    'Magento_Checkout/js/model/quote',
    'Swissup_Firecheckout/js/model/firecheckout'
], function ($, wrapper, quote, firecheckout) {
    'use strict';

    var checkoutConfig = window.checkoutConfig;

    return function (placeOrderAction) {
        if (!checkoutConfig.isFirecheckout) {
            return placeOrderAction;
        }

        /** Override default place order action to save shipping address changes */
        return wrapper.wrap(placeOrderAction, function(originalAction, paymentData, messageContainer) {
            if (!quote.isVirtual()) {
                return $.when(firecheckout.submitShippingInformation())
                    .done(function() {
                        // Restore agreements checkboxes in case if section was rendered very fast
                        $('.checkout-agreements input:checkbox').prop('checked', true);
                        return originalAction(paymentData, messageContainer);
                    });
            }

            // Restore agreements checkboxes in case if section was rendered very fast
            $('.checkout-agreements input:checkbox').prop('checked', true);
            return originalAction(paymentData, messageContainer);
        });
    };
});
