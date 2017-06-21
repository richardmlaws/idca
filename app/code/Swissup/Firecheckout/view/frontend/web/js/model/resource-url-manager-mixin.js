define([
    'mage/utils/wrapper'
], function(wrapper) {
    'use strict';

    var checkoutConfig = window.checkoutConfig;

    return function(target) {
        if (!checkoutConfig.isFirecheckout) {
            return target;
        }

        /**
         * Save shipping method, without address validation.
         *
         * @param  Magento_Checkout/js/model/quote quote
         * @return string
         */
        target.getUrlForSetShippingMethod = function(quote) {
            var params = (this.getCheckoutMethod() == 'guest') ? {cartId: quote.getQuoteId()} : {};
            var urls = {
                'guest': '/guest-carts/:cartId/shipping-method',
                'customer': '/carts/mine/shipping-method'
            };
            return this.getUrl(urls, params);
        };

        /**
         * Save shipping address only to reload payment methods, if needed.
         * Shipping methods may not be available at this point.
         *
         * @param  Magento_Checkout/js/model/quote quote
         * @return string
         */
        target.getUrlForSetShippingAddress = function(quote) {
            var params = (this.getCheckoutMethod() == 'guest') ? {cartId: quote.getQuoteId()} : {};
            var urls = {
                'guest': '/guest-carts/:cartId/shipping-address',
                'customer': '/carts/mine/shipping-address'
            };
            return this.getUrl(urls, params);
        };

        return target;
    }
});
