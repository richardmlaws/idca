<?php
namespace Swissup\DeliveryDate\Model;

use Magento\Checkout\Model\ConfigProviderInterface;
use Magento\Checkout\Model\Session;
use Swissup\DeliveryDate\Helper\Data as DataHelper;

class ConfigProvider implements ConfigProviderInterface
{
    /**
     * @var \Magento\Quote\Model\Quote
     */
    protected $quote;

    /**
     * @var \Swissup\DeliveryDate\Helper\Data
     */
    public $dataHelper;

    public function __construct(Session $session, DataHelper $dataHelper)
    {
        $quote = $session->getQuote();
        $deliveryDate = $quote->getDeliveryDate();
        if (empty($deliveryDate)) {
            $deliveryDate = $session->getDeliveryDate();
            if (!empty($deliveryDate)) {
                $quote->setDeliveryDate($deliveryDate);
            }
        }

        $this->quote = $quote;
        $this->dataHelper = $dataHelper;
    }

    public function getConfig()
    {
        $helper = $this->dataHelper;

        $options = [
            'minDate' => $helper->getMinDelayDays(),
            'maxDate' => $helper->getMaxDelayDays(),
            'dateFormat' => $helper->getDateFormatJQueryUi(),
            'excludedWeekdays' => $helper->getExcludedWeekdays(),
            'holidays' => $helper->getHolidays(),
        ];

        if ($helper->getIsUseCalendar()) {
            $options['showOn'] = "both";
            $options['buttonImageOnly'] = false;
            $options['buttonText'] = " ";
        }

        $date = $this->quote->getDeliveryDate();
        // $options['_defaultDate'] = $date;
        $_date = strtotime($date);
        if ($_date) {
            $options['defaultDate'] = $_date * 1000;
        }
        if (!isset($options['defaultDate']) && $helper->getIsUseDefaultDateValue()) {
            $now = new \DateTime();
            $options['defaultDate'] = $now->getTimestamp() * 1000;
        }

        return [
            'swissup' => [
                'DeliveryDate' => [
                    // 'enable' => false,
                    'label' => $helper->getFieldLabel(),
                    'options' => $options,
                    'required' => $helper->getIsFieldRequired(),
                    'shipping_methods' => $helper->getShippingMethods(),
                    'filter_per_shipping_method' => $helper->getIsFilterPerShippingMethod()
                ]
            ]
        ];
    }
}
