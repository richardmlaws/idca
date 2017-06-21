<?php

namespace Swissup\Firecheckout\Plugin\Helper;

class CheckoutData
{
    /**
     * @var \Swissup\Firecheckout\Helper\Data
     */
    protected $helper;

    /**
     * @param \Swissup\Firecheckout\Helper\Data $helper
     */
    public function __construct(
        \Swissup\Firecheckout\Helper\Data $helper
    ) {
        $this->helper = $helper;
    }

    /**
     * Overriden to return true, when onepage checkout is disabled.
     *
     * This check is used to render header cart actions and subtotal
     *
     * @param \Magento\Checkout\Helper\Data $subject
     * @param \Closure $proceed
     * @return boolean
     */
    public function aroundCanOnepageCheckout(
        \Magento\Checkout\Helper\Data $subject,
        \Closure $proceed
    ) {
        if ($this->helper->isFirecheckoutEnabled()) {
            return true;
        } else {
            return $proceed();
        }
    }
}
