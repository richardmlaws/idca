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
namespace Bss\CheckoutCustomField\Ui\Component;

use Bss\CheckoutCustomField\Api\Data\AttributeInterface as AttributeMetadata;

class ColumnFactory
{
    /** @var \Magento\Framework\View\Element\UiComponentFactory  */
    protected $componentFactory;

    /** @var array  */
    protected $jsComponentMap = [
        'text' => 'Magento_Ui/js/grid/columns/column',
        'select' => 'Magento_Ui/js/grid/columns/select',
        'date' => 'Magento_Ui/js/grid/columns/date',
    ];

    /** @var array  */
    protected $dataTypeMap = [
        'default' => 'text',
        'text' => 'text',
        'boolean' => 'select',
        'select' => 'select',
        'multiselect' => 'select',
        'date' => 'date',
    ];

    /**
     * @param \Magento\Framework\View\Element\UiComponentFactory $componentFactory
     */
    public function __construct(
        \Magento\Framework\View\Element\UiComponentFactory $componentFactory
    ) {
        $this->componentFactory = $componentFactory;
    }

    /**
     * @param array $attributeData
     * @param string $columnName
     * @param \Magento\Framework\View\Element\UiComponent\ContextInterface $context
     * @param array $config
     * @return \Magento\Ui\Component\Listing\Columns\ColumnInterface
     */
    public function create(array $attributeData, $columnName, $context, array $config = [])
    {
        $config = array_merge([
            'label' => __($attributeData[AttributeMetadata::BSS_FRONTEND_LABEL]),
            'dataType' => $this->getDataType($attributeData[AttributeMetadata::BSS_FRONTEND_INPUT]),
            'align' => 'left',
            'visible' => $this->getDataType($attributeData[AttributeMetadata::BSS_SHOW_GIRD]),
            "sortable" => true,
            'component' => $this->getJsComponent($this->getDataType($attributeData[AttributeMetadata::BSS_FRONTEND_INPUT])),
        ], $config);
        if ($attributeData[AttributeMetadata::BSS_FRONTEND_INPUT] == 'date') {
            $config['dateFormat'] = 'MMM d, y';
            $config['timezone'] = false;
        }
        if (!empty($attributeData['options']) && !isset($config['options'])) {
            $config['options'] = $attributeData['options'];
        }

        if ($attributeData['options']) {
            $config['options'] = $attributeData['options'];
        }
        $arguments = [
            'data' => [
                'js_config' => [
                    'component' => $this->getJsComponent($config['dataType']),
                ],
                'config' => $config,
            ],
            'context' => $context,
        ];
        $column = $this->componentFactory->create($columnName, 'column', $arguments);
        
        return $column;
    }

    /**
     * @param string $dataType
     * @return string
     */
    protected function getJsComponent($dataType)
    {
        return $this->jsComponentMap[$dataType];
    }

    /**
     * @param string $frontendType
     * @return string
     */
    protected function getDataType($frontendType)
    {
        return isset($this->dataTypeMap[$frontendType])
            ? $this->dataTypeMap[$frontendType]
            : $this->dataTypeMap['default'];
    }
}
