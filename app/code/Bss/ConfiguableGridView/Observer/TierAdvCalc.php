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
 * @package    Bss_ReorderProduct
 * @author     Extension Team
 * @copyright  Copyright (c) 2015-2016 BSS Commerce Co. ( http://bsscommerce.com )
 * @license    http://bsscommerce.com/Bss-Commerce-License.txt
 */
namespace Bss\ConfiguableGridView\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\App\RequestInterface;

class TierAdvCalc implements ObserverInterface
{

  public function execute(Observer $observer)
    {       
            $same  = [];
            $quote = \Magento\Framework\App\ObjectManager::getInstance()->create('Magento\Checkout\Model\Cart')->getQuote();
            foreach ($quote->getAllVisibleItems() as $item) {
                if($item->getProductType() == 'configurable') {

                    $product = \Magento\Framework\App\ObjectManager::getInstance()->create('Magento\Catalog\Model\Product')->load($item->getProductId());
                    if ($product->getConfigurableGridView()) {
                        $option = $item->getOptionByCode('attributes');

                        $price = $this->_getTotalConfigurableItemsPrice($product, $product->getFinalPrice(), $option);

                        $options = $item->getBuyRequest()->getData('options');
                        
                        $totalCustomOptionPrice = $this->_getTotalCustomOptionPrice($product,$item,$options);


                        if(isset($same[$product->getId()][$price]['total_qty'])) {
                            $same[$product->getId()][$price]['total_qty'] += $item->getQty();
                            $same[$product->getId()][$price]['skus'][] = $item->getSku();
                        } else {
                            $same[$product->getId()][$price]['total_qty'] = $item->getQty();
                            $same[$product->getId()][$price]['skus'][] = $item->getSku();
                        }
                    }
                }
            }
     
            foreach ($quote->getAllVisibleItems() as $item) {
                if($item->getProductType() == 'configurable') {
                    foreach ($same as $productId => $pId) {
                        foreach ($pId as $price => $data) {
                            if($item->getSku() != '' && in_array($item->getSku(), $data['skus'])) {
                                $productt = \Magento\Framework\App\ObjectManager::getInstance()->create('Magento\Catalog\Model\Product')->load($productId);
                                if ($productt->getConfigurableGridView()) {
                                    $tierPrices = $productt->getTierPrice();
                                    if (is_array($tierPrices)) {
                                        foreach ($tierPrices as $tierPricear) {
                                            if ($data['total_qty'] >= $tierPricear['price_qty']){
                                                $tierPrice = $tierPricear['price'];
                                           }
                                        }
                                    }

                                    // $tierPrice = min($tiersPrice);
                                    if (isset($tierPrice)) {
                                        if($tierPrice < $product->getFinalPrice()) {
                                            $tierPrice += $price;
                                            $item->setCustomPrice($tierPrice + $totalCustomOptionPrice);
                                            $item->setOriginalCustomPrice($tierPrice + $totalCustomOptionPrice);
                                            $item->getProduct()->setIsSuperMode(true);
                                        } else {
                                            $finalPrice = $product->getFinalPrice() + $price;

                                            $item->setCustomPrice($finalPrice + $totalCustomOptionPrice);
                                            $item->setOriginalCustomPrice($finalPrice + $totalCustomOptionPrice);
                                            $item->getProduct()->setIsSuperMode(true);
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
            }

    }

    protected function _getTotalCustomOptionPrice($product,$item,$options)
    {
        $totalCustomOptionPrice = 0;

        $_customOptions = $item->getProduct()->getTypeInstance(true)->getOrderOptions($item->getProduct()); 
        if(array_key_exists('options', $_customOptions)){
            foreach($_customOptions['options'] as  $key => $value){
                $product = \Magento\Framework\App\ObjectManager::getInstance()->create('Magento\Catalog\Model\Product')->load($product->getId());
                foreach ($product->getOptions() as $o) {
                    $values = $o->getValues();
                        foreach ($values as $v) {
                            if ($value['option_value'] == $v->getOptionTypeId()) {
                                if($v->getPriceType() != 'percent') {
                                    $totalCustomOptionPrice += $v->getprice();
                                } 
                            }
                        }
                }
            }
        }
        return $totalCustomOptionPrice;
    }

    protected function _getTotalConfigurableItemsPrice($product, $finalPrice, $selectedAttributes)
    {
        $price = 0.0;

        $product->getTypeInstance(true)
                ->setStoreFilter($product->getStore(), $product);
        $attributes = $product->getTypeInstance(true)
                ->getConfigurableAttributes($product);

                
        $selectedAttributes = unserialize($selectedAttributes->getValue());

        foreach ($attributes as $attribute) {
            $attributeId = $attribute->getProductAttribute()->getId();
            $value = $this->_getValueByIndex(
                $attribute->getPrices() ? $attribute->getPrices() : array(),
                isset($selectedAttributes[$attributeId]) ? $selectedAttributes[$attributeId] : null
            );
            $product->setParentId(true);
            if ($value) {
                if ($value['pricing_value'] != 0) {
                    $product->setConfigurablePrice($this->_calcSelectionPrice($value, $finalPrice));
                    $price += $product->getConfigurablePrice();
                }
            }
        }
        return $price;
    }

    protected function _getValueByIndex($values, $index)
    {
        foreach ($values as $value) {
            if($value['value_index'] == $index) {
                return $value;
            }
        }
        return false;
    }

    protected function _calcSelectionPrice($priceInfo, $productPrice)
    {
        if($priceInfo['is_percent']) {
            $ratio = $priceInfo['pricing_value']/100;
            $price = $productPrice * $ratio;
        } else {
            $price = $priceInfo['pricing_value'];
        }
        return $price;
    }

}