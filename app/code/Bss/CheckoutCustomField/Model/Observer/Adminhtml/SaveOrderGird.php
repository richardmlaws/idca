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
namespace Bss\CheckoutCustomField\Model\Observer\Adminhtml;

use Magento\Framework\Event\Observer as EventObserver;
use Magento\Framework\Event\ObserverInterface;
/**
 * Visitor Observer
 */
class SaveOrderGird implements ObserverInterface
{
    /**
     * @var \Magento\Framework\App\ResourceConnection $resource
     */
    protected $resource;

    protected $request;

    protected $attribute;

    public function __construct(
        \Magento\Framework\App\ResourceConnection $resource,
        \Magento\Framework\App\Request\Http $request,
        \Bss\CheckoutCustomField\Model\Attribute $attribute,
        \Bss\CheckoutCustomField\Model\AttributeOption $attributeOption
    ) {
        $this->resource = $resource;
        $this->request = $request;
        $this->attribute = $attribute;
        $this->attributeOption = $attributeOption;
    }

    public function execute(EventObserver $observer)
    {
        $order = $observer->getOrder();
        $data = $this->request->getPost();
        $connection = $this->resource->getConnection();
        if(isset($data['bss_customField']))
        {
            $customAttr = $data['bss_customField'];
            $attrCodes = array_keys($customAttr);
            $bssCustomfield = [];
            $collection = $this->attribute->getCollectionByCode($attrCodes);
            $sql = '';
            foreach ($collection as $col) {
                if($col->getShowGird() != 2)
                {
                    if (is_array($customAttr[$col->getAttributeCode()])) {
                        $value = [];
                        foreach ($customAttr[$col->getAttributeCode()] as $val) {
                            $value[] = $this->attributeOption->getLabel($col->getAttributeId(), $val);
                        }
                    } elseif ($col->getFrontendInput() == 'select') {
                        $value = $this->attributeOption->getLabel($col->getAttributeId(), $customAttr[$col->getAttributeCode()]);
                    } elseif ($col->getFrontendInput() == 'boolean') {
                        $value = $customAttr[$col->getAttributeCode()] ? "Yes" : "No";
                    }else {
                        $value = $customAttr[$col->getAttributeCode()];
                    }
                    if ($col->getFrontendInput() == 'multiselect') {
                        $sql .= "`" . $col->getAttributeCode() . "`='" . implode(",", $customAttr[$col->getAttributeCode()]) . "', ";
                    } elseif ($col->getFrontendInput() == 'select' || $col->getFrontendInput() == 'boolean') {
                        $sql .= "`" . $col->getAttributeCode() . "`='" . $customAttr[$col->getAttributeCode()] . "', ";
                    } else {
                        $sql .= "`" . $col->getAttributeCode() . "`='" . $value . "', ";
                    }
                }
            }
            $sql = trim($sql, ", ");
            $sql = "Update " . $this->resource->getTableName('sales_order_grid') . " Set " . $sql . " where entity_id = ". $order->getId();
            $connection->query($sql);
        }
        return $this;
    }

}
