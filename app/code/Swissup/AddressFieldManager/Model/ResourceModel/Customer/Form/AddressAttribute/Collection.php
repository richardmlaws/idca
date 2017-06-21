<?php

namespace Swissup\AddressFieldManager\Model\ResourceModel\Customer\Form\AddressAttribute;

use Magento\Customer\Model\ResourceModel\Form\Attribute\Collection as CustomerFormAttributeCollection;

class Collection extends CustomerFormAttributeCollection
{
    protected function _initSelect()
    {
        parent::_initSelect();

        $this->setEntityType('customer_address')
            ->addFormCodeFilter('customer_register_address')
            ->addFieldToFilter('frontend_input', ['neq' => 'hidden']);

        return $this;
    }
}
