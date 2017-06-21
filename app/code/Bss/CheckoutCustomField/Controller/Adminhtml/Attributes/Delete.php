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
 * @package    Bss_CheckoutCustomField
 * @author     Extension Team
 * @copyright  Copyright (c) 2015-2016 BSS Commerce Co. ( http://bsscommerce.com )
 * @license    http://bsscommerce.com/Bss-Commerce-License.txt
 */
namespace Bss\CheckoutCustomField\Controller\Adminhtml\Attributes;

class Delete extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    protected $resultPageFactory;

    /**
     * @var \Bss\CheckoutCustomField\Model\Attribute
     */
    protected $model;

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Bss\CheckoutCustomField\Model\Attribute $model,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory
    ) {
        parent::__construct($context);
        $this->model = $model;
    }
    /**
     * @return \Magento\Framework\Controller\ResultInterface
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    public function execute()
    {
        $id = $this->getRequest()->getParam('id');
        /** @var $model \Bss\Catalog\CheckoutCustomField\Model\Attribute */
        if ($id) {
            $this->model->load($id);
            $resultRedirect = $this->resultRedirectFactory->create();
            $attrName = $this->model->getBackendLabel();
            if (!$this->model->getId()) {
                $this->messageManager->addError(__('This attribute no longer exists.'));
                return $resultRedirect->setPath('bss_customfield/*/');
            }
            $this->model->delete();
            $this->_eventManager->dispatch(
                    'bss_customfield_delete',
                    ['attribute'=>$this->model]
                );
            $this->messageManager->addSuccess(
                __('The attribute %1 have been deleted.', $attrName)
            );
            return $resultRedirect->setPath('bss_customfield/*/');
        }
    }
}
