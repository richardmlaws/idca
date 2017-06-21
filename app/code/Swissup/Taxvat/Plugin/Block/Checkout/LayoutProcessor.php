<?php
namespace Swissup\Taxvat\Plugin\Block\Checkout;

class LayoutProcessor
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

    public function afterProcess(
        \Magento\Checkout\Block\Checkout\LayoutProcessor $subject,
        $jsLayout
    ) {
        if (!$this->helper->canValidateVat()) {
            return $jsLayout;
        }

        if (isset($jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']['shippingAddress']['children']['shipping-address-fieldset']['children']['vat_id'])) {
            $jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']['shippingAddress']['children']['shipping-address-fieldset']['children']['vat_id']['config']['tooltip']['description'] = __('Will be validated after Next/Place Order pressed');

            $jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']['shippingAddress']['children']['shipping-address-fieldset']['children']['vat_id']['config']['warn'] = __('Please do not enter country code. For example, DE123456789 is wrong, while 123456789 is correct.');

            if ($this->helper->isVatRequired()) {
                $jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']['shippingAddress']['children']['shipping-address-fieldset']['children']['vat_id']['validation']['required-entry'] = true;
            }
        }

        if (isset($jsLayout['components']['checkout']['children']['steps']['children']['billing-step']['children']
            ['payment']['children']['payments-list']['children'])) {
            $this->addVatTooltip(
                $jsLayout['components']['checkout']['children']['steps']['children']['billing-step']['children']
                    ['payment']['children']['payments-list']['children']
            );
        }

        return $jsLayout;
    }
    /**
     * Add tooltip to VAT ID field
     *
     * @param  array &$paymentForms
     * @return void
     */
    private function addVatTooltip(array &$paymentForms)
    {
        foreach ($paymentForms as $key => $values) {
            if (strpos($key, '-form') > 0) {
                if (isset($paymentForms[$key]['children']['form-fields']['children']['vat_id'])) {
                    $paymentForms[$key]['children']['form-fields']['children']['vat_id']['config']['tooltip']['description'] = __('Will be validated after Next/Place Order pressed');
                    $paymentForms[$key]['children']['form-fields']['children']['vat_id']['config']['warn'] = __('Please do not enter country code. For example, DE123456789 is wrong, while 123456789 is correct.');
                    if ($this->helper->isVatRequired()) {
                        $paymentForms[$key]['children']['form-fields']['children']['vat_id']['validation']['required-entry'] = true;
                    }
                }
            }
        }
    }
}
