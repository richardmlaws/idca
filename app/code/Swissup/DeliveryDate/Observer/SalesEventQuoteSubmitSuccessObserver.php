<?php
namespace Swissup\DeliveryDate\Observer;

use Magento\Framework\Event\Observer as EventObserver;
use Magento\Framework\Event\ObserverInterface;

use Swissup\DeliveryDate\Model\DeliverydateFactory;

class SalesEventQuoteSubmitSuccessObserver implements ObserverInterface
{
    /**
     * @var DeliverydateFactory
     */
    protected $deliverydateFactory;

    /**
     * @param DeliverydateFactory $deliverydateFactory
     */
    public function __construct(DeliverydateFactory $deliverydateFactory)
    {
        $this->deliverydateFactory = $deliverydateFactory;
    }

    public function execute(EventObserver $observer)
    {
        /** @var  \Magento\Quote\Model\Quote $quote */
        $quote = $observer->getEvent()->getQuote();
        /** @var  \Magento\Sales\Model\Order $order */
        $order = $observer->getEvent()->getOrder();

        $this->deliverydateFactory
            ->create()
            ->loadByQuoteId($quote->getId())
            ->setOrderId($order->getId())
            ->save()
        ;

        // \Magento\Framework\App\ObjectManager::getInstance()
        //     ->get('Psr\Log\LoggerInterface')->debug(
        //         print_r($modelDeliveryDate->getData(), true)
        //     );
        return $this;
    }
}
