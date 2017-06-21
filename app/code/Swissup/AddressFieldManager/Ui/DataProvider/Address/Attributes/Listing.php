<?php

namespace Swissup\AddressFieldManager\Ui\DataProvider\Address\Attributes;

use Swissup\AddressFieldManager\Model\Config\Source\Status;
use Swissup\AddressFieldManager\Model\ResourceModel\Customer\Form\AddressAttribute\CollectionFactory;

class Listing extends \Magento\Ui\DataProvider\AbstractDataProvider
{
    /**
     * @param string $name
     * @param string $primaryFieldName
     * @param string $requestFieldName
     * @param CollectionFactory $collectionFactory
     * @param RequestInterface $request
     * @param array $meta
     * @param array $data
     */
    public function __construct(
        $name,
        $primaryFieldName,
        $requestFieldName,
        CollectionFactory $collectionFactory,
        array $meta = [],
        array $data = []
    ) {
        parent::__construct($name, $primaryFieldName, $requestFieldName, $meta, $data);
        $this->collection = $collectionFactory->create();
    }

    /**
     * {@inheritdoc}
     */
    public function getData()
    {
        $items = [];
        foreach ($this->getCollection()->getItems() as $attribute) {
            $values = $attribute->toArray();
            $values['status'] = Status::OPTIONAL;
            if (!$attribute->getIsVisible()) {
                $values['status'] = Status::HIDDEN;
            } elseif ($attribute->getIsRequired()) {
                $values['status'] = Status::REQUIRED;
            }

            switch ($attribute->getAttributeCode()) {
                case 'firstname':
                case 'lastname':
                    $values['comment'] = __('Name must be required.');
                    break;
                case 'country_id':
                    $values['comment'] = __('Country must be visible to keep Magento working.');
                    break;
                case 'region':
                    $values['comment'] = __('Use "Stores > Configuration > General > State" to change region field status');
                    break;
                case 'postcode':
                    $values['comment'] = __('Use "Stores > Configuration > General > Country Options" to change postcode status');
                    break;
            }

            $items[] = $values;
        }

        return [
            'totalRecords' => $this->collection->getSize(),
            'items' => $items
        ];
    }
}
