<!--
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
 * @category  BSS
 * @package   Bss_QuantityDropdown
 * @author    Extension Team
 * @copyright Copyright (c) 2015-2016 BSS Commerce Co. ( http://bsscommerce.com )
 * @license   http://bsscommerce.com/Bss-Commerce-License.txt
 */
-->
require(
    [
    'jquery'
    ],
    function ($) {
        $('.qty.qty2').each(function () {
            if ($(this).next().find('form[data-role=tocart-form]').length > 0) {
                $('.qty2').css('display','none');
                $('.price-box.price-final_price').css('margin-bottom', '-1.5%');
                $('.qty2').css('margin-top','2.5%');
                $('.qty2').css('margin-bottom','2.5%');

                $('.product-item-info').hover(
                    function () {
                        $(this).find(".qty2").show();
                    },
                    function () {
                        $(this).find(".qty2").hide();
                    }
                );

                $(".qty2").change(
                    function () {
                        var productId = $(this).attr('data-product-id'),
                        input = 'qty-'+productId;
                        var op = document.getElementById(input);
                        var vl = op.options[op.selectedIndex].value;
                        $('input[value='+productId+']').closest('form').append('<input type="hidden" name="qty" class="qty" value="'+vl+'">');
                    }
                );
            }
            if ($(this).next().find('form[data-role=tocart-form]').length == 0) {
                $(this).remove();
            }
        });
    }
);