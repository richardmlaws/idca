define([
    'mage/utils/wrapper',
    'Magento_Checkout/js/model/address-converter',
    'Magento_Checkout/js/action/select-shipping-address',
    'Magento_Checkout/js/model/quote',
    'Swissup_Firecheckout/js/action/set-shipping-address'
], function(wrapper, addressConverter, selectShippingAddress, quote, setShippingAddressAction) {
    'use strict';

    var checkoutConfig = window.checkoutConfig;

    return function(target) {
        if (!checkoutConfig.isFirecheckout) {
            return target;
        }

        target.validateFields = function() {
            var addressFlat = addressConverter.formDataProviderToFlatData(
                    this.collectObservedData(),
                    'shippingAddress'
                ),
                address;

            if (this.validateAddressData(addressFlat)) {
                address = addressConverter.formAddressDataToQuoteAddress(addressFlat);

                var shippingAddress = quote.shippingAddress();
                for (var field in address) {
                    if (address.hasOwnProperty(field) &&
                        shippingAddress.hasOwnProperty(field) &&
                        typeof address[field] != 'function'
                    ) {
                        address[field] = shippingAddress[field];
                    }
                }

                // this will trigger estimate-shipping-methods request
                selectShippingAddress(address);

                // save shipping address to get updated payment methods
                if (-1 !== checkoutConfig.swissup.firecheckout.dependencies.payment.indexOf('address')) {
                    setShippingAddressAction();
                }
            }
        };
        return target;
    }
});
