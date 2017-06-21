var config = {
    map : {
        '*' : {
            'DeliveryDate': 'Swissup_DeliveryDate/js/delivery-date',
            "Magento_Checkout/js/model/shipping-save-processor/default" : "Swissup_DeliveryDate/js/shipping-save-processor/default"
        }
    },
    config : {
        mixins: {
            'Magento_Checkout/js/view/shipping': {
                'Swissup_DeliveryDate/js/view/shipping-mixin': true
            }
        }
    }
}