<?php
namespace Swissup\Ajaxlayerednavigation\Model\Layer\Filter;

use Swissup\Ajaxlayerednavigation\Model\Layer\Filter\DefaultFilter;
use Swissup\Ajaxlayerednavigation\Model\Layer\Filter\ItemFactory;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Catalog\Model\Layer;
use Swissup\Ajaxlayerednavigation\Model\Layer\Filter\Item\Builder;
use Magento\Framework\Pricing\PriceCurrencyInterface;

class Price extends DefaultFilter
{
    public $appliyedFilter;
    public $filterPlus;

    public function __construct(
        ItemFactory $filterItemFactory,
        StoreManagerInterface $storeManager,
        Layer $layer,
        Builder $itemBuilder,
        PriceCurrencyInterface $priceCurrency,
        array $data = []
    ) {
        $this->_requestVar = 'price';
        $this->appliedFilter = [];
        $this->priceCurrency = $priceCurrency;
        parent::__construct($filterItemFactory, $storeManager, $layer, $itemBuilder, $data);
    }

    public function getMinPrice()
    {
        $productCollection = $this->getLayer()->getProductCollection();
        return $productCollection->getMinPrice();
    }

    public function getMaxPrice()
    {
        $productCollection = $this->getLayer()->getProductCollection();
        return $productCollection->getMaxPrice();
    }

    public function apply(\Magento\Framework\App\RequestInterface $request)
    {
        $priceFilter = $request->getParam(
            $this->getRequestVar()
        );

        if (!$priceFilter || is_array($priceFilter)) {
            return $this;
        }
        if (!$this->filterPlus) {
            $this->filterPlus = true;
        }
        $this->appliedFilter = $priceFilter;
        $priceFromTo = explode('-', $priceFilter);
        $from = $priceFromTo[0];
        $to = $priceFromTo[1];

        $this->getLayer()->getProductCollection()->addFieldToFilter(
            'price',
            ['from' => $from, 'to' =>  empty($to) || $from == $to ? $to : $to]
        );

        $this->getLayer()->getState()->addFilter(
            $this->_createItem(
                $this->_renderPriceLabel(empty($from) ? 0 : $from, $to), $priceFilter)
        );

        return $this;
    }

    protected function _renderPriceLabel($from, $to)
    {
        return __('%1 - %2', $this->priceCurrency->format($from), $this->priceCurrency->format($to));
    }

    protected function _getItemsData()
    {
        return [1];
    }

    public function isActive()
    {
        return $this->filterPlus;
    }
}
