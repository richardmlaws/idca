<?php

/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Biztech\Productdesigner\Controller\Index;

class getmydesign extends \Magento\Framework\App\Action\Action {

    protected $image;

    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Catalog\Helper\Image $image
        ) {
        parent::__construct($context);
        $this->image = $image;
    }

    /**
     * Index action
     *
     * @return $this
     */
    public function execute() {

        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $session = $objectManager->get('Magento\Customer\Model\Session');
        $customerData = $session->getCustomer();
        $customer_id = $customerData->getId();
         $product_id = $this->getRequest()->getParam("product_id");
        $resultPage = $objectManager->create('Magento\Framework\View\LayoutInterface');
        $layout = $resultPage->createBlock('Biztech\Productdesigner\Block\Productdesigner');
        $obj_product = $objectManager->create('Magento\Catalog\Model\Product');
        $product = $obj_product->load($product_id);
        if($product->getEnableWristband()){
            $result["designs"] = $layout->setData(array("customer_id" => $customer_id))->setTemplate('productdesigner/mydesigns/list_band.phtml')->toHtml();
        } else {
            $result["designs"] = $layout->setData(array("customer_id" => $customer_id))->setTemplate('productdesigner/mydesigns/list.phtml')->toHtml();    
        }
       // $result["designs"] = $layout->setData(array("customer_id" => $customer_id))->setTemplate('productdesigner/mydesigns/list.phtml')->toHtml();

        $this->getResponse()->setBody(json_encode($result));
    }

}
