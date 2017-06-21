define(
    [
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/model/shipping-rate-registry',
        'Magento_Checkout/js/model/shipping-rate-processor/new-address',
        'Magento_Checkout/js/model/shipping-rate-processor/customer-address'
    ],
    function (
        quote,
        shippingRateRegistry,
        defaultProcessor,
        customerAddressProcessor
    ) {
        'use strict';

        return function() {
            var processors = [];
            processors.default =  defaultProcessor;
            processors['customer-address'] = customerAddressProcessor;

            var address = quote.shippingAddress();
            var addressType = address.getType();
            shippingRateRegistry.set(address.getCacheKey(), '');

            if (processors[addressType]) {
                processors[addressType].getRates(quote.shippingAddress());
            } else {
                processors.default.getRates(quote.shippingAddress());
            }
        };
    }
);
