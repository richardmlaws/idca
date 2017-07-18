define([
    'jquery',
    'mage/utils/wrapper',
    'Swissup_Firecheckout/js/model/region-serializer'
], function ($, wrapper, regionSerializer) {
    'use strict';

    var checkoutConfig = window.checkoutConfig;

    return function (target) {
        if (!checkoutConfig.isFirecheckout) {
            return target;
        }

        target.setPaymentMethods = wrapper.wrap(
            target.setPaymentMethods,
            function(originalAction, methods) {
                // Save form values
                var data = regionSerializer.serialize($('.payment-method._active'));

                originalAction(methods);

                // Restore form values
                setTimeout(function() {
                    regionSerializer.restore($('.payment-method._active'), data);
                }, 500);
            }
        );
        return target;
    };
});
