<?php
namespace Swissup\CheckoutCart\Plugin\Model;

class ConfigProvider
{
    /**
     * @var \Swissup\CheckoutCart\Helper\Data
     */
    protected $helper;
    /**
     * @param \Swissup\CheckoutCart\Helper\Data $helper
     */
    public function __construct(
        \Swissup\CheckoutCart\Helper\Data $helper
    ) {
        $this->helper = $helper;
    }
    /**
     * @param \Magento\Checkout\Model\DefaultConfigProvider $subject
     * @param array $result
     * @return string
     */
    public function afterGetConfig(
        \Magento\Checkout\Model\DefaultConfigProvider $subject,
        array $result
    ) {
        if ($this->helper->isEnabled()) {
            $result['useSwissupCheckoutCart'] = true;
        }
        return $result;
    }
}
