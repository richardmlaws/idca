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
namespace Bss\CheckoutCustomField\Model\ResourceModel;

use Magento\Framework\DB\Select;
use Magento\Framework\Model\AbstractModel;
use Magento\Framework\App\ObjectManager;

class Attribute extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    /**
     * @var \Magento\Framework\Registry
     */
    protected $resigtry;

    /**
     * @var \Bss\CheckoutCustomField\Model\AttributeOption
     */
    protected $modelOption;

    public function __construct(
        \Magento\Framework\Model\ResourceModel\Db\Context $context,
        \Bss\CheckoutCustomField\Model\AttributeOption $modelOption,
        \Magento\Framework\Registry $resigtry
    ) {
        parent::__construct($context);
        $this->resigtry = $resigtry;
        $this->modelOption = $modelOption;
    }
    /**
     * Initialize resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('bss_checkout_attribute', 'attribute_id');
    }

    public function loadByCode(AbstractModel $object, $entityTypeId, $code)
    {
        $bind = [':attribute_id' => $entityTypeId];
        $select = $this->_getLoadSelect('attribute_code', $code, $object)->where('attribute_id = :attribute_id');
        $data = $this->getConnection()->fetchRow($select, $bind);

        if ($data) {
            $object->setData($data);
            $this->_afterLoad($object);
            return true;
        }
        return false;
    }

    protected function _afterSave(AbstractModel $object)
    {
        $attributeId = $object->getId();
        $this->modelOption->getCollection()
            ->addFieldToFilter('attribute_id', ['eq' => $attributeId])
            ->walk('delete');
        if ($options = $this->resigtry->registry('attribute_option')) {
            $defaultOption = $this->resigtry->registry('attribute_option_default');
            foreach ($options['value'] as $key => $option) {
                $default = 0;
                if ($defaultOption) {
                    $default = (int)in_array($key, $defaultOption);
                }
                foreach ($option as $k => $val) {
                    $this->modelOption->setValueId(null);
                    $this->modelOption->setIsDefault($default);
                    $this->modelOption->setAttributeId($attributeId);
                    $this->modelOption->setOptionId(str_replace('option_', "", $key));
                    $this->modelOption->setStoreId($k);
                    $this->modelOption->setValue($val);
                    $this->modelOption->save();
                }
            }
        }
    }
}
