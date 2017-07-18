<?php
/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace edgesystems\CategoryView\Model\Category\Attribute\Source;
 
/**
 * Catalog category landing page attribute source
 *
 * @author      Magento Core Team <core@magentocommerce.com>
 */
class ShowMode extends \Magento\Eav\Model\Entity\Attribute\Source\AbstractSource
{
     public function getAllOptions()
    {
        if (!$this->_options) {
            $this->_options = [
                ['value' => \Magento\Catalog\Helper\Product\ProductList::VIEW_MODE_LIST, 'label' => __('List')],
                ['value' => \Magento\Catalog\Helper\Product\ProductList::VIEW_MODE_GRID, 'label' => __('Grid')],
            ];
        }
        return $this->_options;
    }
}