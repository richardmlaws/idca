<?php

namespace M3\Tierprice\Model\Magento\Catalog\ResourceModel\Product\Attribute\Backend;


class Tierprice extends \Magento\Catalog\Model\ResourceModel\Product\Attribute\Backend\Tierprice
{
	 protected function _loadPriceDataColumns($columns)
    {
        $columns = parent::_loadPriceDataColumns($columns);
        $columns['price_qty'] = 'qty';
		$columns['isshow'] = 'isshow';
        return $columns; 
    }
	
}
	
	