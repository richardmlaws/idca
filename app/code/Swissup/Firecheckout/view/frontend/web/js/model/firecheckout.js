define([
    'jquery',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/resource-url-manager',
    'mage/storage',
    'Swissup_Firecheckout/js/model/validator',
    'Magento_Checkout/js/model/error-processor',
    'Magento_Checkout/js/model/full-screen-loader'
], function(
    $,
    quote,
    resourceUrlManager,
    storage,
    validator,
    errorProcessor,
    fullScreenLoader
) {
    'use strict';

    return {
        /**
         * Place Order method
         */
        placeOrder: function() {
            if (!validator.validate()) { // in case if payment method is not selected
                return false;
            }

            // quote.paymentMethod.placeOrder();
            $('.action.checkout', '.payment-method._active').click();
        },

        /**
         * This code is taken from Checkout/view/frontend/web/js/model/shipping-save-processor/default.js
         * Reason: remove setTotals and setPaymentMethods callbacks
         *
         * @return {[type]}            [description]
         */
        submitShippingInformation: function() {
            var payload = {
                addressInformation: {
                    shipping_address: quote.shippingAddress(),
                    billing_address: quote.billingAddress(),
                    shipping_method_code: quote.shippingMethod().method_code,
                    shipping_carrier_code: quote.shippingMethod().carrier_code
                }
            };

            fullScreenLoader.startLoader();

            return storage.post(
                resourceUrlManager.getUrlForSetShippingInformation(quote),
                JSON.stringify(payload)
            )
            .done(function() {
                fullScreenLoader.stopLoader();
            })
            .fail(function (response) {
                fullScreenLoader.stopLoader();
                errorProcessor.process(response);
            });
        }
    };
});
