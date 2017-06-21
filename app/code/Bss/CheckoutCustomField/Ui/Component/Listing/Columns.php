<?php
/**
 * BSS Commerce Co.
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the EULA
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://bsscommerce.com/Bss-Commerce-License.txt
 *
 * =================================================================
 *                 MAGENTO EDITION USAGE NOTICE
 * =================================================================
 * This package designed for Magento COMMUNITY edition
 * BSS Commerce does not guarantee correct work of this extension
 * on any other Magento edition except Magento COMMUNITY edition.
 * BSS Commerce does not provide extension support in case of
 * incorrect edition usage.
 * =================================================================
 *
 * @category   BSS
 * @package    Bss_CheckoutCustomField
 * @author     Extension Team
 * @copyright  Copyright (c) 2015-2016 BSS Commerce Co. ( http://bsscommerce.com )
 * @license    http://bsscommerce.com/Bss-Commerce-License.txt
 */
namespace Bss\CheckoutCustomField\Ui\Component\Listing;

use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Bss\CheckoutCustomField\Ui\Component\ColumnFactory;
use Magento\Framework\View\Element\UiComponentInterface;
use Magento\Customer\Api\CustomerMetadataInterface;

class Columns extends \Magento\Ui\Component\Listing\Columns
{
    /** @var int */
    protected $columnSortOrder;

    /** @var AttributeRepository  */
    protected $attributeRepository;

    protected $attribute;

    protected $attributeOptions;

    protected $orderRepository;

    /**
     * @var array
     */
    protected $filterMap = [
        'default' => 'text',
        'select' => 'select',
        'boolean' => 'select',
        'multiselect' => 'select',
        'date' => 'dateRange',
    ];

    /**
     * @param ContextInterface $context
     * @param ColumnFactory $columnFactory
     * @param AttributeRepository $attributeRepository
     * @param array $components
     * @param array $data
     */
    public function __construct(
        ContextInterface $context,
        ColumnFactory $columnFactory,
        array $components = [],
        \Bss\CheckoutCustomField\Model\Attribute $attribute,
        \Bss\CheckoutCustomField\Model\AttributeOption $attributeOption,
        \Magento\Sales\Api\OrderRepositoryInterface $orderRepository,
        array $data = []
    ) {
        parent::__construct($context, $components, $data);
        $this->attribute = $attribute;
        $this->attributeOption = $attributeOption;
        $this->columnFactory = $columnFactory;
        $this->orderRepository = $orderRepository;
    }

    protected function getListAttribute()
    {
        $attributes = $this->attribute->getCustomFieldAdminGird();
        $result = [];
        foreach ($attributes as $attribute) {
            if ($attribute->getFrontendInput() == 'date') {
                $options = [
                    'dateFormat' => 'm/d/Y'
                ];
            } elseif ($attribute->getFrontendInput() == 'boolean') {
                $options = [
                    ['value' => '0', 'label' => 'No'],
                    ['value' => '1', 'label' => 'Yes']
                ];
            } else {
                $options = $this->attributeOption->getAttributeOptions($attribute->getAttributeId(),0);
            }
            $attributeData = [
                'attribute_code' => $attribute->getAttributeCode(),
                'frontend_input' => $attribute->getFrontendInput(),
                'frontend_label' => $attribute->getBackendLabel(),
                'options' => $options,
                'show_gird' => $attribute->getShowGird(),
            ];
            $result[$attribute->getAttributeCode()] = $attributeData;
        }

        return $result;
    }

    /**
     * @return int
     */
    protected function getDefaultSortOrder()
    {
        $max = 0;
        foreach ($this->components as $component) {
            $config = $component->getData('config');
            if (isset($config['sortOrder']) && $config['sortOrder'] > $max) {
                $max = $config['sortOrder'];
            }
        }
        return ++$max;
    }

    /**
     * Update actions column sort order
     *
     * @return void
     */
    protected function updateActionColumnSortOrder()
    {
        if (isset($this->components['actions'])) {
            $component = $this->components['actions'];
            $component->setData(
                'config',
                array_merge($component->getData('config'), ['sortOrder' => ++$this->columnSortOrder])
            );
        }
    }

    /**
     * {@inheritdoc}
     */
    public function prepare()
    {
        
        $this->columnSortOrder = $this->getDefaultSortOrder();
        foreach ($this->getListAttribute() as $newAttributeCode => $attributeData) {
            $this->addColumn($attributeData, $newAttributeCode);
        }
        $this->updateActionColumnSortOrder();
        parent::prepare();
    }

    /**
     * @param array $attributeData
     * @param string $columnName
     * @return void
     */
    public function addColumn(array $attributeData, $columnName)
    {
        $config['sortOrder'] = ++$this->columnSortOrder;
        $config['filter'] = $this->getFilterType($attributeData['frontend_input']);
        $column = $this->columnFactory->create($attributeData, $columnName, $this->getContext(), $config);
        $column->prepare();
        $this->addComponent($attributeData['attribute_code'], $column);
    }

    /**
     * Retrieve filter type by $frontendInput
     *
     * @param string $frontendInput
     * @return string
     */
    protected function getFilterType($frontendInput)
    {
        return isset($this->filterMap[$frontendInput]) ? $this->filterMap[$frontendInput] : $this->filterMap['default'];
    }

    public function prepareDataSource(array $dataSource)
    {
        $data = $dataSource['data']['items'];
        foreach ($data as $key => $item) {
            $order = $this->orderRepository->get($item['entity_id']);
            $bssCusTomField = $order->getBssCustomFiled();
            if($bssCusTomField)
            {
                $dataSource['data']['items'][$key]['demo_text'] = "text";
            }            
        }
        return $dataSource;
    }
}
