define([], function() {
    'use strict';

    var checkoutConfig = window.checkoutConfig;

    return function(target) {
        if (!checkoutConfig.useSwissupCheckoutCart) {
            return target;
        }

        target.getUrlForUpdateCartItems = function(quote) {
            var params = (this.getCheckoutMethod() == 'guest') ? {cartId: quote.getQuoteId()} : {};
            var urls = {
                'guest': '/guest-carts/:cartId/items',
                'customer': '/carts/mine/items'
            };
            return this.getUrl(urls, params);
        };

        target.getUrlForRemoveCartItem = function(quote, itemId) {
            var params = (this.getCheckoutMethod() == 'guest') ? {cartId: quote.getQuoteId()} : {};
            params.itemId = itemId;
            var urls = {
                'guest': '/guest-carts/:cartId/items/:itemId',
                'customer': '/carts/mine/items/:itemId'
            };
            return this.getUrl(urls, params);
        };

        return target;
    }
});
