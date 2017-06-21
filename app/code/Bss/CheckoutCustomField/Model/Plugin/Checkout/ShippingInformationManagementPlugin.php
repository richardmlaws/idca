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
namespace Bss\CheckoutCustomField\Model\Plugin\Checkout;

use Magento\Framework\Json\Helper\Data as JsonHelper;

class ShippingInformationManagementPlugin
{
    protected $quoteRepository;
    
    protected $jsonHelper;

    public function __construct(
        \Magento\Quote\Model\QuoteRepository $quoteRepository,
        JsonHelper $jsonHelper
    ) {
        $this->quoteRepository = $quoteRepository;
        $this->jsonHelper = $jsonHelper;
    }

    /**
     * @param \Magento\Checkout\Model\ShippingInformationManagement $subject
     * @param $cartId
     * @param \Magento\Checkout\Api\Data\ShippingInformationInterface $addressInformation
     */
    public function beforeSaveAddressInformation(
        \Magento\Checkout\Model\ShippingInformationManagement $subject,
        $cartId,
        \Magento\Checkout\Api\Data\ShippingInformationInterface $addressInformation
    ) {
        if(!$extAttributes = $addressInformation->getExtensionAttributes())
            return;
        $extAttributes = $extAttributes->getBssCustomfield();
        $extAttributes = $this->jsonHelper->jsonEncode($extAttributes);
        $quote = $this->quoteRepository->getActive($cartId);
        $quote->setBssCustomfield($extAttributes);
    }
}
