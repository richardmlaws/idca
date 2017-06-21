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
namespace Bss\CheckoutCustomField\Block\Adminhtml;

use Magento\Framework\View\Element\Template\Context;
use Magento\Framework\Api\ExtensibleDataObjectConverter;
use Magento\Framework\Data\Form\Element\AbstractElement;
use Magento\Framework\Pricing\PriceCurrencyInterface;

class CustomField extends \Magento\Sales\Block\Adminhtml\Order\Create\Form\AbstractForm
{
	protected $attribute;

    protected $attributeOptions;

    protected $helper;

    /**
     * Metadata form factory
     *
     * @var \Magento\Customer\Model\Metadata\FormFactory
     */
    protected $_metadataFormFactory;

    /**
     * Customer repository
     *
     * @var \Magento\Customer\Api\CustomerRepositoryInterface
     */
    protected $customerRepository;

    /**
     * @var \Magento\Framework\Api\ExtensibleDataObjectConverter
     */
    protected $_extensibleDataObjectConverter;

    /**
     * @param \Magento\Backend\Block\Template\Context $context
     * @param \Magento\Backend\Model\Session\Quote $sessionQuote
     * @param \Magento\Sales\Model\AdminOrder\Create $orderCreate
     * @param PriceCurrencyInterface $priceCurrency
     * @param \Magento\Framework\Data\FormFactory $formFactory
     * @param \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor
     * @param \Magento\Customer\Model\Metadata\FormFactory $metadataFormFactory
     * @param \Magento\Customer\Api\CustomerRepositoryInterface $customerRepository
     * @param ExtensibleDataObjectConverter $extensibleDataObjectConverter
     * @param array $data
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Backend\Model\Session\Quote $sessionQuote,
        \Magento\Sales\Model\AdminOrder\Create $orderCreate,
        PriceCurrencyInterface $priceCurrency,
        \Magento\Framework\Data\FormFactory $formFactory,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Bss\CheckoutCustomField\Helper\Data $helper,
        \Bss\CheckoutCustomField\Model\Attribute $attribute,
        \Bss\CheckoutCustomField\Model\AttributeOption $attributeOption,
        array $data = []
    ) {
    	$this->helper = $helper;
    	$this->attribute = $attribute;
    	$this->attributeOption = $attributeOption;
        parent::__construct(
            $context,
            $sessionQuote,
            $orderCreate,
            $priceCurrency,
            $formFactory,
            $dataObjectProcessor,
            $data
        );
    }

    /**
     * Return header text
     *
     * @return \Magento\Framework\Phrase
     */
    public function getHeaderText()
    {
        return __('Checkout CustomField');
    }

    /**
     * Prepare Form and add elements to form
     *
     * @return $this
     */
    protected function _prepareForm()
    {
    	$fieldset = $this->_form->addFieldset(
            'advanced_fieldset',
            ['legend' => '', 'collapsable' => false]
        );

    	$types = [
            'text' => 'text',
            'textarea' => 'textarea',
            'select' => 'select',
            'boolean' => 'select',
            'multiselect' => 'multiselect',
            'date' => 'date'
        ];

    	$attributes = $this->attribute->getCustomFieldCreateOrder();
    	$dateFormat = $this->_localeDate->getDateFormat(\IntlDateFormatter::SHORT);
    	foreach ($attributes as $attribute) {
    		$validateClass = $attribute->getFrontendClass();
    		$required = false;
    		if($attribute->getIsRequired() == 1)
    		{
    			$required = true;
    		}
            if ($attribute->getFrontendInput() == 'boolean') {
                $options = [
                    ['value' => '0', 'label' => 'No'],
                    ['value' => '1', 'label' => 'Yes']
                ];
            } else {
                $options = $this->attributeOption->getAttributeOptions($attribute->getAttributeId());
            }

	        $fieldset->addField(
	            $attribute->getAttributeCode(),
	            $types[$attribute->getFrontendInput()],
	            [
	                'name' => 'bss_customField[' . $attribute->getAttributeCode() . ']',
	                'label' => $attribute->getBackendLabel(),
	                'title' => $attribute->getBackendLabel(),
                	'value' => $attribute->getDefaultValue(),
                	'values' => $options,
                	'required' => $required,
                	'date_format' => $dateFormat,
                	'class' => $validateClass
	            ]
	        );
	    }
        
        $this->_form->setValues($this->getFormValues());
        $this->setForm($this->_form);
        return $this;
    }

    /**
     * Return Form Elements values
     *
     * @return array
     */
    public function getFormValues()
    {
        $attributes = $this->attribute->getCustomFieldChekout();
        $data = [];
		foreach ($attributes as $attribute) {
    		if ($attribute->getFrontendInput() == 'select' || $attribute->getFrontendInput() == 'multiselect') {
                $default = $this->attributeOption->getOptions($attribute->getAttributeId());
                $default = $this->attributeOption->getDefaultValue($default[0]);
    		} else {
                $default = $attribute->getDefaultValue();
            }
            $data[$attribute->getAttributeCode()] = $default;
    	}
        return $data;
    }
}
