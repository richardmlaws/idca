<?php

namespace Biztech\Productdesigner\Observer;

use Magento\Framework\Event\ObserverInterface;

class catalogProductLoadAfter implements ObserverInterface
{

    protected $_request;

    public function __construct(
        \Magento\Framework\App\Request\Http $request
    ) {

        $this->_request = $request;
    }

    public function execute(\Magento\Framework\Event\Observer $observer)
    {

        $action = $this->_request->getFullActionName();

        if ($action == 'catalog_product_view') {
            $product = $observer->getProduct();
            $product->setHasOptions(1);
        }
        if ($action == 'productdesigner_index_addtocart') {
            //$para = $this->_request()->getParams();
            $data = $this->_request->getPost();

            $used_color_count = $data['data']['used_color_count'];
            // $area_size_id = $_POST['data']['area_size_id'];
            $id            = $data['data']['productid'];
            $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
            $obj_product   = $objectManager->create('Magento\Catalog\Model\Product');
            $product       = $obj_product->load($id);

            if ($product->getData('printingmethodattr') != '') {
                if ($product->getTypeId() == 'configurable') {
                    $printingCollection = $objectManager->create('Biztech\Productdesigner\Model\Mysql4\Printingmethod\Collection')->addFieldToFilter('status', array('eq' => 1));
                    if (count($printingCollection) != 0) {
                        $prining_code     = $data['data']['printing_code'];
                        $printing_type_id = $data['data']['printing_type_id'];
                    }
                } else {
                    $simpleprintingCollection = $objectManager->create('Biztech\Productdesigner\Model\Mysql4\Simpleprintingmethod\Collection')->addFieldToFilter('status', array('eq' => 1));
                    if (count($simpleprintingCollection) != 0) {
                        $prining_code     = $data['data']['printing_code'];
                        $printing_type_id = $data['data']['printing_type_id'];
                    }
                }
            }

            $para = $data['data']['design'];

            $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
            $obj_product   = $objectManager->create('Magento\Catalog\Model\Product');
            $product       = $obj_product->load($id);
            $product_type  = $product->getTypeId();

            /* $additionalOptions = array(); */

            if (isset($prining_code)) {
                $additionalOptions[] = array(
                    'product_id'    => $id,
                    'code'          => 'printing_method',
                    'label'         => 'Printing Method',
                    'printing_code' => $prining_code,
                    'value'         => $prining_code,
                    'custom_view'   => false,
                );
            }

            if (isset($para)) {
                $additionalOptions[] = array(
                    'product_id'  => $id,
                    'code'        => 'product_design',
                    'label'       => 'Product Design',
                    'design_id'   => $para,
                    'value'       => $para,
                    'custom_view' => false,
                );
            }

            $item = $observer->getQuoteItem();

            $item->addOption(
                array(
                    'product_id' => $id,
                    'code'       => 'additional_options',
                    'label'      => 'Product Design',
                    'value'      => serialize($additionalOptions),
                )
            );
            $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
            $designModel   = $objectManager->create('Biztech\Productdesigner\Model\Mysql4\Designs\Collection')->addFieldToFilter('design_id', array('eq' => $para))->getData();
            if ($product->getTypeId() == 'configurable') {
                $groupOrderDetail = json_decode($designModel[0]['group_order_details'], true);
                if ($groupOrderDetail[0]['name']) {
                    $params = $item->getProduct()->getCustomOptions();
                    $sizeid = $objectManager->create('Magento\Eav\Model\Entity\Attribute')->loadByCode('catalog_product', 'size')->getAttributeId();
                    foreach ($params as $key => $pram) {
                        if ($key == "attributes") {
                            $designData  = $pram->getData();
                            $designdata1 = unserialize($designData['value']);
                            $size        = $designdata1[$sizeid];
                        }
                    }
                    $namesAndnumbers = '';
                    foreach ($groupOrderDetail as $value) {
                        if ($value['size'] == $size) {
                            if ($value['name'] || $value['number']) {
                                if (!$value['name']) {
                                    $name = "";
                                } else {
                                    $name = $value['name'];
                                }
                                if (!$value['number']) {
                                    $number = "";
                                } else {
                                    $number = $value['number'];
                                }
                                $namesAndnumbers .= $name . " / " . $number . "<br>";
                            }
                        }
                    }
                    if ($namesAndnumbers) {

                        $additionalOptions[] = array(
                            'product_id'  => $id,
                            'code'        => 'name_numbers',
                            'label'       => 'Names / Numbers',
                            'design_id'   => $para,
                            'value'       => $namesAndnumbers,
                            'custom_view' => false,
                        );

                        $item->addOption(
                            array(
                                'product_id' => $id,
                                'code'       => 'additional_options',
                                'label'      => 'Name & numbers',
                                'value'      => serialize($additionalOptions),
                            )
                        );
                    }
                }
            }
            $item = $observer->getEvent()->getData('quote_item');

            $product = $observer->getEvent()->getData('product');
            $item    = ($item->getParentItem() ? $item->getParentItem() : $item);

            $sub_total = json_decode($designModel[0]['prices'])->sub_total;
            $surcharge = 0;
            $same      = [];
            if ($product_type == "configurable") {
                if (isset($printing_type_id)) {
                    $objectManager     = \Magento\Framework\App\ObjectManager::getInstance();
                    $obj_printinmethod = $objectManager->create('Biztech\Productdesigner\Model\Printingmethod');
                    $printinmethod     = $obj_printinmethod->load($printing_type_id);
                    $methodtype        = $printinmethod->getColortype();
                    if ($methodtype == 1) {
                        $collection = $objectManager->create('Biztech\Productdesigner\Model\Mysql4\Colors\Collection')->addFieldToFilter('colors_counter', array('eq' => $used_color_count))->getFirstItem();
                        $surcharge  = $collection->getColorsPrice();
                    } else {
                        /* $collection = $objectManager->create('Biztech\Productdesigner\Model\Resource\Areasize\Collection')->addFieldToFilter('area_size', array('eq' => $area_size_id))->getFirstItem();
                    $surcharge = $colection->getAreaPrice(); */
                    }
                } else {
                    $surcharge = 0;
                }
            } else {
                if (isset($printing_type_id)) {
                    $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
                    $surcharge     = $objectManager->create('Biztech\Productdesigner\Model\Simpleprintingmethod')->load($printing_type_id)->getFrontSurcharge();
                } else {
                    $surcharge = 0;
                }
            }

            /*if ($item->getProductType() == 'configurable') {

                $product = \Magento\Framework\App\ObjectManager::getInstance()->create('Magento\Catalog\Model\Product')->load($item->getProductId());
                if ($product->getConfigurableGridView()) {
                    $option = $item->getOptionByCode('attributes');

                    $price = $this->_getTotalConfigurableItemsPrice($product, $product->getFinalPrice(), $option);

                    $options = $item->getBuyRequest()->getData('options');

                    $totalCustomOptionPrice = $this->_getTotalCustomOptionPrice($product, $item, $options);

                    if (isset($same[$product->getId()][$price]['total_qty'])) {
                        $same[$product->getId()][$price]['total_qty'] += $item->getQty();
                        $same[$product->getId()][$price]['skus'][] = $item->getSku();
                    } else {
                        $same[$product->getId()][$price]['total_qty'] = $item->getQty();
                        $same[$product->getId()][$price]['skus'][]    = $item->getSku();
                    }
                }
            }*/

            if ($item->getProductType() == 'configurable') {
                foreach ($same as $productId => $pId) {
                    foreach ($pId as $price => $data) {
                        if ($item->getSku() != '' && in_array($item->getSku(), $data['skus'])) {
                            $productt = \Magento\Framework\App\ObjectManager::getInstance()->create('Magento\Catalog\Model\Product')->load($productId);
                            if ($productt->getConfigurableGridView()) {
                                $tierPrices = $productt->getTierPrice();
                                if (is_array($tierPrices)) {
                                    foreach ($tierPrices as $tierPricear) {
                                        if ($data['total_qty'] >= $tierPricear['price_qty']) {
                                            $tierPrice = $tierPricear['price'];
                                        }
                                    }
                                }

                                // $tierPrice = min($tiersPrice);
                                if (isset($tierPrice)) {
                                    if ($tierPrice < $product->getFinalPrice()) {
                                        $tierPrice += $price;
                                        $item->setCustomPrice($tierPrice + $totalCustomOptionPrice + $sub_total + $surcharge);
                                        $item->setOriginalCustomPrice($tierPrice + $totalCustomOptionPrice + $sub_total + $surcharge);
                                        $item->getProduct()->setIsSuperMode(true);
                                    } else {
                                        $finalPrice = $product->getFinalPrice() + $price;

                                        $item->setCustomPrice($finalPrice + $totalCustomOptionPrice + $sub_total + $surcharge);
                                        $item->setOriginalCustomPrice($finalPrice + $totalCustomOptionPrice + $sub_total + $surcharge);
                                        $item->getProduct()->setIsSuperMode(true);
                                    }
                                }
                            }
                        }
                    }
                }

            }

            // $price = $item->getProduct()->getFinalPrice() + $sub_total + $surcharge;
            // //echo $item->getProduct()->getFinalPrice();exit;
            // $item->setCustomPrice($price);
            // $item->setOriginalCustomPrice($price);
            // $item->getProduct()->setIsSuperMode(true);
        }
    }

    protected function _getTotalCustomOptionPrice($product, $item, $options)
    {
        $totalCustomOptionPrice = 0;

        $_customOptions = $item->getProduct()->getTypeInstance(true)->getOrderOptions($item->getProduct());
        if (array_key_exists('options', $_customOptions)) {
            foreach ($_customOptions['options'] as $key => $value) {
                $product = \Magento\Framework\App\ObjectManager::getInstance()->create('Magento\Catalog\Model\Product')->load($product->getId());
                foreach ($product->getOptions() as $o) {
                    $values = $o->getValues();
                    foreach ($values as $v) {
                        if ($value['option_value'] == $v->getOptionTypeId()) {
                            if ($v->getPriceType() != 'percent') {
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
            $value       = $this->_getValueByIndex(
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
            if ($value['value_index'] == $index) {
                return $value;
            }
        }
        return false;
    }

    protected function _calcSelectionPrice($priceInfo, $productPrice)
    {
        if ($priceInfo['is_percent']) {
            $ratio = $priceInfo['pricing_value'] / 100;
            $price = $productPrice * $ratio;
        } else {
            $price = $priceInfo['pricing_value'];
        }
        return $price;
    }

}
