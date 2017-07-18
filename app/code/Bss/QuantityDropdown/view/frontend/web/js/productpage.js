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
        $('select[name=qty]').each(
            function () {
<!-- 
/**                $(this).next().find('form .box-tocart .fieldset .field.qty .control .input-text.qty').remove();
*/
-->
		$(this).next().find('form .box-tocart .fieldset .field.qty .control .input-text.qty').hide();
                $(this).next().find('form .box-tocart .fieldset .field.qty .control').prepend($(this));
            }
        );

    }
);