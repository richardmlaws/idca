define([
    'uiComponent',
    'Magento_Checkout/js/model/payment/additional-validators',
    'Swissup_Firecheckout/js/model/validator'
], function (Component, additionalValidators, validator) {
    'use strict';

    if (!window.checkoutConfig.isFirecheckout) {
        additionalValidators.registerValidator(validator);
    }

    return Component.extend({});
});
