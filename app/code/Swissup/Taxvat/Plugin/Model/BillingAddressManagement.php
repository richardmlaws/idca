<?php
namespace Swissup\Taxvat\Plugin\Model;

use Magento\Framework\Exception\ValidatorException;

class BillingAddressManagement
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

    public function beforeAssign(
        \Magento\Quote\Model\BillingAddressManagement $subject,
        $cartId,
        \Magento\Quote\Api\Data\AddressInterface $address,
        $useForShipping = false
    ) {
        if (!$this->helper->canValidateVat()) {
            return null;
        }

        $vat = $address->getVatId();
        $country = $address->getCountryId();
        if ($country && !empty($vat) && !$this->helper->validateVat($country, $vat)) {
            throw new ValidatorException(__('Please enter a valid VAT number.'));
        }

        return null;
    }
}
