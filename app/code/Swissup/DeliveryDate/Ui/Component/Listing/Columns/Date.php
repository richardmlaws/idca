<?php
namespace Swissup\DeliveryDate\Ui\Component\Listing\Columns;

use Swissup\DeliveryDate\Model\DeliverydateFactory;

/**
 * Class Date
 * @package Swissup\DeliveryDate\Ui\Component\Listing\Columns
 */
class Date extends \Magento\Ui\Component\Listing\Columns\Column
{

    protected $helper;

    /**
     * @var DeliverydateFactory
     */
    protected $deliverydateFactory;

    /**
     * @param \Magento\Framework\View\Element\UiComponent\Context $context
     * @param \Magento\Framework\View\Element\UiComponentFactory $uiComponentFactory
     * @param \Swissup\DeliveryDate\Helper\Data $helper
     * @param DeliverydateFactory $deliverydateFactory
     * @param array $components
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\UiComponent\Context $context,
        \Magento\Framework\View\Element\UiComponentFactory $uiComponentFactory,
        \Swissup\DeliveryDate\Helper\Data $helper,
        DeliverydateFactory $deliverydateFactory,
        array $components = [],
        array $data = []
    ) {
        $this->helper = $helper;
        $this->deliverydateFactory = $deliverydateFactory;
        return parent::__construct($context, $uiComponentFactory, $components, $data);
    }

    /**
     * @param array $dataSource
     * @return array
     */
    public function prepareDataSource(array $dataSource)
    {
        if (isset($dataSource['data']['items'])) {
            foreach ($dataSource['data']['items'] as &$item) {
                $item['delivery_date'] = $this->getDeliveryDateByItem($item);
            }
        }
        return $dataSource;
    }

    protected function getDeliveryDateByItem($item)
    {
        $date = '0000-00-00 00:00:00';
        $deliveryDate = $this->deliverydateFactory
            ->create()
            ->loadByOrderId($item['entity_id'])
        ;
        if ($deliveryDate->getId()) {
            $date = $deliveryDate->getDate();
        }
        return $date;
    }
}
