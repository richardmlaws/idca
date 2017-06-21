<?php

namespace Swissup\Firecheckout\Model;

class ShippingMethodManagement
    extends \Magento\Checkout\Model\ShippingInformationManagement
    implements \Swissup\Firecheckout\Api\ShippingMethodManagementInterface
{
    /**
     * saveAddressInformation is not used directly to disable all third-party
     * module validators and plugins at this point
     */
    public function saveShippingMethod(
        $cartId,
        \Magento\Checkout\Api\Data\ShippingInformationInterface $addressInformation
    ) {
        return parent::saveAddressInformation($cartId, $addressInformation);
    }
}
