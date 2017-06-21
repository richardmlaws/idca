define(
    ['jquery', 'mage/translate'],
    function ($, $t) {
        'use strict';

        return function(totalQty) {
            // used when navigating between checkout steps
            window.checkoutConfig.totalsData.items_qty = totalQty;

            var spansArr = $('.opc-block-summary .items-in-cart .title strong span');
            if (spansArr.length) {
                $(spansArr[0]).html(totalQty);
                $(spansArr[1]).html(
                    totalQty === 1 ? $t('Item in Cart') : $t('Items in Cart')
                );
            }
        };
    }
);
