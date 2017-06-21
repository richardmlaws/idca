<?php
namespace Swissup\Ajaxlayerednavigation\Helper;

use Magento\Framework\App\Helper\AbstractHelper;
use Magento\Store\Model\ScopeInterface;

class Config extends AbstractHelper
{
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Framework\Pricing\PriceCurrencyInterface $priceCurrency
    ) {
        $this->_storeManager  = $storeManager;
        $this->_priceCurrency = $priceCurrency;
        $this->_scopeConfig = $context->getScopeConfig();
        $this->request = $context->getRequest();
        $this->url = $context->getUrlBuilder();
        parent::__construct($context);
    }

    public function getPriceCurrencyPos()
    {
        $currency = $this->_priceCurrency->getCurrency();
        $symbol = $currency->getCurrencySymbol();
        $tmpPrice = $currency->format(0);
        if (strpos($symbol, $tmpPrice) > 0) {
            $prefix = '';
            $postfix = ' '.$symbol;
        } else {
            $prefix = $symbol;
            $postfix = '';
        }

        return ['prefix' => $prefix, 'postfix' => $postfix];
    }

    public function getClearAllUrl()
    {
        $searchQuery = $this->request->getParam('q');
        $query = [
            '_' => null
        ];

        if ($this->iaAjaxEnable()) {
            $query['aln'] = 1;
        }
        if ($searchQuery) {
            $query['q'] = $searchQuery;
        }

        return $this->url->getUrl('*/*/*',
            [
                '_use_rewrite' => true,
                '_query' => $query
            ]
        );
    }
    public function iaAjaxEnable()
    {
        return $this->_scopeConfig->getValue(
            "ajaxlayerednavigation/general/use_ajax", ScopeInterface::SCOPE_STORE);
    }
}
