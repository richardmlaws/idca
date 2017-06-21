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

namespace Bss\CheckoutCustomField\Model;

use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Api\AttributeValueFactory;
use Magento\Framework\Json\Helper\Data as JsonHelper;
use Bss\CheckoutCustomField\Api\Data\AttributeInterface;

class Attribute extends \Magento\Eav\Model\Entity\Attribute\AbstractAttribute implements AttributeInterface
{
    /**
     * @var \Magento\Framework\Json\Helper\Data $jsonHelper
     */
    protected $jsonHelper;

    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\Api\ExtensionAttributesFactory $extensionFactory,
        AttributeValueFactory $customAttributeFactory,
        \Magento\Eav\Model\Config $eavConfig,
        \Magento\Eav\Model\Entity\TypeFactory $eavTypeFactory,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Eav\Model\ResourceModel\Helper $resourceHelper,
        \Magento\Framework\Validator\UniversalFactory $universalFactory,
        \Magento\Eav\Api\Data\AttributeOptionInterfaceFactory $optionDataFactory,
        \Magento\Framework\Reflection\DataObjectProcessor $dataObjectProcessor,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        JsonHelper $jsonHelper,
        array $data = []
    ) {
        $this->jsonHelper = $jsonHelper;
        parent::__construct(
            $context,
            $registry,
            $extensionFactory,
            $customAttributeFactory,
            $eavConfig,
            $eavTypeFactory,
            $storeManager,
            $resourceHelper,
            $universalFactory,
            $optionDataFactory,
            $dataObjectProcessor,
            $dataObjectHelper
        );
    }
    /**
     * Initialize resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('Bss\CheckoutCustomField\Model\ResourceModel\Attribute');
    }

    protected $_cacheTag = 'bss_checkout_attribute';
 
    /**
     * Prefix of model events names.
     *
     * @var string
     */
    protected $_eventPrefix = 'bss_checkout_attribute';

    /**
     * Get ATTRIBUTE ID.
     *
     * @return int
     */
    public function getAttributeId()
    {
        return $this->getData(self::BSS_ATTRIBUTE_ID);
    }
 
    /**
     * Set ATTRIBUTE ID.
     */
    public function setAttributeId($attributeId)
    {
        return $this->setData(self::BSS_ATTRIBUTE_ID, $attributeId);
    }
 
    /**
     * Get ATTRIBUTE CODE.
     *
     * @return varchar
     */
    public function getAttributeCode()
    {
        return $this->getData(self::BSS_ATTRIBUTE_CODE);
    }
 
    /**
     * Set ATTRIBUTE CODE.
     */
    public function setAttributeCode($attributeCode)
    {
        return $this->setData(self::BSS_ATTRIBUTE_CODE, $attributeCode);
    }
 
    /**
     * Get BACKEND LABEL.
     *
     * @return varchar
     */
    public function getBackendLabel()
    {
        return $this->getData(self::BSS_BACKEND_LABEL);
    }
 
    /**
     * Set BACKEND LABEL.
     */
    public function setBackendLabel($backendLabel)
    {
        return $this->setData(self::BSS_BACKEND_LABEL, $backendLabel);
    }

    /**
     * Get FRONTEND LABEL.
     *
     * @return varchar
     */
    public function getFrontendLabel($storeId = null)
    {
        if(!$this->getData(self::BSS_FRONTEND_LABEL))
            return;
        $label = $this->jsonHelper->jsonDecode($this->getData(self::BSS_FRONTEND_LABEL));
        if($storeId = null)
        {
            $storeId = 0;
        }

        return isset($label[$storeId]) ? $label[$storeId] : $label[0];
    }
 
    /**
     * Set FRONTEND LABEL.
     */
    public function setFrontendLabel($fontendLabel)
    {
        return $this->setData(
            self::BSS_FRONTEND_LABEL,
            $this->jsonHelper->jsonEncode($fontendLabel));
    }

    public function getFrontend()
    {
        if(!$this->getData(self::BSS_FRONTEND_LABEL))
            return;
        return $this->jsonHelper->jsonDecode($this->getData(self::BSS_FRONTEND_LABEL));
    }

    /**
     * Get FRONTEND CLASS.
     *
     * @return varchar
     */
    public function getFrontendClass()
    {
        return $this->getData(self::BSS_FRONTEND_CLASS);
    }
 
    /**
     * Set FRONTEND CLASS.
     */
    public function setFrontendClass($fontendClass)
    {
        return $this->setData(self::BSS_FRONTEND_CLASS, $fontendClass);
    }

    /**
     * Get FRONTEND INPUT.
     *
     * @return varchar
     */
    public function getFrontendInput()
    {
        return $this->getData(self::BSS_FRONTEND_INPUT);
    }
 
    /**
     * Set FRONTEND INPUT.
     */
    public function setFrontendInput($fontendInput)
    {
        return $this->setData(self::BSS_FRONTEND_INPUT, $fontendInput);
    }

    /**
     * Get IS REQUIRED.
     *
     * @return int
     */
    public function getIsRequired()
    {
        return $this->getData(self::BSS_IS_REQUIRED);
    }
 
    /**
     * Set IS REQUIRED.
     */
    public function setIsRequired($isRequired)
    {
        return $this->setData(self::BSS_IS_REQUIRED, $isRequired);
    }

    /**
     * Get Store ID.
     *
     * @return int
     */
    public function getStoreId()
    {
        return $this->getData(self::BSS_STORE_ID);
    }
 
    /**
     * Set Store ID.
     */
    public function setStoreId($storeId)
    {
        return $this->setData(self::BSS_STORE_ID, explode(',', $storeId));
    }

    /**
     * Get IS USER DEFIEND.
     *
     * @return int
     */
    public function getIsUserDefiend()
    {
        return $this->getData(self::BSS_IS_USER_DEFIEND);
    }
 
    /**
     * Set IS USER DEFIEND.
     */
    public function setIsUserDefiend($isUserDefiend)
    {
        return $this->setData(self::BSS_IS_USER_DEFIEND, $isUserDefiend);
    }
    
    /**
     * Get DEFAULT VALUE.
     *
     * @return varchar
     */
    public function getDefaultValue()
    {
        return $this->getData(self::BSS_DEFAULT_VALUE);
    }
 
    /**
     * Set DEFAULT VALUE.
     */
    public function setDefaultValue($defaultValue)
    {
        return $this->setData(self::BSS_DEFAULT_VALUE, $defaultValue);
    }

    /**
     * Get VISIBLE FRONTEND.
     *
     * @return int
     */
    public function getVisibleFrontend()
    {
        return $this->getData(self::BSS_VISIBLE_FRONTEND);
    }
 
    /**
     * Set VISIBLE FRONTEND.
     */
    public function setVisibleFrontend($visibleFrontend)
    {
        return $this->setData(self::BSS_VISIBLE_FRONTEND, $visibleFrontend);
    }

    /**
     * Get VISIBLE BACKEND.
     *
     * @return int
     */
    public function getVisibleBackend()
    {
        return $this->getData(self::BSS_VISIBLE_BACKEND);
    }
 
    /**
     * Set VISIBLE BACKEND.
     */
    public function setVisibleBackend($visibleBackend)
    {
        return $this->setData(self::BSS_VISIBLE_BACKEND, $visibleBackend);
    }

    /**
     * Get SHOW IN.
     *
     * @return int
     */
    public function getShowIn()
    {
        return $this->getData(self::BSS_SHOW_IN_SHIPPING);
    }
 
    /**
     * Set SHOW IN.
     */
    public function setShowIn($showIn)
    {
        return $this->setData(self::BSS_SHOW_IN_SHIPPING, $showIn);
    }

    /**
     * Get SORT ORDER.
     *
     * @return int
     */
    public function getSortOrder()
    {
        return $this->getData(self::BSS_SORT_ORDER);
    }
 
    /**
     * Set SORT ORDER.
     */
    public function setSortOrder($sortOrder)
    {
        return $this->setData(self::BSS_SORT_ORDER, $sortOrder);
    }

    /**
     * Get SAVE IN FUTURE.
     *
     * @return int
     */
    public function getSaveInFuture()
    {
        return $this->getData(self::BSS_SAVE_IN_FUTURE);
    }
 
    /**
     * Set SAVE IN FUTURE.
     */
    public function setSaveInFuture($saveInFuture)
    {
        return $this->setData(self::BSS_SAVE_IN_FUTURE, $saveInFuture);
    }

    /**
     * Get SHOW GIRD.
     *
     * @return int
     */
    public function getShowGird()
    {
        return $this->getData(self::BSS_SHOW_GIRD);
    }
 
    /**
     * Set SHOW GIRD.
     */
    public function setShowGird($showGird)
    {
        return $this->setData(self::BSS_SHOW_GIRD, $showGird);
    }

    /**
     * Get SHOW IN ORDER.
     *
     * @return int
     */
    public function getShowInOrder()
    {
        return $this->getData(self::BSS_SHOW_IN_ORDER);
    }
 
    /**
     * Set SHOW IN ORDER.
     */
    public function setShowInOrder($showInOrder)
    {
        return $this->setData(self::BSS_SHOW_IN_ORDER, $showInOrder);
    }

    /**
     * Get SHOW IN PDF.
     *
     * @return int
     */
    public function getShowInPdf()
    {
        return $this->getData(self::BSS_SHOW_IN_PDF);
    }
 
    /**
     * Set SHOW IN PDF.
     */
    public function setShowInPdf($showInPdf)
    {
        return $this->setData(self::BSS_SHOW_IN_PDF, $showInPdf);
    }

    /**
     * Get SHOW IN EMAIL.
     *
     * @return int
     */
    public function getShowInEmail()
    {
        return $this->getData(self::BSS_SHOW_IN_EMAIL);
    }
 
    /**
     * Set SHOW IN EMAIL.
     */
    public function setShowInEmail($showInEmail)
    {
        return $this->setData(self::BSS_SHOW_IN_EMAIL, $showInEmail);
    }

    /**
     * Detect default value using frontend input type
     *
     * @param string $type frontend_input field name
     * @return string default_value field value
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     */
    public function getDefaultValueByInput($type)
    {
        $field = '';
        switch ($type) {
            case 'select':
                break;
            case 'multiselect':
                $field = null;
                break;

            case 'text':
                $field = 'default_value_text';
                break;

            case 'textarea':
                $field = 'default_value_textarea';
                break;

            case 'date':
                $field = 'default_value_date';
                break;

            case 'boolean':
                $field = 'default_value_yesno';
                break;

            default:
                break;
        }

        return $field;
    }

    public function getCustomFieldChekout()
    {
        $storeId = $this->_storeManager->getStore()->getId();
        $collections = $this->getCollection()
            ->addFieldToFilter(self::BSS_VISIBLE_FRONTEND, ['eq' => 1]);
        return $collections;
    }

    public function getCustomFieldCreateOrder()
    {
        $collections = $this->getCollection()
            ->addFieldToFilter(self::BSS_VISIBLE_BACKEND, ['eq' => 1]);
        return $collections;
    }

    public function getCollectionByCode($array)
    {
        $collections = $this->getCollection()
            ->addFieldToFilter(self::BSS_ATTRIBUTE_CODE, ['in' => $array]);
        return $collections;
    }

    public function getCustomFieldAdminGird()
    {
        $collections = $this->getCollection()
            ->addFieldToFilter(self::BSS_SHOW_GIRD, ['in' => [1,0]]);
        return $collections;
    }
}
