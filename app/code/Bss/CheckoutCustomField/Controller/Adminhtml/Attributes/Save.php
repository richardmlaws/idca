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

use Magento\Framework\Exception\AlreadyExistsException;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\Json\Helper\Data as JsonHelper;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class Save extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Framework\View\LayoutFactory
     */
    private $layoutFactory;

    /**
     * @var \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype\ValidatorFactory
     */
    protected $validatorFactory;

    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    protected $resultPageFactory;

    /**
     * @var \Magento\Framework\Registry
     */
    protected $resigtry;

    /**
     * @var \Magento\Framework\Json\Helper\Data $jsonHelper
     */
    protected $jsonHelper;

    /**
     * @var \Bss\CheckoutCustomField\Model\Attribute
     */
    protected $model;

    /**
     * @var \Magento\Catalog\Model\Product\Url
     */
    protected $catalogUrl;

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype\ValidatorFactory $validatorFactory,
        \Magento\Framework\View\LayoutFactory $layoutFactory,
        JsonHelper $jsonHelper,
        \Bss\CheckoutCustomField\Model\Attribute $model,
        \Magento\Catalog\Model\Product\Url $catalogUrl, 
        \Magento\Framework\Registry $resigtry
    ) {
        parent::__construct($context);
        $this->resultPageFactory = $resultPageFactory;
        $this->validatorFactory = $validatorFactory;
        $this->layoutFactory = $layoutFactory;
        $this->resigtry = $resigtry;
        $this->model = $model;
        $this->catalogUrl = $catalogUrl;
        $this->jsonHelper = $jsonHelper;
    }

    public function execute()
    {
        $data = $this->getRequest()->getPostValue();
        if (isset($data['option'])) {
            if (isset($data['default'])) {
                $this->resigtry->register('attribute_option_default', $data['default']);
            }
            $this->resigtry->register('attribute_option', $data['option']);
        }
        $attributeId = $this->getRequest()->getParam('attribute_id');
        $attributeCode = $this->getRequest()->getParam('attribute_code') ?: $this->generateCode($this->getRequest()->getParam('frontend_label')[0]);
        $strlen = strlen($attributeCode);
        if ($strlen > 0) {
            $validatorAttrCode = new \Zend_Validate_Regex(['pattern' => '/^[a-z][a-z_0-9]{0,30}$/']);
            if (!$validatorAttrCode->isValid($attributeCode)) {
                $this->messageManager->addError(
                    __(
                        'Attribute code "%1" is invalid. Please use only letters (a-z), ' .
                        'numbers (0-9) or underscore(_) in this field, first character should be a letter.',
                        $attributeCode
                    )
                );
                return $this->returnResult(
                    'bss_customfield/*/edit',
                    ['attribute_id' => $attributeId, '_current' => true],
                    ['error' => true]
                );
            }
        }
        $data['attribute_code'] = $attributeCode;

        //validate frontend_input
        if (isset($data['frontend_input'])) {
            /** @var $inputType \Magento\Eav\Model\Adminhtml\System\Config\Source\Inputtype\Validator */
            $inputType = $this->validatorFactory->create();
            if (!$inputType->isValid($data['frontend_input'])) {
                foreach ($inputType->getMessages() as $message) {
                    $this->messageManager->addError($message);
                }
                return $this->returnResult(
                    'catalog/*/edit',
                    ['attribute_id' => $attributeId, '_current' => true],
                    ['error' => true]
                );
            }
        }

        if ($attributeId) {
            $this->model->load($attributeId);
            if (!$this->model->getId()) {
                $this->messageManager->addError(__('This attribute no longer exists.'));
                return $this->returnResult('bss_customfield/*/', [], ['error' => true]);
            }

            $data['attribute_code'] = $this->model->getAttributeCode();
            $data['frontend_input'] = $this->model->getFrontendInput();
        }
        $data['store_id'] = implode(',', $data['store_id']);
        $label = $this->getRequest()->getParam('frontend_label');
        $data['backend_label'] = $label[0];
        $data['frontend_label'] = $this->jsonHelper->jsonEncode($label);
        $defaultValueField = $this->model->getDefaultValueByInput($data['frontend_input']);
        
        if ($defaultValueField) {
            $data['default_value'] = $this->getRequest()->getParam($defaultValueField);
        }
        $this->model->setData($data);
        if (isset($data['id'])) {
            $this->model->setId($data['id']);
        }
        try {
            $this->model->save();
            $this->_eventManager->dispatch(
                'bss_customfield_create',
                ['attribute'=>$this->model]
            );
            $this->messageManager->addSuccess(__('You saved the checkout attribute.'));
            if($this->getRequest()->getParam('back', false))
            {
                return $this->returnResult(
                    'bss_customfield/*/edit',
                    ['attribute_id' => $this->model->getId(), '_current' => true],
                    ['error' => false]
                );
            }
        } catch (\Exception $e) {
            $this->messageManager->addError($e->getMessage());
            $this->_session->setAttributeData($data);
            return $this->returnResult(
                'bss_customfield/*/edit',
                ['id' => $attributeId, '_current' => true],
                ['error' => true]
            );
        }
        return $this->returnResult('bss_customfield/*/', [], ['error' => true]);
    }

    /**
     * @param string $path
     * @param array $params
     * @param array $response
     * @return \Magento\Framework\Controller\Result\Json|\Magento\Backend\Model\View\Result\Redirect
     */
    private function returnResult($path = '', array $params = [], array $response = [])
    {
        if ($this->isAjax()) {
            $layout = $this->layoutFactory->create();
            $layout->initMessages();

            $response['messages'] = [$layout->getMessagesBlock()->getGroupedHtml()];
            $response['params'] = $params;
            return $this->resultFactory->create(ResultFactory::TYPE_JSON)->setData($response);
        }
        return $this->resultFactory->create(ResultFactory::TYPE_REDIRECT)->setPath($path, $params);
    }

    /**
     * Define whether request is Ajax
     *
     * @return boolean
     */
    private function isAjax()
    {
        return $this->getRequest()->getParam('isAjax');
    }

    /**
     * Generate code from label
     *
     * @param string $label
     * @return string
     */
    protected function generateCode($label)
    {
        $code = substr(
            preg_replace(
                '/[^a-z_0-9]/',
                '_',
                $this->catalogUrl->formatUrlKey($label)
            ),
            0,
            30
        );
        $validatorAttrCode = new \Zend_Validate_Regex(['pattern' => '/^[a-z][a-z_0-9]{0,29}[a-z0-9]$/']);
        if (!$validatorAttrCode->isValid($code)) {
            $code = 'attr_' . ($code ?: substr(md5(time()), 0, 8));
        }
        return $code;
    }
}
