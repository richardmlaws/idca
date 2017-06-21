<?php
/**
 * ITORIS
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the ITORIS's Magento Extensions License Agreement
 * which is available through the world-wide-web at this URL:
 * http://www.itoris.com/magento-extensions-license.html
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to sales@itoris.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade the extensions to newer
 * versions in the future. If you wish to customize the extension for your
 * needs please refer to the license agreement or contact sales@itoris.com for more information.
 *
 * @category   ITORIS
 * @package    ITORIS_M2_DYNAMIC_PRODUCT_OPTIONS
 * @copyright  Copyright (c) 2016 ITORIS INC. (http://www.itoris.com)
 * @license    http://www.itoris.com/magento-extensions-license.html  Commercial License
 */

namespace Itoris\DynamicProductOptions\Controller\Adminhtml\Product\Options\Template;

class Save extends \Itoris\DynamicProductOptions\Controller\Adminhtml\Product\Options\Template
{
    /**
     * @return mixed
     */
    public function execute()
    {
        try {
            $data = $this->getRequest()->getParam('template', []);
            /** @var $template \Itoris\DynamicProductOptions\Model\Template */
            $template = $this->_objectManager->create('Itoris\DynamicProductOptions\Model\Template');
            $template->load($this->getRequest()->getParam('id'));
            if (isset($data['name']) && $data['name']) {
                $template->setName($data['name']);
                $templateData = $this->getRequest()->getParam('itoris_dynamicproductoptions');
                if (is_array($templateData)) {
                    $template->addData($templateData);
                }
                $template->save();
                $this->messageManager->addSuccess(__('Template has been saved'));
            } else {
                $this->messageManager->addError(__('Template name is required'));
            }
        } catch (\Exception $e) {
            $this->messageManager->addError(__('Template has not been saved'));
        }

        if ($this->getRequest()->getParam('back')) {
            $this->_redirect('*/*/edit', ['id' => $template->getId()]);
        } else {
            $this->_redirect('*/*/');
        }
    }
}