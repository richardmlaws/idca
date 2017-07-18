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

        $('.qty2').css('margin-bottom','2.5%');

        $('select[name=qty]').each(
            function () {
                var id = $(this).next().find('.box-tocart .input-text.qty').attr('id');
                if (id) {
                    $(this).attr('name', id);
                }
                $(this).next().children('.box-tocart').children('.fieldset').prepend($(this));
                $(this).parent().find('.input-text.qty').remove();
            }
        );
        
        $('.field.qty').each(
            function () {
                $(this).parent().prepend($(this));
            }
        );
    }
);