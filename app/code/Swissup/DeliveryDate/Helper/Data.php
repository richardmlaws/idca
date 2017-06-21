<?php
namespace Swissup\DeliveryDate\Helper;

use Magento\Store\Model\ScopeInterface;
use Magento\Framework\Stdlib\DateTime\DateTime;

/**
 * Class Data
 * @package Swissup\DeliveryDate\Helper
 */
class Data extends \Magento\Framework\App\Helper\AbstractHelper
{
    const CONFIG_FIELD_LABEL            = 'delivery_date/main/field_label';
    const CONFIG_USE_CALENDAR           = 'delivery_date/main/use_calendar';
    const CONFIG_USE_DEFAULT_DATE_VALUE = 'delivery_date/main/use_default_date_value';
    const CONFIG_PROCESSING_END_TIME    = 'delivery_date/main/processing_end_time';
    const CONFIG_MIN_DELAY              = 'delivery_date/main/min_delay';
    const CONFIG_MAX_DELAY              = 'delivery_date/main/max_delay';
    const CONFIG_EXCLUDE_WEEKDAYS       = 'delivery_date/main/exclude_weekdays';
    const CONFIG_DATE_FORMAT            = 'delivery_date/main/date_format';
    // const CONFIG_DISPLAY_AREA      = 'delivery_date/main/display_area';
    const CONFIG_FIELD_REQUIRED         = 'delivery_date/main/required';
    const CONFIG_HOLIDAYS               = 'delivery_date/main/holidays';
    const CONFIG_SHIPPING_METHODS       = 'delivery_date/main/shipping_methods';
    const CONFIG_FILTER_PER_SHIPPING_METHOD = 'delivery_date/main/filter_per_shipping_method';

    /**
     * @var \Magento\Framework\Stdlib\DateTime\TimezoneInterface
     */
    public $timeZone;

    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    public $storeManager;

