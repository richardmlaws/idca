<?php
namespace Swissup\DeliveryDate\Observer\Adminhtml\Order\Shipping;

use Magento\Framework\Event\Observer as EventObserver;
use Magento\Framework\Event\ObserverInterface;

use Swissup\DeliveryDate\Model\DeliverydateFactory;

class ViewObserver implements ObserverInterface
{
    /**
     * @var \Magento\Framework\ObjectManagerInterface
     */
    protected $objectManager;

    /**
     * @var DeliverydateFactory
     */
    protected $deliverydateFactory;

    /**
     * @param \Magento\Framework\ObjectManagerInterface $objectmanager
     * @param DeliverydateFactory $deliverydateFactory
     */
    public function __construct(\Magento\Framework\ObjectManagerInterface $objectmanager, DeliverydateFactory $deliverydateFactory)
    {
        $this->objectManager = $objectmanager;
        $this->deliverydateFactory = $deliverydateFactory;
    }

    public function execute(EventObserver $observer)
    {
        if ($observer->getElementName() != 'order_shipping_view') {
            return;
        }

        $orderShippingViewBlock = $observer->getLayout()->getBlock($observer->getElementName());
        $order = $orderShippingViewBlock->getOrder();
        $localeDate = $this->objectManager->create(
            '\Magento\Framework\Stdlib\DateTime\TimezoneInterface'
        );

        $date = $order->getDeliveryDate();

        $deliveryDate = $this->deliverydateFactory
            ->create()
            ->loadByOrderId($order->getId())
        ;
        if ($deliveryDate->getId()) {
            $date = $deliveryDate->getDate();
        }

        $formattedDate = $localeDate->formatDate(
            $localeDate->scopeDate(
                $order->getStore(),
                $date,
                true
            ),
            \IntlDateFormatter::MEDIUM,
            false
        );
        $deliveryDateBlock = $this->objectManager->create(
            'Magento\Framework\View\Element\Template'
        );
        $deliveryDateBlock->setDeliveryDate($formattedDate);
        $deliveryDateBlock->setTemplate('Swissup_DeliveryDate::order/shipping/view.phtml');
        $html = $observer->getTransport()->getOutput() . $deliveryDateBlock->toHtml();

        $observer->getTransport()->setOutput($html);
    }
}
