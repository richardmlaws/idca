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
namespace Bss\ConfiguableGridView\Controller\Cart;

class Add extends \Magento\Checkout\Controller\Cart\Add
{
	public function execute($coreRoute = null)
	{
		// if (!$this->_formKeyValidator->validate($this->getRequest())) {
		// 	return $this->resultRedirectFactory->create()->setPath('*/*/');
		// }

		$params = $this->getRequest()->getParams();

		if(isset($params['configurable_grid_table']) && $params['configurable_grid_table'] == 'Yes') {
			try {

				$related = $this->getRequest()->getParam('related_product');
				$storeId = $this->_objectManager->get('Magento\Store\Model\StoreManagerInterface')->getStore()->getId();
				$count = 0;
				foreach ($params['config_table_qty'] as $id => $qty) {
					if(isset($qty) && $qty != '' && $qty > 0) {

						$product = $this->_objectManager->create('Magento\Catalog\Model\Product')->setStoreId($storeId)->load($params['product']);
						if (!$product) {
							return $this->goBack();
						}

						$data = array();
						$filter = new \Zend_Filter_LocalizedToNormalized(
							['locale' => $this->_objectManager->get('Magento\Framework\Locale\ResolverInterface')->getLocale()]
							);
						$data['qty'] = $filter->filter($qty);
						$data['super_attribute'] = $params['bss_super_attribute'][$id];
						if(!empty($params['options'])) $data['options'] = $params['options'];

						$this->cart->addProduct($product, $data);
						
						$count++;
					} 
				}

				if (!empty($related)) {
					$this->cart->addProductsByIds(explode(',', $related));
				}

				if($count == 0 ) {
					$this->messageManager->addError(__('No items add to your shopping cart.'));
					return $this->goBack();

				}else {
					$this->cart->save();
					$this->_eventManager->dispatch(
						'checkout_cart_add_product_complete',
						['product' => $product, 'request' => $this->getRequest(), 'response' => $this->getResponse()]
						);
					if (!$this->_checkoutSession->getNoCartRedirect(true)) {
						if (!$this->cart->getQuote()->getHasError()) {
							$message = __(
								'You added %1 to your shopping cart.',
								$product->getName()
								);
							$this->messageManager->addSuccessMessage($message);
						}
						return $this->goBack(null, $product);
					}
				}

			} catch (\Magento\Framework\Exception\LocalizedException $e) {
				if ($this->_checkoutSession->getUseNotice(true)) {
					$this->messageManager->addNotice(
						$this->_objectManager->get('Magento\Framework\Escaper')->escapeHtml($e->getMessage())
						);
				} else {
					$messages = array_unique(explode("\n", $e->getMessage()));
					foreach ($messages as $message) {
						$this->messageManager->addError(
							$this->_objectManager->get('Magento\Framework\Escaper')->escapeHtml($message)
							);
					}
				}

				$url = $this->_checkoutSession->getRedirectUrl(true);

				if (!$url) {
					$cartUrl = $this->_objectManager->get('Magento\Checkout\Helper\Cart')->getCartUrl();
					$url = $this->_redirect->getRedirectUrl($cartUrl);
				}

				return $this->goBack($url);

			} catch (\Exception $e) {
				$this->messageManager->addException($e, __('We can\'t add this item to your shopping cart right now.'));
				$this->_objectManager->get('Psr\Log\LoggerInterface')->critical($e);
				return $this->goBack();
			}


		}else {
			return parent::execute($coreRoute);
		}        
	}
} 