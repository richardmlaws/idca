<?php
namespace Swissup\Taxvat\Plugin\Model;

use Magento\Framework\Exception\ValidatorException;

class ShippingInformationManagement
{
    /**
     * @var \Swissup\Taxvat\Helper\Data $helper
     */
    protected $helper;
    /**
     * @param \Swissup\Taxvat\Helper\Data $helper
     */
    public function __construct(
        \Swissup\Taxvat\Helper\Data $helper
    ) {
        $this->helper = $helper;
    }

    public function beforeSaveAddressInformation(
        \Magento\Checkout\Model\ShippingInformationManagement $subject,
        $cartId,
        \Magento\Checkout\Api\Data\ShippingInformationInterface $addressInformation
    ) {
        if (!$this->helper->canValidateVat()) {
            return null;
        }

        $vat = $addressInformation->getShippingAddress()->getVatId();
        $country = $addressInformation->getShippingAddress()->getCountryId();
        if ($country && !empty($vat) && !$this->helper->validateVat($country, $vat)) {
            throw new ValidatorException(__('Please enter a valid VAT number.'));
        }

        return null;
    }
}
