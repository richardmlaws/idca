define([
    'jquery',
    'mage/utils/wrapper',
    'Magento_Checkout/js/model/quote',
    'Swissup_Firecheckout/js/model/firecheckout',
    'Swissup_Firecheckout/js/model/validator'
], function($, wrapper, quote, firecheckout, validator) {
    'use strict';

    var checkoutConfig = window.checkoutConfig;

    return function(target) {
        if (!checkoutConfig.isFirecheckout) {
            return target;
        }

        return target.extend({
            placeOrder: function(data, event) {
                return firecheckout.beforePlaceOrder(
                    this._super.bind(this, data, event)
                );
            }
        });
    }
});
