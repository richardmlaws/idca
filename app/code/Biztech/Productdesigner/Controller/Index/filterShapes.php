<?php

/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Biztech\Productdesigner\Controller\Index;

class filterShapes extends \Magento\Framework\App\Action\Action {

    /**
     * Index action
     *
     * @return $this
     */
    public function execute() {
        $params = $this->getRequest()->getParams();
        $cat_id = $params['data']['shapes_category_id'];
       
        $tags = $params['data']['search_tag_field_shape'];        
       
        $layout = $this->_objectManager->create('Magento\Framework\View\LayoutInterface');
        $resultPage = $layout->createBlock('Biztech\Productdesigner\Block\Productdesigner');
        if ($cat_id) {
            $result["images"] = $resultPage->setData(array("cat_id" => $cat_id, "tags" => $tags))->setTemplate('productdesigner/shapes/images.phtml')->toHtml();
        } else {
            $result["images"] = $resultPage->setData(array("tags" => $tags))->setTemplate('productdesigner/shapes/images.phtml')->toHtml();
        }
        if ($result["images"]) {
            $result["status"] = 'success';
        }
        $this->getResponse()->setBody(json_encode($result));
    }

}
