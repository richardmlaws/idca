<?php
namespace Swissup\Ajaxlayerednavigation\Block\Navigation;

use Magento\Framework\View\Element\Template;
use Swissup\Ajaxlayerednavigation\Model\Layer\CatalogLayerLoader;
use Magento\LayeredNavigation\Block\Navigation\State as DefaultState;

class State extends DefaultState
{

    public function getAppliedFilters()
    {
        $filters = $this->getLayer()->getState()->getFilters();
        if (!is_array($filters)) {
            $filters = [];
        }
        return $filters;
    }

    public function getClearUrl()
    {
        $filters = [];
        foreach ($this->getAppliedFilters() as $appliedFilter) {
            $filters[
                $appliedFilter->getFilter()->getRequestVar()
            ] = $appliedFilter->getFilter()->getCleanValue();
        }

        return $this->_urlBuilder->getUrl('*/*/*', [
                "_current" => true,
                "_use_rewrite" => true,
                "_escape" => true,
                "_query" => $filters,
            ]
        );
    }

    // public function getLayer()
    // {
    //     if (!$this->hasData('layer')) {
    //         $this->setLayer($this->_layer);
    //     }
    //     return $this->_getData('layer');
    // }
}
