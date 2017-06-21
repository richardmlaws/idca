<?php
namespace Swissup\Taxvat\Helper;

use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Helper\AbstractHelper;
use Magento\Store\Model\ScopeInterface;

class Data extends AbstractHelper
{
    /**
     * Path to store config is VAT field enabled
     *
     * @var string
     */
    const VAT_ENABLED = 'customer/create_account/vat_frontend_visibility';
    /**
     * Path to store config is VIES validation enabled
     *
     * @var string
     */
    const VALIDATION_ENABLED = 'taxvat/general/validate';
    /**
     * Path to store config is VAT field required
     *
     * @var string
     */
    const VAT_FIELD_REQUIRED = 'taxvat/general/required';
    /**
     * @var \Magento\Customer\Model\Vat
     */
    protected $customerVatModel;

    /**
     * @param \Magento\Framework\App\Helper\Context $context
     * @param \Magento\Customer\Model\Vat $customerVatModel
     */
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Customer\Model\Vat $customerVatModel
    ) {
        $this->customerVatModel = $customerVatModel;
        parent::__construct($context);
    }

    protected function _getConfig($key)
    {
        return $this->scopeConfig->getValue($key, ScopeInterface::SCOPE_STORE);
    }

    /**
     * Check if VAT field is enabled in admin
     * @return boolean
     */
    public function isVatFieldEnabled()
    {
        return (bool)$this->_getConfig(self::VAT_ENABLED);
    }

    /**
     * Check if VAT validation is enabled in admin
     * @return boolean
     */
    public function isValidationEnabled()
    {
        return (bool)$this->_getConfig(self::VALIDATION_ENABLED);
    }

    /**
     * Check if VAT field is required
     * @return boolean
     */
    public function isVatRequired()
    {
        return (bool)$this->_getConfig(self::VAT_FIELD_REQUIRED);
    }

    /**
     * Check if both VAT field and validation are enabled
     * @return bool
     */
    public function canValidateVat()
    {
        return self::isVatFieldEnabled() && self::isValidationEnabled();
    }

    /**
     * Validate VAT number using VIES service
     * @param  string $countryCode
     * @param  string $vatNumber
     * @return bool
     */
    public function validateVat($countryCode, $vatNumber)
    {
        $result = $this->customerVatModel
            ->checkVatNumber($countryCode, $vatNumber);
        $valid = $result->getIsValid();
        $success = $result->getRequestSuccess();

        // return true if VIES service is not available
        if (!$success) return true;

        return $valid;
    }
}
