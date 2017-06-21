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
use Magento\Framework\Json\Helper\Data as JsonHelper;
/**
 * Visitor Observer
 */
class SaveOrder implements ObserverInterface
{
    protected $jsonHelper;

    protected $request;

    protected $attribute;

    protected $attributeOption;

    public function __construct(
        \Magento\Framework\App\Request\Http $request,
        JsonHelper $jsonHelper,
        \Bss\CheckoutCustomField\Model\Attribute $attribute,
        \Bss\CheckoutCustomField\Model\AttributeOption $attributeOption
    ) {
        $this->jsonHelper = $jsonHelper;
        $this->request = $request;
        $this->attribute = $attribute;
        $this->attributeOption = $attributeOption;
    }

    public function execute(EventObserver $observer)
    {
        $order = $observer->getOrder();
        $data = $this->request->getPost();
        if(isset($data['bss_customField']))
        {
            $customAttr = $data['bss_customField'];
            $attrCodes = array_keys($customAttr);
            $bssCustomfield = [];
            $collection = $this->attribute->getCollectionByCode($attrCodes);
            foreach ($collection as $col) {
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
                $bssCustomfield[$col->getAttributeCode()] = [
                    'show_gird' => $col->getShowGird(),
                    'show_in_order' => $col->getShowInOrder(),
                    'show_in_pdf' => $col->getShowInPdf(),
                    'show_in_email' => $col->getShowInEmail(),
                    'frontend_label' => $col->getBackendLabel(),
                    'value' => $value,
                    'val' => $customAttr[$col->getAttributeCode()],
                    'type' => $col->getFrontendInput()
                ];
            }
            $order->setBssCustomfield($this->jsonHelper->jsonEncode($bssCustomfield));
            $order->save();
        }
        return $this;
    }

}
