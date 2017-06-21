define([
    'underscore',
    'Magento_Checkout/js/view/shipping',
    'uiRegistry',
    'Magento_Checkout/js/action/set-shipping-information',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/address-converter',
    'Magento_Checkout/js/action/select-shipping-address'
], function(
    _,
    Shipping,
    registry,
    setShippingInformationAction,
    quote,
    addressConverter,
    selectShippingAddress
) {
    return Shipping.extend({
        initialize: function () {
            this._super();

            var debouncedSelectShippingAddress = _.debounce(selectShippingAddress, 2000);

            // Instant copy to "quote shipping address object"
            registry.async('checkoutProvider')(function (checkoutProvider) {
                checkoutProvider.on('shippingAddress', function (shippingAddressData) {
                    var shippingAddress = quote.shippingAddress();
                    var addressData = addressConverter.formAddressDataToQuoteAddress(shippingAddressData);
                    for (var field in addressData) {
                        if (addressData.hasOwnProperty(field) &&
                            shippingAddress.hasOwnProperty(field) &&
                            typeof addressData[field] != 'function'
                        ) {
                            shippingAddress[field] = addressData[field];
                        }
                    }
                    debouncedSelectShippingAddress(shippingAddress);
                });
            });
        }
    });
});
