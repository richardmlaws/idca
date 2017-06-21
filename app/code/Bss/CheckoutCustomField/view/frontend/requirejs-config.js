var config = {
    "map": {
        "*": {
            "Magento_Checkout/js/model/shipping-save-processor/default" : "Bss_CheckoutCustomField/js/shipping-save-processor-override",
            "Magento_Ui/js/lib/validation/rules" : "Bss_CheckoutCustomField/js/lib/validation/rules",
            "Magento_Checkout/js/view/shipping" : "Bss_CheckoutCustomField/js/view/shipping"
        }
    },
    config: {
        mixins: {
            'Magento_Checkout/js/action/place-order': {
                'Bss_CheckoutCustomField/js/model/place-order-custome-field': true
            }
        }
    }
};
