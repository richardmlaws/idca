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
use Bss\CheckoutCustomField\Api\Data\AttributeOptionInterface;
use Bss\CheckoutCustomField\Helper\Data as Helper;

class AttributeOption extends \Magento\Framework\Model\AbstractModel implements AttributeOptionInterface
{
    protected $helper;

    public function __construct(
        \Magento\Framework\Model\Context $context,
        \Magento\Framework\Registry $registry,
        Helper $helper,
        array $data = []
    ) {
        $this->helper = $helper;
        parent::__construct($context, $registry, null, null, $data);
    }
    
    /**
     * Initialize resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('Bss\CheckoutCustomField\Model\ResourceModel\AttributeOption');
    }

    protected $_cacheTag = 'bss_checkout_attribute_option';
 
    /**
     * Prefix of model events names.
     *
     * @var string
     */
    protected $_eventPrefix = 'bss_checkout_attribute_option';

    /**
     * Get Value ID.
     *
     * @return int
     */
    public function getValueId()
    {
        return $this->getData(self::BSS_VALUE_ID);
    }
 
    /**
     * Set Value ID.
     */
    public function setValueId($valueId)
    {
        return $this->setData(self::BSS_VALUE_ID, $valueId);
    }

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
     * Get OPTION ID.
     *
     * @return int
     */
    public function getOptionId()
    {
        return $this->getData(self::BSS_OPTION_ID);
    }
 
    /**
     * Set OPTION ID.
     */
    public function setOptionId($optionId)
    {
        return $this->setData(self::BSS_OPTION_ID, $optionId);
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
        return $this->setData(self::BSS_STORE_ID, $storeId);
    }

    /**
     * Get Value.
     *
     * @return varchar
     */
    public function getValue()
    {
        return $this->getData(self::BSS_VALUE);
    }
 
    /**
     * Set Value.
     */
    public function setValue($value)
    {
        return $this->setData(self::BSS_VALUE, $value);
    }

    /**
     * Get Is Default.
     *
     * @return varchar
     */
    public function getIsDefault()
    {
        return $this->getData(self::BSS_IS_DEFAULT);
    }
 
    /**
     * Set Is Default.
     */
    public function setIsDefault($isDefault)
    {
        return $this->setData(self::BSS_IS_DEFAULT, $isDefault);
    }

    public function getOptions($attributeId)
    {
        $collection = $this->getCollection()->addFieldToFilter(
            self::BSS_ATTRIBUTE_ID,
            ['eq' => $attributeId
            ]
        );
            $defaultValue = [];
            $options = [];
        foreach ($collection as $option) {
            $defaultValues[$option->getOptionId()] = $option->getIsDefault();
            $options[$option->getOptionId()][$option->getStoreId()] = $option->getValue();
        }
            return [
            0 => $defaultValues,
            1 => $options
            ];
    }

    public function getAttributeOptions($attributeId, $storeId = null)
    {
        $currentStoreId = !is_null($storeId) ? $storeId : $this->helper->getCurrentStoreId();
        $collectionDefault = $this->getCollection(
        )->addFieldToFilter(
            self::BSS_ATTRIBUTE_ID,
            ['eq' => $attributeId
                ]
        )->addFieldToFilter(
            self::BSS_STORE_ID,
            ['eq' => 0
                    ]
        );
                $collectionStore = $this->getCollection(
                )->addFieldToFilter(
                    self::BSS_ATTRIBUTE_ID,
                    ['eq' => $attributeId
                    ]
                )->addFieldToFilter(
                    self::BSS_STORE_ID,
                    ['eq' => $currentStoreId
                    ]
                );
                $options = [];
        foreach ($collectionDefault as $col) {
            $options[$col->getOptionId()] = ['value' => $col->getOptionId(), 'label' => $col->getValue()];
        }
        foreach ($collectionStore as $col) {
            if ($col->getValue()) {
                $options[$col->getOptionId()] = [
                    'value' => $col->getOptionId(),
                    'label' => $col->getValue()
                ];
            }
        }
        return $options;
    }

    public function getDefaultValue($array)
    {
        $result = [];
        foreach ($array as $key => $value) {
            if ($value) {
                $result[] = (string)$key;
            }
        }
        return $result;
    }

    public function getLabel($attributeId, $optionId)
    {
        $collectionStore = $this->getCollection(
        )->addFieldToFilter(
            self::BSS_ATTRIBUTE_ID,
            ['eq' => $attributeId
                ]
        )->addFieldToFilter(
            self::BSS_STORE_ID,
            ['eq' => $this->helper->getCurrentStoreId()
                    ]
        )->addFieldToFilter(
            self::BSS_OPTION_ID,
            ['eq' => $optionId
                    ]
        );
                $collectionDefault = $this->getCollection(
                )->addFieldToFilter(
                    self::BSS_ATTRIBUTE_ID,
                    ['eq' => $attributeId
                    ]
                )->addFieldToFilter(
                    self::BSS_STORE_ID,
                    ['eq' => 0
                    ]
                )->addFieldToFilter(
                    self::BSS_OPTION_ID,
                    ['eq' => $optionId
                    ]
                );
                $label = '';
        foreach ($collectionDefault as $col) {
            $label = $col->getValue();
        }

        foreach ($collectionStore as $col) {
            if ($col->getValue()) {
                $label = $col->getValue();
            }
        }

                return $label;
    }
}
