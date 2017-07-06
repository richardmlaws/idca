<?php

namespace Biztech\Productdesigner\Observer;

use Magento\Framework\Event\ObserverInterface;

class catalogProductLoadAfter implements ObserverInterface {

    protected $_request;

    public function __construct(
    \Magento\Framework\App\Request\Http $request
    ) {

        $this->_request = $request;
    }

    public function execute(\Magento\Framework\Event\Observer $observer) {


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
            $id = $data['data']['productid'];
            $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
            $obj_product = $objectManager->create('Magento\Catalog\Model\Product');
            $product = $obj_product->load($id);


            if ($product->getTypeId() == 'configurable') {
                $printingCollection = $objectManager->create('Biztech\Productdesigner\Model\Mysql4\Printingmethod\Collection')->addFieldToFilter('status', array('eq' => 1));
                if (count($printingCollection) != 0) {
                    $prining_code = $data['data']['printing_code'];
                    $printing_type_id = $data['data']['printing_type_id'];
                }
            } else {
                $simpleprintingCollection = $objectManager->create('Biztech\Productdesigner\Model\Mysql4\Simpleprintingmethod\Collection')->addFieldToFilter('status', array('eq' => 1));
                if (count($simpleprintingCollection) != 0) {
                    $prining_code = $data['data']['printing_code'];
                    $printing_type_id = $data['data']['printing_type_id'];
                }
            }




            $para = $data['data']['design'];


            $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
            $obj_product = $objectManager->create('Magento\Catalog\Model\Product');
            $product = $obj_product->load($id);
            $product_type = $product->getTypeId();

            /* $additionalOptions = array(); */

            if (isset($prining_code)) {
                $additionalOptions[] = array(
                    'product_id' => $id,
                    'code' => 'printing_method',
                    'label' => 'Printing Method',
                    'printing_code' => $prining_code,
                    'value' => $prining_code,
                    'custom_view' => false,
                );
            }

            if (isset($para)) {
                $additionalOptions[] = array(
                    'product_id' => $id,
                    'code' => 'product_design',
                    'label' => 'Product Design',
                    'design_id' => $para,
                    'value' => $para,
                    'custom_view' => false,
                );
            }



            $item = $observer->getQuoteItem();

            $item->addOption(
                    array(
                        'product_id' => $id,
                        'code' => 'additional_options',
                        'label' => 'Product Design',
                        'value' => serialize($additionalOptions),
                    )
            );
            $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
            $designModel = $objectManager->create('Biztech\Productdesigner\Model\Mysql4\Designs\Collection')->addFieldToFilter('design_id', array('eq' => $para))->getData();
            if ($product->getTypeId() == 'configurable') {
                $groupOrderDetail = json_decode($designModel[0]['group_order_details'], true);
                if ($groupOrderDetail[0]['name']) {
                    $params = $item->getProduct()->getCustomOptions();
                    $sizeid = $objectManager->create('Magento\Eav\Model\Entity\Attribute')->loadByCode('catalog_product', 'size')->getAttributeId();
                    foreach ($params as $key => $pram) {
                        if ($key == "attributes") {
                            $designData = $pram->getData();
                            $designdata1 = unserialize($designData['value']);
                            $size = $designdata1[$sizeid];
                        }
                    }
                    $namesAndnumbers = '';
                    foreach ($groupOrderDetail as $value) {
                        if ($value['size'] == $size) {
                            if($value['name'] || $value['number']){
                                if(!$value['name']){
                                    $name = "";
                                }else{
                                     $name = $value['name'];
                                }
                                if(!$value['number']){
                                    $number = "";
                                }else{
                                    $number = $value['number'];
                                }
                                $namesAndnumbers .= $name . " / " . $number . "<br>";
                            }
                        }
                    }
                    if ($namesAndnumbers) {

                        $additionalOptions[] = array(
                            'product_id' => $id,
                            'code' => 'name_numbers',
                            'label' => 'Names / Numbers',
                            'design_id' => $para,
                            'value' => $namesAndnumbers,
                            'custom_view' => false,
                        );

                        $item->addOption(
                                array(
                                    'product_id' => $id,
                                    'code' => 'additional_options',
                                    'label' => 'Name & numbers',
                                    'value' => serialize($additionalOptions),
                                )
                        );
                    }
                }
            }
            $item = $observer->getEvent()->getData('quote_item');

            $product = $observer->getEvent()->getData('product');
            $item = ( $item->getParentItem() ? $item->getParentItem() : $item );


            $sub_total = json_decode($designModel[0]['prices'])->sub_total;
            $surcharge = 0;
            if ($product_type == "configurable") {
                if (isset($printing_type_id)) {
                    $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
                    $obj_printinmethod = $objectManager->create('Biztech\Productdesigner\Model\Printingmethod');
                    $printinmethod = $obj_printinmethod->load($printing_type_id);
                    $methodtype = $printinmethod->getColortype();
                    if ($methodtype == 1) {
                        $collection = $objectManager->create('Biztech\Productdesigner\Model\Mysql4\Colors\Collection')->addFieldToFilter('colors_counter', array('eq' => $used_color_count))->getFirstItem();
                        $surcharge = $collection->getColorsPrice();
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
                    $surcharge = $objectManager->create('Biztech\Productdesigner\Model\Simpleprintingmethod')->load($printing_type_id)->getFrontSurcharge();
                } else {
                    $surcharge = 0;
                }
            }


            $price = $item->getProduct()->getFinalPrice() + $sub_total + $surcharge;
            $item->setCustomPrice($price);
            $item->setOriginalCustomPrice($price);
            $item->getProduct()->setIsSuperMode(true);
        }
    }

}
