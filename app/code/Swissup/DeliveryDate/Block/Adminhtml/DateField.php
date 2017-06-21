<?php
namespace Swissup\DeliveryDate\Block\Adminhtml;

use Swissup\DeliveryDate\Model\DeliverydateFactory;

/**
 * Class DateField
 * @package Swissup\DeliveryDate\Block\Adminhtml
 */
class DateField extends \Magento\Framework\View\Element\Template
{
    /**
     * @var \Magento\Backend\Model\Session\Quote
     */
    public $quoteSession;
    /**
     * @var \Swissup\DeliveryDate\Helper\Data
     */
    public $helper;

    /**
     * @var DeliverydateFactory
     */
    protected $deliverydateFactory;

    /**
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Magento\Backend\Model\Session\Quote $quoteSession
     * @param \Swissup\DeliveryDate\Helper\Data $helper
     * @param DeliverydateFactory $deliverydateFactory
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Backend\Model\Session\Quote $quoteSession,
        \Swissup\DeliveryDate\Helper\Data $helper,
        DeliverydateFactory $deliverydateFactory,
        array $data = []
    ) {
        $this->helper = $helper;
        $this->quoteSession = $quoteSession;
        $this->deliverydateFactory = $deliverydateFactory;
        parent::__construct($context, $data);
    }

    /**
     * @return string
     */
    public function getStoredDeliveryDate()
    {
        $date = '';
        $deliveryDate = $this->deliverydateFactory
            ->create()
            ->loadByOrderId($this->quoteSession->getOrderId())
        ;
        if ($deliveryDate->getId()) {
            $date = $deliveryDate->getDate();
        }
        $date = strtotime($date);
        $date *= 1000;
        return $date;
    }
}
