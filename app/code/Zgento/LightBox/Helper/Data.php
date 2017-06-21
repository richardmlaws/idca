<?php

namespace Zgento\LightBox\Helper;

class Data extends \Magento\Framework\App\Helper\AbstractHelper
{

    public function __construct(
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
        ) {
        $this->_scopeConfig = $scopeConfig;
    }

	public function getConfig($config_path, $store = null){
		return $this->_scopeConfig->getValue(
                    $config_path,
                    \Magento\Store\Model\ScopeInterface::SCOPE_STORE,
                    $store
                );
	}

}
