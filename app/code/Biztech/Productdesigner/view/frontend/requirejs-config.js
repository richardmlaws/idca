/**
 * Copyright © 2016 Biztech. All rights reserved.
 * See COPYING.txt for license details.
 */
/*var config = {
    "config" : {
        "mixins" : {
            'Magento_Checkout/js/view/minicart' : {
                'Biztech_Productdesigner/js/minicart' :  true
            },
        },
    }
};*/
var config = {
    map: {
        '*': {
            'Magento_Checkout/js/view/minicart':'Biztech_Productdesigner/js/minicart'
        }
    }
};