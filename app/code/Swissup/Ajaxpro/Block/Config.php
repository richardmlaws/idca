<?php
/**
 * Copyright © 2016 Swissup. All rights reserved.
 */
namespace Swissup\Ajaxpro\Block;

use Magento\Store\Model\ScopeInterface;

class Config extends \Magento\Catalog\Block\Product\AbstractProduct
{
    const VALIDATION = 'ajaxpro/main/validation';

    /**
     *
     * @return bool
     */
    public function isForceValidation()
    {
        return (bool) $this->_scopeConfig->getValue(
            self::VALIDATION,
            ScopeInterface::SCOPE_STORE
        );
    }
}
