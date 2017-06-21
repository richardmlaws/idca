<?php
namespace Swissup\Ajaxlayerednavigation\Model\Layer\Filter\Item;

use Magento\Catalog\Model\Layer\Filter\Item\DataBuilder;

class Builder
{
    protected $_items = [];

    public function addItemData($label, $value, $count, $active, $plus)
    {
        $this->_items[] = [
            'label'  => $label,
            'value'  => $value,
            'count'  => $count,
            'active' => $active,
            'plus'   => $plus
         ];
    }

    public function build()
    {
        $items = $this->_items;
        $this->_items = [];
        return $items;
    }
}
