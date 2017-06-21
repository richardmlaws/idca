/**
 * BSS Commerce Co.
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the EULA
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://bsscommerce.com/Bss-Commerce-License.txt
 *
 * =================================================================
 *                 MAGENTO EDITION USAGE NOTICE
 * =================================================================
 * This package designed for Magento COMMUNITY edition
 * BSS Commerce does not guarantee correct work of this extension
 * on any other Magento edition except Magento COMMUNITY edition.
 * BSS Commerce does not provide extension support in case of
 * incorrect edition usage.
 * =================================================================
 *
 * @category   BSS
 * @package    Bss_CheckoutCustomField
 * @author     Extension Team
 * @copyright  Copyright (c) 2015-2016 BSS Commerce Co. ( http://bsscommerce.com )
 * @license    http://bsscommerce.com/Bss-Commerce-License.txt
 */
define([
    'jquery',
    'mage/utils/wrapper'
], function ($, wrapper) {
    'use strict';

    return function (placeOrderAction) {
        return wrapper.wrap(placeOrderAction, function (originalAction, paymentData, redirectOnSuccess, messageContainer) {
            var extension_attributes = {};
            jQuery('.control [name*=bss_custom_field]').each(function () {
                var name = jQuery(this).attr("name");
                var name = name.replace('bss_custom_field[','');
                var name = name.replace(']','');
                if(jQuery(this).attr("type") == 'radio'){
                    if(jQuery(this).prop( "checked" )){
                        extension_attributes[name] = jQuery(this).val();
                    }
                }else if(jQuery(this).attr("type") == 'checkbox'){
                    if(jQuery(this).prop( "checked" )){
                        if(typeof extension_attributes[name]  === "undefined")
                            extension_attributes[name] = [];
                        extension_attributes[name].push(jQuery(this).val());
                    }
                }else{
                    extension_attributes[name] = jQuery(this).val();
                }
            });
            paymentData.extension_attributes = {
                bss_customfield:extension_attributes
            };
            return originalAction(paymentData, redirectOnSuccess, messageContainer);
        });
    };
});
