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
namespace Bss\CheckoutCustomField\Block\Plugin\Checkout;

use Magento\Framework\Json\Helper\Data as JsonHelper;

class LayoutProcessorPlugin
{
    protected $storeManager;

    protected $attribute;

    protected $attributeOptions;

    protected $jsonHelper;

    protected $helper;

    protected $customerSession;

    const DISPLAY_SHIPPING_ADDRESS = 0;
    const DISPLAY_REVIEW_PAYMENT = 1;

    public function __construct(
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Bss\CheckoutCustomField\Model\Attribute $attribute,
        \Bss\CheckoutCustomField\Model\AttributeOption $attributeOption,
        \Bss\CheckoutCustomField\Helper\Data $helper,
        \Magento\Customer\Model\Session $customerSession,
        JsonHelper $jsonHelper
    ) {
        $this->storeManager = $storeManager;
        $this->attribute = $attribute;
        $this->attributeOption = $attributeOption;
        $this->helper = $helper;
        $this->customerSession = $customerSession;
        $this->jsonHelper = $jsonHelper;
    }

    public function afterProcess(
        \Magento\Checkout\Block\Checkout\LayoutProcessor $subject,
        array $jsLayout
    ) {
        if(!$this->helper->moduleEnabled())
        {
            return $jsLayout;
        }
        $attributes = $this->attribute->getCustomFieldChekout();
        $types = [
            'text' => 'Magento_Ui/js/form/element/abstract',
            'textarea' => 'Magento_Ui/js/form/element/textarea',
            'select' => 'Magento_Ui/js/form/element/select',
            'boolean' => 'Magento_Ui/js/form/element/select',
            'multiselect' => 'Bss_CheckoutCustomField/js/form/element/checkboxes',
            'date' => 'Magento_Ui/js/form/element/date'
        ];
        $elementTmpl = [
            'text' => 'ui/form/element/input',
            'textarea' => 'ui/form/element/textarea',
            'select' => 'Bss_CheckoutCustomField/form/element/radio',
            'boolean' => 'ui/form/element/select',
            'multiselect' => 'Bss_CheckoutCustomField/form/element/checkboxes',
            'date' => 'ui/form/element/date'
        ];
        foreach ($attributes as $attribute) {
            $storeId = $this->storeManager->getStore()->getId();
            $stores = explode(',', $attribute->getStoreId());
            if(!in_array($storeId, $stores))
                continue;
            $labels = $this->jsonHelper->jsonDecode($attribute->getFrontendLabel());
            $label = !empty($labels[$storeId]) ? $labels[$storeId] : $labels[0];
            $validation = [];
            if($attribute->getIsRequired() == 1)
            {
                if($attribute->getFrontendInput() == 'multiselect'){
                    $validation['validate-one-required'] = true;
                    $validation['required-entry'] = true;
                }else{
                    $validation['required-entry'] = true;
                }                
            }
            $validation[$attribute->getFrontendClass()] = true;

            $options = $this->getOptions($attribute);

            if ($attribute->getFrontendInput() == 'select' || $attribute->getFrontendInput() == 'multiselect') {
                $default = $this->attributeOption->getOptions($attribute->getAttributeId());
                $default = $this->attributeOption->getDefaultValue($default[0]);
            } else {
                $default = $attribute->getDefaultValue();
            }
            
            if ($attribute->getShowInShipping() == self::DISPLAY_SHIPPING_ADDRESS) {
                if(!$this->customerSession->isLoggedIn()) {
                    $jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']
                    ['shippingAddress']['children']['shipping-address-fieldset']['children'][$attribute->getAttributeCode()] = [
                        'component' => $types[$attribute->getFrontendInput()],
                        'config' => [
                            'customScope' => 'shippingAddress',
                            'template' => 'ui/form/field',
                            'elementTmpl' => $elementTmpl[$attribute->getFrontendInput()],
                            'id' => $attribute->getAttributeCode(),
                            'rows' => 5
                        ],
                        'dataScope' => 'shippingAddress.bss_custom_field['.$attribute->getAttributeCode().']',
                        'label' => $label,
                        'options' => $options,
                        'caption' => 'Please select',
                        'provider' => 'checkoutProvider',
                        'visible' => true,
                        'validation' => $validation,
                        'sortOrder' => $attribute->getSortOrder() + 200,
                        'id' => 'bss_custom_field['.$attribute->getAttributeCode().']',
                        'default' => $default,
                    ];
                }else{
                    $jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']
                    ['shippingAddress']['children']['before-form']['children']['before-form-child']['children'][$attribute->getAttributeCode()] = [
                        'component' => $types[$attribute->getFrontendInput()],
                        'config' => [
                            'customScope' => 'shippingAddressLogin',
                            'template' => 'ui/form/field',
                            'elementTmpl' => $elementTmpl[$attribute->getFrontendInput()],
                            'id' => $attribute->getAttributeCode(),
                            'rows' => 5
                        ],
                        'dataScope' => 'shippingAddressLogin.bss_custom_field['.$attribute->getAttributeCode().']',
                        'label' => $label,
                        'options' => $options,
                        'caption' => 'Please select',
                        'provider' => 'checkoutProvider',
                        'visible' => true,
                        'validation' => $validation,
                        'sortOrder' => $attribute->getSortOrder() + 200,
                        'id' => 'bss_custom_field['.$attribute->getAttributeCode().']',
                        'default' => $default,
                    ];
                }
            }

            //show in payment & review
            if ($attribute->getShowInShipping() == self::DISPLAY_REVIEW_PAYMENT) {
                $jsLayout['components']['checkout']['children']['steps']['children']['billing-step']['children']
                    ['payment']['children']['beforeMethods']['children'][$attribute->getAttributeCode()] = [
                        'component' => $types[$attribute->getFrontendInput()],
                        'config' => [
                            'customScope' => 'paymentBeforemethods',
                            'template' => 'ui/form/field',
                            'elementTmpl' => $elementTmpl[$attribute->getFrontendInput()],
                            'id' => $attribute->getAttributeCode()
                        ],
                        'options' => $options,
                        'caption' => 'Please select',
                        'dataScope' => 'paymentBeforemethods.bss_custom_field['.$attribute->getAttributeCode().']',
                        'label' => $label,
                        'provider' => 'checkoutProvider',
                        'visible' => true,
                        'validation' => $validation,
                        'sortOrder' => $attribute->getSortOrder() + 200,
                        'id' => 'bss_custom_field['.$attribute->getAttributeCode().']',
                        'default' => $default,
                    ];
            }
        }
        return $jsLayout;
    }

    protected function getOptions($attribute)
    {
        if ($attribute->getFrontendInput() == 'date') {
            $options = [
                'dateFormat' => 'm/d/Y',
                "timeFormat" => 'hh:mm',
                "showsTime" => true
            ];
        } elseif ($attribute->getFrontendInput() == 'boolean') {
            $options = [
                ['value' => '0', 'label' => 'No'],
                ['value' => '1', 'label' => 'Yes']
            ];
        } else {
            $options = $this->attributeOption->getAttributeOptions($attribute->getAttributeId());
        }

        return $options;
    }
}
