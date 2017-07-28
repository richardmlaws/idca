<?php

/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Biztech\Productdesigner\Controller\Index;

class getTierPrice extends \Magento\Framework\App\Action\Action {

    protected $image;
    protected $request;

    public function __construct(
    \Magento\Framework\App\Action\Context $context,
            \Magento\Catalog\Helper\Image $image , \Magento\Framework\App\Request\Http $request
    ) {
        parent::__construct($context);
        $this->image = $image;
        $this->request = $request;
    }

    /**
     * Index action
     *
     * @return $this
     */
    public function execute() {

        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $session = $objectManager->get('Magento\Customer\Model\Session');
        // $customerData = $session->getCustomer();
        // $customer_id = $customerData->getId();
        $color_id = $this->request->getParam("color_id");
        $resultPage = $objectManager->create('Magento\Framework\View\LayoutInterface');
        $layout = $resultPage->createBlock('Biztech\Productdesigner\Block\Productdesigner');

        $result["price"] = $layout->setData(array("color_id" => $color_id))->setTemplate('productdesigner/addtocart/writstband_addtocart.phtml')->toHtml(); 

        $this->getResponse()->setBody(json_encode($result));
    }

}
