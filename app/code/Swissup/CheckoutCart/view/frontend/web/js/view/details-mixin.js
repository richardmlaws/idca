define([
    'jquery',
    'mage/translate',
    'Magento_Ui/js/modal/confirm',
    'Magento_Checkout/js/model/quote',
    'Swissup_CheckoutCart/js/action/update-cart',
    'Swissup_CheckoutCart/js/action/remove-item',
], function($, $t, modalConfirm, quote, updateCartAction, removeItemAction) {
    'use strict';

    var checkoutConfig = window.checkoutConfig;

    return function(target) {
        if (!checkoutConfig.useSwissupCheckoutCart) {
            return target;
        }

        return target.extend({
            incQty: function(item) {
                this.applyQty(item.item_id, item.qty + 1);
            },
            decQty: function(item) {
                if (item.qty - 1 == 0) {
                    this.removeItem(item);
                } else {
                    this.applyQty(item.item_id, item.qty - 1);
                }
            },
            newQty: function(item, event) {
                if (item.qty == 0) {
                    this.removeItem(item, event);
                } else {
                    var quoteItem = this.getQuoteItemById(item.item_id);

                    if (this.isValidQty(quoteItem.qty, item.qty)) {
                        this.applyQty(item.item_id, item.qty);
                    } else {
                        item.qty = quoteItem.qty;
                        $(event.target).val(item.qty);
                    }
                }
            },
            applyQty: function(itemId, qty) {
                var quoteItem = this.getQuoteItemById(itemId);
                quoteItem.qty = qty;

                var params = {
                    cartItem: {
                        item_id: itemId,
                        qty: qty,
                        quote_id: quote.getQuoteId()
                    }
                };

                updateCartAction(quote, params);
            },
            removeItem: function(item, event) {
                var quoteItem = this.getQuoteItemById(item.item_id);
                modalConfirm({
                    content: $t('Are you sure you want to remove this item?'),
                    actions: {
                        confirm: function() {
                            removeItemAction(quote, item.item_id);
                        },
                        cancel: function () {
                            if (event) {
                                item.qty = quoteItem.qty;
                                $(event.target).val(item.qty);
                            }
                        }
                    }
                });
            },
            isValidQty: function (origin, changed) {
                return (origin != changed) &&
                    (changed.length > 0) &&
                    (changed - 0 == changed) &&
                    (changed - 0 > 0);
            },
            getQuoteItemById: function(item_id) {
                return $.grep(quote.getItems(), function(item) {
                    return item.item_id == item_id;
                })[0];
            }
        });
    };
});