    /**
     * @param \Magento\Framework\App\Helper\Context $context
     * @param \Magento\Framework\Stdlib\DateTime\TimezoneInterface $timeZone
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     */
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Framework\Stdlib\DateTime\TimezoneInterface $timeZone,
        \Magento\Store\Model\StoreManagerInterface $storeManager
    ) {
        $this->timeZone = $timeZone;
        $this->storeManager = $storeManager;
        return parent::__construct($context);
    }

    /**
     *
     * @param  string $dateString
     * @param  string|false $format
     * @return string
     */
    public function formatMySqlDateTime($dateString, $format = false)
    {
        // if (empty($dateString)) {
        //     return '0000-00-00 00:00:00';
        // }
        $format = $format ? $format : $this->getDateFormat();
        $dateTime = \DateTime::createFromFormat($format, $dateString);
        if ($dateTime) {
            $format = \Magento\Framework\Stdlib\DateTime::DATETIME_PHP_FORMAT;
            $dateTime->setTime(0, 0, 0);
            $dateTime = $dateTime->format($format);
        }

        return $dateTime;
    }

    /**
     * take mysql datetime string and convert it to given format
     *
     * @param $dateString
     * @param string|false $format
     * @param \Magento\Store\Model\Store|false $store
     * @return string
     */
    // public function formatMySqlDateTime($dateString, $format = false, $store = false)
    // {
    //     if ($dateString == '0000-00-00 00:00:00') {
    //         $result = 'N/A';
    //         return $result;
    //     }
    //     $format = $format ? $format : $this->getDateFormat();
    //     $store = $store ? $store : $this->storeManager->getStore();
    //     return $this->timeZone
    //         ->scopeDate($store, $dateString, true)
    //         ->format($format);
    // }

    /**
     *
     * @param  string $key
     * @return mixed
     */
    protected function getOption($key, $scope = ScopeInterface::SCOPE_STORE)
    {
        return $this->scopeConfig->getValue($key, $scope);
    }

    // /**
    //  * @return bool
    //  */
    // public function isDisableAfterSameDayTime()
    // {
    //     if ($this->getDisableAfterSameDayTime() &&
    //         strtotime($this->getDisableAfterSameDayTime()) > strtotime($this->timeZone->date()->format('H:i'))
    //     )
    //     {
    //         return false;
    //     }
    //     return true;
    // }

    // /**
    //  * @return bool
    //  */
    // public function isRequestAdmin()
    // {
    //     return strpos($this->_request->getPathInfo(), 'admin') === false;
    // }

    /**
     * @return mixed
     */
    public function getMinDelayDays()
    {
        $min = (int) $this->getOption(self::CONFIG_MIN_DELAY);

        $time = $this->getOption(self::CONFIG_PROCESSING_END_TIME);
        list($hour, $minute, $second) = explode(',', $time);
        $now = new \DateTime();
        $timezoneLocal = $this->timeZone->getConfigTimezone();
        $now->setTimezone(new \DateTimeZone($timezoneLocal));
        $_now = new \DateTime();
        $_now->setTimezone(new \DateTimeZone($timezoneLocal));
        $_now->setTime($hour, $minute, $second);
        if ($now >= $_now) {
            $min++;
        }

        return $min;
    }

    /**
     * @return mixed
     */
    public function getMaxDelayDays()
    {
        return (int) $this->getOption(self::CONFIG_MAX_DELAY);
    }

    /**
     * @return mixed
     */
    public function getExcludedWeekdays()
    {
        return array_map('intval', explode(',', $this->getOption(self::CONFIG_EXCLUDE_WEEKDAYS)));
    }

    /**
     * Matches each symbol of PHP date format standard
     * with jQuery equivalent codeword
     * @author Tristan Jahier
     * @param $php_format
     * @return string
     */
    public function convertDateFormatToJQueryUi($php_format)
    {
        $SYMBOLS_MATCHING = array(
            // Day
            'd' => 'dd',
            'D' => 'D',
            'j' => 'd',
            'l' => 'DD',
            'N' => '',
            'S' => '',
            'w' => '',
            'z' => 'o',
            // Week
            'W' => '',
            // Month
            'F' => 'MM',
            'm' => 'mm',
            'M' => 'M',
            'n' => 'm',
            't' => '',
            // Year
            'L' => '',
            'o' => '',
            'Y' => 'yy',
            'y' => 'y',
            // Time
            'a' => '',
            'A' => '',
            'B' => '',
            'g' => '',
            'G' => '',
            'h' => '',
            'H' => '',
            'i' => '',
            's' => '',
            'u' => ''
        );
        $jqueryui_format = "";
        $escaping = false;
        for ($i = 0; $i < strlen($php_format); $i++) {
            $char = $php_format[$i];
            if ($char === '\\') {// PHP date format escaping character
                $i++;
                if ($escaping) {
                    $jqueryui_format .= $php_format[$i];
                } else {
                    $jqueryui_format .= '\'' . $php_format[$i];
                }
                $escaping = true;
            } else {
                if ($escaping) {
                    $jqueryui_format .= "'";
                    $escaping = false;
                }
                if (isset($SYMBOLS_MATCHING[$char])) {
                    $jqueryui_format .= $SYMBOLS_MATCHING[$char];
                } else {
                    $jqueryui_format .= $char;
                }
            }
        }
        return $jqueryui_format;
    }

    /**
     * @return mixed
     */
    public function getDateFormat()
    {
        $dateFormat = $this->getOption(self::CONFIG_DATE_FORMAT);
        if (empty($dateFormat)) {
            $dateFormat = $this->timeZone->getDateFormat(\IntlDateFormatter::SHORT);
        }
        return $dateFormat;
    }

    public function getDateFormatJQueryUi()
    {
        return $this->convertDateFormatToJQueryUi(
            $this->getDateFormat()
        );
    }

    // /**
    //  * @return mixed
    //  */
    // public function getDisplayArea()
    // {
    //     return $this->scopeConfig->getValue(self::CONFIG_DISPLAY_AREA, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
    // }

    /**
     * @return string
     */
    public function getFieldLabel()
    {
        return $this->getOption(self::CONFIG_FIELD_LABEL);
    }

    /**
     * @return bool
     */
    public function getIsUseCalendar()
    {
        return (bool) $this->getOption(self::CONFIG_USE_CALENDAR);
    }

    /**
     * @return bool
     */
    public function getIsUseDefaultDateValue()
    {
        return (bool) $this->getOption(self::CONFIG_USE_DEFAULT_DATE_VALUE);
    }

    /**
     * @return bool
     */
    public function getIsFieldRequired()
    {
        return (bool) $this->getOption(self::CONFIG_FIELD_REQUIRED);
    }

    protected function timestamps($years = [], $months = [], $days = [], $offset = 1)
    {
        if (0 == $years) {
            $_year = date("Y");
            $years = range($_year - 1, $_year + 6);
        }
        if (!is_array($years)) {
            $years = [$years];
        }
        if (0 == $months) {
            $months = range(1, 12);
        }
        if (!is_array($months)) {
            $months = [$months];
        }
        if (!is_array($days)) {
            $days = [$days];
        }
        $offset = (int) $offset;
        $result = [];
        foreach ($years as $year) {
            foreach ($months as $month) {
                foreach ($days as $day) {
                    for ($i = 0; $i < $offset; $i++) {
                        $result[] = strtotime(
                            $year  . '-' . $month . '-' . $day . ' +' . $i . ' days'
                        ) * 1000;
                    }
                }
            }
        }
        return $result;
    }

    /**
     * @return array
     */
    public function getHolidays()
    {
        $_holidays = $this->getOption(self::CONFIG_HOLIDAYS);
        $_holidays = unserialize($_holidays);
        if (!$_holidays) {
            return [];
        }
        $holidays = [];
        foreach ($_holidays as $_h) {
            if (isset($_h['day']) && isset($_h['month']) && isset($_h['year'])) {
                $offset = isset($_h['offset']) && 0 != $_h['offset'] ? $_h['offset'] : 1;
                $holidays = array_merge($holidays, $this->timestamps(
                    $_h['year'],
                    $_h['month'],
                    $_h['day'],
                    $offset
                ));
            }
        }
        $holidays = array_filter($holidays);
        $holidays = array_unique($holidays);
        return $holidays;
    }

    /**
     * @return bool
     */
    public function getShippingMethods()
    {
        return $this->getOption(self::CONFIG_SHIPPING_METHODS);
    }


    /**
     * @return bool
     */
    public function getIsFilterPerShippingMethod()
    {
        return (bool) $this->getOption(self::CONFIG_FILTER_PER_SHIPPING_METHOD);
    }
}
