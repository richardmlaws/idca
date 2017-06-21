<?php
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
* @package    Bss_AddMultipleProducts
* @author     Extension Team
* @copyright  Copyright (c) 2014-2016 BSS Commerce Co. ( http://bsscommerce.com )
* @license    http://bsscommerce.com/Bss-Commerce-License.txt
*/
namespace Bss\AddMultipleProducts\Model\Config\Source;

class Total implements \Magento\Framework\Option\ArrayInterface {
    /**
     * Options getter
     *
     * @return array
     */
    public function toOptionArray() {
        return [
                ['value' => 0, 'label' => __('No')], 
                ['value' => 1, 'label' => __('Total products')], 
                ['value' => 2, 'label' => __('Total qty')]
                ];
    }

    /**
     * Get options in "key-value" format
     *
     * @return array
     */
    public function toArray() {
        return [0 => __('No'), 1 => __('Total products'), 2 => __('Total qty')];
    }
}