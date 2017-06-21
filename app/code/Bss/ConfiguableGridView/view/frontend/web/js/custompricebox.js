define([
    'jquery',
    'Magento_Catalog/js/price-utils',
    'underscore',
    'mage/template',
    'jquery/ui',
    'priceBox',
    ], function ($, utils, _, mageTemplate) {

        $.widget('bss_configuablegridview.priceBox', $.mage.priceBox, {
            updatePrice: function updatePrice(newPrices) {
                var prices = this.cache.displayPrices,
                additionalPrice = {},
                pricesCode = [];

                this.cache.additionalPriceObject = this.cache.additionalPriceObject || {};

                if (newPrices) {
                    $.extend(this.cache.additionalPriceObject, newPrices);
                }

                if (!_.isEmpty(additionalPrice)) {
                    pricesCode = _.keys(additionalPrice);
                } else if (!_.isEmpty(prices)) {
                    pricesCode = _.keys(prices);
                }

                _.each(this.cache.additionalPriceObject, function (additional) {
                    if (additional && !_.isEmpty(additional)) {
                        pricesCode = _.keys(additional);
                    }
                    _.each(pricesCode, function (priceCode) {
                        var priceValue = additional[priceCode] || {};
                        priceValue.amount = +priceValue.amount || 0;
                        priceValue.adjustments = priceValue.adjustments || {};

                        additionalPrice[priceCode] = additionalPrice[priceCode] || {
                            'amount': 0,
                            'adjustments': {}
                        };
                        additionalPrice[priceCode].amount =  0 + (additionalPrice[priceCode].amount || 0)
                        + priceValue.amount;
                        _.each(priceValue.adjustments, function (adValue, adCode) {
                            additionalPrice[priceCode].adjustments[adCode] = 0
                            + (additionalPrice[priceCode].adjustments[adCode] || 0) + adValue;
                        });
                    });
                });

                if (_.isEmpty(additionalPrice)) {
                    this.cache.displayPrices = utils.deepClone(this.options.prices);
                    bss_optionAmount = 0;
                } else {
                    var priceFormat = (this.options.priceConfig && this.options.priceConfig.priceFormat) || {};
                    _.each(additionalPrice, function (option, priceCode) {
                        var origin = this.options.prices[priceCode] || {},
                        final = prices[priceCode] || {};
                        option.amount = option.amount || 0;
                        origin.amount = origin.amount || 0;
                        origin.adjustments = origin.adjustments || {};
                        final.adjustments = final.adjustments || {};
                        final.amount = 0 + origin.amount + option.amount;

                        bss_optionAmount = option.amount;
                        
                        _.each(option.adjustments, function (pa, paCode) {
                            final.adjustments[paCode] = 0 + (origin.adjustments[paCode] || 0) + pa;
                        });
                    }, this);
                }

                if(bss_optionAmount !== '') {
                    if($('#bss_configurablegridview').length > 0 ) { 
                        clearTimeout(bss_configurablegridview_timer);
                        bss_configurablegridview_timer = setTimeout(function() {
                            $('#bss_configurablegridview .unit-price').each(function() {
                                if($(this).parent().parent().find('.unit').length > 0) {
                                    $(this).parent().parent().find('.unit').html(utils.formatPrice(parseFloat($(this).val()) + bss_optionAmount , priceFormat));
                                }
                            });
                            for(var i = 0; i < old_configuable_qty_price_array.length ; i++) {
                                if(old_configuable_qty_price_array[i].constructor != Array) {
                                    var newObject = new Object();
                                    for(var key in configuable_qty_price_array[i]){
                                        newObject[key] = old_configuable_qty_price_array[i][key] / 1 + bss_optionAmount;
                                    }
                                    configuable_qty_price_array[i] = newObject;
                                }else {
                                    configuable_qty_price_array[i][0] = old_configuable_qty_price_array[i][0]/ 1 + bss_optionAmount;
                                }
                            };
                            $('#bss_configurablegridview .qty_att_product').change();
                        },200);
                    };
                };

                this.element.trigger('reloadPrice');
            }
        });

return $.bss_configuablegridview.priceBox;

});