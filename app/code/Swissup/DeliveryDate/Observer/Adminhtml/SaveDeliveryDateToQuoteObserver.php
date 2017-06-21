<?php

namespace Swissup\DeliveryDate\Observer\Adminhtml;

use Magento\Framework\Event\Observer as EventObserver;
use Magento\Framework\Event\ObserverInterface;

use Swissup\DeliveryDate\Model\DeliverydateFactory;

/**
 * Class SaveDeliveryDateToQuoteObserver
 * @package Swissup\DeliveryDate\Model\Observer\Adminhtml
 */
class SaveDeliveryDateToQuoteObserver implements ObserverInterface
{

    /**
     * @var DeliverydateFactory
     */
    protected $deliverydateFactory;

    /**
     *
     * @param DeliverydateFactory $deliverydateFactory
     */
    public function __construct(DeliverydateFactory $deliverydateFactory)
    {
        $this->deliverydateFactory = $deliverydateFactory;
    }

    /**
     * @param EventObserver $observer
     */
    public function execute(EventObserver $observer)
    {
        $date = $observer->getRequestModel()->getParam('delivery_date');
        if ($date) {
            $session = $observer->getSession();
            $orderId = $session->getOrderId();
            $quoteId = $session->getQuoteId();

            $modelDeliveryDate = $this->deliverydateFactory
                ->create()
                ->loadByOrderIdAndQuoteId($orderId, $quoteId);
            $modelDeliveryDate
                ->setDate($date)
                ->setOrderId($orderId)
                ->setQuoteId($quoteId)
                ->save()
            ;
        }
    }
}
