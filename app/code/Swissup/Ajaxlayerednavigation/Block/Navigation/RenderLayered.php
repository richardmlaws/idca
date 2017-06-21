<?php
namespace Swissup\Ajaxlayerednavigation\Block\Navigation;

use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;
use Magento\Eav\Model\Entity\Attribute;
use Magento\Eav\Model\Entity\Attribute\Option;
use Magento\Swatches\Helper\Data as SwatchesHelper;
use Magento\Swatches\Helper\Media as SwatchesMedia;
use Swissup\Ajaxlayerednavigation\Model\ResourceModel\Layer\Filter\AttributeFactory;
use Swissup\Ajaxlayerednavigation\Model\Layer\Filter\Item as FilterItem;

class RenderLayered extends Template
{
    protected $_template = 'Magento_Swatches::product/layered/renderer.phtml';

    public function __construct(
        Context $context,
        Attribute $eavAttributeModel,
        AttributeFactory $swissupAttribute,
        SwatchesHelper $swatchesHelper,
        SwatchesMedia $mediaHelper,
        array $data = []
    ) {
        $this->eavAttributeModel = $eavAttributeModel;
        $this->swissupAttribute = $swissupAttribute;
        $this->swatchesHelper = $swatchesHelper;
        $this->mediaHelper = $mediaHelper;

        parent::__construct($context, $data);
    }

    public function setSwatchFilter(\Swissup\Ajaxlayerednavigation\Model\Layer\Filter\DefaultFilter $swissupFilter)
    {
        $this->filterModel = $swissupFilter;
        $this->eavAttributeModel = $swissupFilter->getAttributeModel();

        return $this;
    }

    public function getSwatchData()
    {
        $isAttributeModel = $this->eavAttributeModel instanceof Attribute;
        if (false === $isAttributeModel) {
            throw new \RuntimeException('Attribute model has not been set.');
        }

        $attrOptions = [];
        foreach ($this->eavAttributeModel->getOptions() as $option) {
            if ($current = $this->getCurrentOption($this->filterModel->getItems(), $option)) {
                $attrOptions[$option->getValue()] = $current;
            } elseif ($this->isShowEmpty()) {
                $attrOptions[$option->getValue()] = $this->getIsUnused($option);
            }
        }

        $optionIds = array_keys($attrOptions);
        $swatchesData = $this->swatchesHelper->getSwatchesByOptionsId($optionIds);

        $data = [
            'attribute_id' => $this->eavAttributeModel->getId(),
            'attribute_code' => $this->eavAttributeModel->getAttributeCode(),
            'attribute_label' => $this->eavAttributeModel->getStoreLabel(),
            'options' => $attrOptions,
            'swatches' => $swatchesData,
        ];

        return $data;
    }

    public function buildUrl($code, $id)
    {
        return $this->_urlBuilder->getUrl(
            '*/*/*',
            [
                '_current' => true,
                '_use_rewrite' => true,
                '_query' => [$code => $id]
            ]
        );
    }

    protected function getIsUnused(Option $option)
    {
        return [
            'label' => $option->getLabel(),
            'link' => 'javascript:void();',
            'custom_style' => 'disabled'
        ];
    }

    protected function getCurrentOption(array $items, Option $option)
    {
        $result = false;
        $item = $this->getFilterItemById($items, $option->getValue());
        if ($item && $this->isOptionVisible($item)) {
            $result = $this->getViewData($item, $option);
        }

        return $result;
    }

    protected function getViewData(FilterItem $item, Option $option)
    {
        $custom = '';
        $code = $this->eavAttributeModel->getAttributeCode();
        $value = $item->getValue();
        $optionLink = $this->buildUrl($code, $value);
        if ($this->isDisabled($item)) {
            $custom = 'disabled';
            $optionLink = 'javascript:void();';
        }

        return [
            'label' => $option->getLabel(),
            'link' => $optionLink,
            'custom_style' => $custom
        ];
    }

    protected function isOptionVisible(FilterItem $filterItem)
    {
        return $this->isDisabled($filterItem) && $this->isShowEmpty() ? false : true;
    }

    protected function isShowEmpty()
    {
        return $this->eavAttributeModel->getIsFilterable() != 1;
    }

    protected function isDisabled(FilterItem $item)
    {
        return !$item->getCount();
    }

    protected function getFilterItemById(array $items, $id)
    {
        foreach ($items as $item) {
            if ($id == $item->getValue()) {
                return $item;
            }
        }
        return false;
    }

    public function getSwatchPath($type, $file)
    {
        return $this->mediaHelper->getSwatchAttributeImage($type, $file);
    }
}
