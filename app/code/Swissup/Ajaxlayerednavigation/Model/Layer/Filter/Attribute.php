<?php
namespace Swissup\Ajaxlayerednavigation\Model\Layer\Filter;

use Swissup\Ajaxlayerednavigation\Model\Layer\Filter\DefaultFilter;
use Swissup\Ajaxlayerednavigation\Model\Layer\Filter\ItemFactory;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Catalog\Model\Layer;
use Swissup\Ajaxlayerednavigation\Model\Layer\Filter\Item\Builder;
use Swissup\Ajaxlayerednavigation\Model\ResourceModel\Layer\Filter\AttributeFactory;
use Magento\Framework\Filter\StripTags;
use Magento\Framework\Stdlib\StringUtils;
use Swissup\Ajaxlayerednavigation\Helper\Search as SearchHelper;

class Attribute extends DefaultFilter
{
    private $tagFilter;
    public $appliyedFilter;
    public $filterPlus;
    public $serchHelper;

    public function __construct(
        ItemFactory $filterItemFactory,
        StoreManagerInterface $storeManager,
        Layer $layer,
        Builder $itemBuilder,
        AttributeFactory $attributeFactory,
        StringUtils $string,
        StripTags $tagFilter,
        SearchHelper $serchHelper,
        array $data = []
    ) {
        $this->_resourceModel = $attributeFactory->create();
        $this->string = $string;
        $this->_requestVar = 'attribute';
        $this->tagFilter = $tagFilter;
        $this->appliedFilter = [];
        $this->filterPlus = false;
        $this->serchHelper = $serchHelper;
        parent::__construct($filterItemFactory, $storeManager, $layer, $itemBuilder, $data);
    }

    protected function _getResource()
    {
        return $this->_resourceModel;
    }

    public function getSearchIds()
    {
        return $this->serchHelper->search();
    }

    public function apply(\Magento\Framework\App\RequestInterface $request)
    {
        $filter = $request->getParam($this->_requestVar);
        if (!$filter || is_array($filter) ) {
            return $this;
        }

        $this->appliedFilter = $filter;
        $filters = explode(',', $filter);

        if (!$this->filterPlus) {
            $this->filterPlus = true;
        }

        $attribute = $this->getAttributeModel();
        $productCollection = $this->getLayer()->getProductCollection();
        // apply filtter to collection
        $productCollection->addFieldToFilter($attribute->getAttributeCode(), ["finset" => $filters]);

        foreach ($filters as $option) {
            $text = $this->getOptionText($option);
            if ($option && strlen($text)) {
                $this->getLayer()->getState()->addFilter(
                    $this->_createItem($text, $option)
                );
            }
        }

        return $this;
    }

    protected function _getFilterItemsCount()
    {
        $attribute = $this->getAttributeModel();
        $attributeId = $attribute->getAttributeId();
        $this->_requestVar = $attribute->getAttributeCode();
        $attributeOptions = $attribute->getFrontend()->getSelectOptions();
        $optionsCount = $this->_getResource()->getCount($this, $this->getStateDataForCount());
        $count = [];
        foreach($optionsCount as $optionId => $option) {
            $count[$attributeId][$optionId] = $option;
        }

        return $count;
    }

    public function getStateDataForCount()
    {
        $filters = [];
        $tmp = [];
        $stateFilters = $this->getLayer()->getState()->getFilters();
        foreach ($stateFilters as $item) {
            if ($item->getFilter()->hasAttributeModel()) {
                $attribute = $item->getFilter()->getAttributeModel();
                $tmp[$attribute->getAttributeId()][] = [
                    'code' => $attribute->getAttributeCode(),
                    'value' => $item->getValue()
                ];
            }
        }
        foreach ($tmp as $id => $attData) {
            $values = [];
            foreach ($attData as $option) {
                $code = $option['code'];
                $values[] = $option['value'];
            }
            $filters[] = [
                'id' => $id,
                'code' => $code,
                'values' => $values
            ];
        }

        return $filters;
    }

    public function isActive()
    {
        return $this->filterPlus;
    }

    protected function _getItemsData()
    {
        $attribute = $this->getAttributeModel();
        $attributeId = $attribute->getAttributeId();
        $this->_requestVar = $attribute->getAttributeCode();
        $options = $attribute->getFrontend()->getSelectOptions();
        $attributeOptionProducts = $this->_getFilterItemsCount();
        $optionsCount = [];
        if (array_key_exists($attributeId, $attributeOptionProducts)) {
            $optionsCount = $attributeOptionProducts[$attributeId];
        }

        $activeFilters = [];
        if($this->appliedFilter) {
            $activeFilters = explode(',', $this->appliedFilter);
        }

        $productCollection = $this->getLayer()->getProductCollection();
        $currentProductIds = $productCollection->getAllIds();

        foreach ($options as $option) {
            if (empty($option['value'])) {
                continue;
            }
            $active = in_array($option['value'], $activeFilters);
            // Check filter type
            if ($this->getAttributeIsFilterable($attribute) == self::ATTRIBUTE_OPTIONS_ONLY_WITH_RESULTS) {
                if (!empty($optionsCount[$option['value']])) {
                    $optionProducts = explode(',', $optionsCount[$option['value']]);
                    $optionProducts = array_unique($optionProducts);
                    if (!$this->filterPlus) {
                        $count = count($optionProducts);
                    } else {
                        $result = array_diff($optionProducts, $currentProductIds);
                        $count = count($result);
                    }

                    $this->_itemBuilder->addItemData(
                        $this->tagFilter->filter($option['label']),
                        $option['value'],
                        $count,
                        $active,
                        $this->filterPlus
                    );
                }
            } else {
                $this->_itemBuilder->addItemData(
                    $this->tagFilter->filter($option['label']),
                    $option['value'],
                    isset($optionsCount[$option['value']]) ? $optionsCount[$option['value']] : 0,
                    $active,
                    $this->filterPlus
                );
            }
        }

        return $this->_itemBuilder->build();
    }
}
