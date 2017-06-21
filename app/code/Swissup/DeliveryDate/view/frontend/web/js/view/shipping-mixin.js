define([
    'jquery',
    'uiRegistry',
    'mageUtils'
], function($, registry, utils) {
    return function(target) {
        if (!window.checkoutConfig ||
            !window.checkoutConfig.swissup ||
            !window.checkoutConfig.swissup.DeliveryDate ||
            !window.checkoutConfig.swissup.DeliveryDate.required) {

            return target;
        }

        var isDate = function(date) {
            return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
        }

        return target.extend({
            validateShippingInformation: function() {
                var registryKey = 'checkout.steps.shipping-step.shippingAddress.shippingAdditional.delivery_date';
                var deliveryDateElement = registry.get(registryKey);

                if (deliveryDateElement) {
                    var value = $('[name="delivery_date"]').val();
                    if (utils.isEmpty(value) || !isDate(value)) {
                        deliveryDateElement.error(
                            $.mage.__('Please enter a valid date.')
                        );
                        return false;
                    }
                    deliveryDateElement.error(false);
                }
                return this._super();
            }
        });
    }
});

