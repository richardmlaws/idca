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
 * @category  BSS
 * @package   Bss_QuantityDropdown
 * @author    Extension Team
 * @copyright Copyright (c) 2015-2016 BSS Commerce Co. ( http://bsscommerce.com )
 * @license   http://bsscommerce.com/Bss-Commerce-License.txt
 */
namespace Bss\QuantityDropdown\Helper;

use \Magento\Framework\App\Helper\AbstractHelper;

class Data extends AbstractHelper
{
    protected $scopeConfig;
    protected $productFactory;
    
    public function __construct(
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \Magento\Catalog\Model\ProductFactory $productFactory
    ) {
        $this->scopeConfig=$scopeConfig;
        $this->productFactory = $productFactory;
    }

    public function getEnable()
    {
        return $this->scopeConfig->isSetFlag(
            'quantitydropdown/general/enable',
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    public function getDefaultValue()
    {
        return $this->scopeConfig->getValue(
            'quantitydropdown/general/value',
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    public function getDefaultMax()
    {
        return $this->scopeConfig->getValue(
            'quantitydropdown/general/max',
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    public function getCustom()
    {
        return $this->scopeConfig->getValue(
            'quantitydropdown/general/custom',
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    public function getDisplay()
    {
        return $this->scopeConfig->isSetFlag(
            'quantitydropdown/general/display',
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    public function getShow()
    {
        return $this->scopeConfig->getValue(
            'quantitydropdown/general/show',
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    public function getHide()
    {
        return $this->scopeConfig->getValue(
            'quantitydropdown/general/hide',
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    public function getProductItem($productId)
    {
        $product = $this->productFactory->create()->load($productId);
        return $product;
    }

    public function validCustom($custom)
    {
        foreach ($custom as $key => $value) {
            if (!is_numeric($value)) {
                unset($custom[$key]);
            }
        }
        return $custom;
    }
}
