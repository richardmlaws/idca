var config = {
    config: {
        mixins: {
            'Magento_Checkout/js/view/shipping-address/address-renderer/default': {
                'Swissup_AddressFieldManager/js/view/shipping-address/address-renderer/default-mixin': true
            },
            'Magento_Checkout/js/view/shipping-information/address-renderer/default': {
                'Swissup_AddressFieldManager/js/view/shipping-information/address-renderer/default-mixin': true
            },
            'Magento_Checkout/js/view/billing-address': {
                'Swissup_AddressFieldManager/js/view/billing-address-mixin': true
            }
        }
    }
};
