/*jshint browser:true jquery:true*/
/*global alert*/
var config = {
    config: {
        mixins: {
            'Magento_Checkout/js/model/error-processor': {
                'Swissup_Taxvat/js/model/error-processor-mixin': true
            }
        }
    }
};
