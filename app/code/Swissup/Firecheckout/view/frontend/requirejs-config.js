var config = {
    config: {
        mixins: {
            'Magento_Checkout/js/model/step-navigator': {
                'Swissup_Firecheckout/js/model/step-navigator-mixin': true
            },
            'Magento_Checkout/js/model/resource-url-manager': {
                'Swissup_Firecheckout/js/model/resource-url-manager-mixin': true
            },
            'Magento_Checkout/js/model/shipping-rates-validator': {
                'Swissup_Firecheckout/js/model/shipping-rates-validator-mixin': true
            },
            'Magento_Checkout/js/action/place-order': {
                'Swissup_Firecheckout/js/action/place-order-mixin': true
            }
        }
    }
};
