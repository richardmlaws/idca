<?php
namespace Swissup\AddressAutocomplete\Model\Config\Source;

class StreetNumberPlacement implements \Magento\Framework\Option\ArrayInterface
{
    /**
     * Options getter
     *
     * @return array
     */
    public function toOptionArray()
    {
        return [
            ['value' => 'line1_start', 'label' => __('Address Line 1 Start')],
            ['value' => 'line1_end', 'label' => __('Address Line 1 End')],
            ['value' => 'line2', 'label' => __('Address Line 2')],
        ];
    }

    /**
     * Get options in "key-value" format
     *
     * @return array
     */
    public function toArray()
    {
        return [
            'line1_start' => __('Address Line 1 Start'),
            'line1_end' => __('Address Line 1 End'),
            'line2' => __('Address Line 2'),
        ];
    }
}
