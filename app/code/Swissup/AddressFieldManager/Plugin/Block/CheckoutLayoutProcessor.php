<?php

namespace Swissup\AddressFieldManager\Plugin\Block;

class CheckoutLayoutProcessor
{
    public function afterProcess(
        \Magento\Checkout\Block\Checkout\LayoutProcessor $subject,
        $jsLayout
    ) {
        if (isset($jsLayout['components']['checkout']['children']['steps']['children']['billing-step']['children']
            ['payment']['children']['payments-list']['children'])) {

            $this->updateBillingAddressTemplate(
                $jsLayout['components']['checkout']['children']['steps']['children']['billing-step']['children']
                    ['payment']['children']['payments-list']['children']
            );
        }

        return $jsLayout;
    }

    /**
     * Set billing-address template that will properly render address data
     *
     * @param  array &$paymentForms
     * @return void
     */
    protected function updateBillingAddressTemplate(array &$paymentForms)
    {
        foreach ($paymentForms as $key => $values) {
            if (false === strpos($key, '-form')) {
                continue;
            }

            if (!isset($paymentForms[$key]['component'])
                || false === strpos($paymentForms[$key]['component'], 'billing-address')) {

                continue;
            }

            $paymentForms[$key]['template'] = 'Swissup_AddressFieldManager/billing-address';
        }
    }
}
