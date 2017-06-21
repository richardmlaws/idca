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
* @package    Bss_ConfiguableGridView
* @author     Extension Team
* @copyright  Copyright (c) 2015-2016 BSS Commerce Co. ( http://bsscommerce.com )
* @license    http://bsscommerce.com/Bss-Commerce-License.txt
*/
namespace Bss\ConfiguableGridView\Helper;

class Data extends \Magento\Framework\App\Helper\AbstractHelper
{
	protected $_scopeConfig;
	public $_price;
	public $_currency;
	public $_registry;
	protected $_request;
	public $_customer;
	protected $_childPrices = null;

	public function __construct(
		\Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
		\Magento\Framework\Pricing\Helper\Data $price,
		\Magento\Directory\Model\Currency $currency,
		\Magento\Framework\Registry $registry,
		\Magento\Framework\App\RequestInterface $request,
		\Magento\Customer\Model\Session $customer
		) {
		$this->_scopeConfig = $scopeConfig;
		$this->_price = $price;
		$this->_currency = $currency;
		$this->_registry = $registry;
		$this->_request = $request;
		$this->_customer = $customer;
	}

	public function isEnabled() {
		$active =  $this->_scopeConfig->getValue('configuablegridview/general/active', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		if($active == 1) {
			$disabled_customer_group =  $this->_scopeConfig->getValue('configuablegridview/general/disabled_customer_group', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
			if($disabled_customer_group == '') return true;

			$disabled_customer_group =  explode(',',$this->_scopeConfig->getValue('configuablegridview/general/disabled_customer_group', \Magento\Store\Model\ScopeInterface::SCOPE_STORE));
			if( !in_array($this->_customer->getCustomerGroupId(), $disabled_customer_group) ) {
				return true;
			}
		}
		return false;
	}

	public function isShowConfig($config) {
		$active =  $this->_scopeConfig->getValue('configuablegridview/general/'.$config, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		if($active != 1) return false;

		return true;
	}

	public function canShowUnit() {
		$unit = $this->_scopeConfig->getValue('configuablegridview/general/unit_price', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
		
		if($unit == 1) return true;

		if($unit == 2 && (float)$this->getMaxPrice() != (float)$this->getMinPrice()) return true;

		return false; 
	}

	public function getDisplayPriceWithCurrency($price) {
		return $this->_price->currency($price, true, false);
	}

	public function getCurrencySymbol() {
		return $this->_currency->getCurrencySymbol();
	}

	public function getCurrentProduct(){		
		return $this->_registry->registry('current_product');
	}

	public function getMaxPrice() {
		if(is_null($this->_childPrices)) {
			$product = $this->_registry->registry('current_product');
			$childenProduct = $product->getTypeInstance()->getUsedProducts($product);
			$array = array();
			foreach ($childenProduct as $product) {
				$array[] = $product->getFinalPrice();
			}

			$this->_childPrices = $array;
		}
		
		return max($this->_childPrices);
	}

	public function getMinPrice() {
		if(is_null($this->_childPrices)) {
			$product = $this->_registry->registry('current_product');
			$childenProduct = $product->getTypeInstance()->getUsedProducts($product);
			$array = array();
			foreach ($childenProduct as $product) {
				$array[] = $product->getFinalPrice();
			}

			$this->_childPrices = $array;
		}

		return min($this->_childPrices);
	}

	public function getCurrentUrl() {
		return $this->_request->getModuleName().'_'.$this->_request->getControllerName().'_'.$this->_request->getActionName();
	}
}