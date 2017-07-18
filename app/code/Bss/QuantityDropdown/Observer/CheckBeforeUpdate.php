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
 * @category  BSS
 * @package   Bss_QuantityDropdown
 * @author    Extension Team
 * @copyright Copyright (c) 2015-2016 BSS Commerce Co. ( http://bsscommerce.com )
 * @license   http://bsscommerce.com/Bss-Commerce-License.txt
 */
namespace Bss\QuantityDropdown\Observer;

use Magento\Framework\Event\ObserverInterface;
use Bss\QuantityDropdown\Helper\Data;
use Bss\QuantityDropdown\Block\QuantityDropdown;

class CheckBeforeUpdate implements ObserverInterface
{
    protected $helper;
    protected $dropdown;

    public function __construct(
        Data $helper,
        QuantityDropdown $dropdown
    ) {

        $this->helper = $helper;
        $this->dropdown = $dropdown;
    }

    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        $quote = $observer->getCart()->getQuote();
        $defaultcustomvalue=$this->helper->getCustom();
        $defaultcustombf=explode(',', $defaultcustomvalue);
        $defaultcustom=$this->dropdown->validCustom($defaultcustombf);
        $infoDataObject = $observer->getInfo()->getData();
        $items = $quote->getAllItems();

        if ($this->helper->getEnable()) {
            foreach ($items as $item) {
                $itemId = $item->getId();
                $product = $item->getProductId();

                $quantity_value=$this->dropdown->getProductItem($product)->getData("quantity_value");

                if (!isset($infoDataObject[$itemId])) {
                    continue;
                }
                $qtyUpdate =  $infoDataObject[$itemId]['qty'];
                $cusvalue=$this->dropdown->getProductItem($product)->getData("custom_value");
                $cusbefore=explode(',', $cusvalue);
                $cus=$this->dropdown->validCustom($cusbefore);
                if ($this->helper->getDefaultValue()==2 && $quantity_value==3 || is_null($quantity_value)) {
                    $error = true;
                    foreach ($defaultcustom as $key) {
                        if ($key==$qtyUpdate || round($qtyUpdate/$key) == ($qtyUpdate/$key)) {
                            $error=false;
                        }
                    }
                    $this->dropdown->checkError($product, $error, $defaultcustom);
                }

                if ($quantity_value==2) {
                    $error = true;
                    foreach ($cus as $key) {
                        if ($key==$qtyUpdate || round($qtyUpdate/$key) == ($qtyUpdate/$key)) {
                            $error=false;
                            $abc=$qtyUpdate/$key;
                        }
                        $productname=$this->dropdown->getProductItem($product)->getName();
                        $this->dropdown->checkError($product, $error, $cus);
                    }
                }
            }
        }
    }
}
