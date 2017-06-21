<?php

namespace Swissup\Firecheckout\Observer;

class AddPageClassName implements \Magento\Framework\Event\ObserverInterface
{
    /**
     * @var \Magento\Framework\View\Page\Config
     */
    protected $pageConfig;

    /**
     * @var \Swissup\Firecheckout\Helper\Data
     */
    protected $helper;

    /**
     */
    public function __construct(
        \Magento\Framework\View\Page\Config $pageConfig,
        \Swissup\Firecheckout\Helper\Data $helper
    ) {
        $this->pageConfig = $pageConfig;
        $this->helper = $helper;
    }

    /**
     * Add FontAwesome assets according to module config
     *
     * @param \Magento\Framework\Event\Observer $observer
     * @return void
     */
    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        if (!$this->helper->isOnFirecheckoutPage()) {
            return;
        }

        $this->pageConfig->addBodyClass('firecheckout')
            ->addBodyClass('checkout-index-index');

        foreach ($this->helper->getLayoutClassNames() as $class) {
            $this->pageConfig->addBodyClass($class);
        }
    }
}
