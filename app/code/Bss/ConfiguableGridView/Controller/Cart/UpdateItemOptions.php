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

class UpdateItemOptions extends \Magento\Checkout\Controller\Cart\UpdateItemOptions
{
	public function execute()
	{
		$id = (int)$this->getRequest()->getParam('id');
		$params = $this->getRequest()->getParams();

		if(isset($params['configurable_grid_table']) && $params['configurable_grid_table'] == 'Yes') {
			if (!isset($params['options'])) {
				$params['options'] = [];
			}
			try {
				$storeId = $this->_objectManager->get('Magento\Store\Model\StoreManagerInterface')->getStore()->getId();
				foreach ($params['config_table_qty'] as $id => $qty) {
					if(isset($qty)) {

						$data = array();
						$filter = new \Zend_Filter_LocalizedToNormalized(
							['locale' => $this->_objectManager->get('Magento\Framework\Locale\ResolverInterface')->getLocale()]
							);
						$data['super_attribute'] = $params['bss_super_attribute'][$id];
						$data['options'] = $params['options'];
						$data['qty'] = $filter->filter($qty);

						if($params['quote_item_id'][$id] != '') {
							$quoteItem = $this->cart->getQuote()->getItemById($params['quote_item_id'][$id]);
							if (!$quoteItem) {
								throw new \Magento\Framework\Exception\LocalizedException(__('We can\'t find the quote item.'));
							}
							if($data['qty'] != '' && $data['qty'] > 0) {
								$item = $this->cart->updateItem($params['quote_item_id'][$id], new \Magento\Framework\DataObject($data));
							}else {
								$item = $this->cart->removeItem($params['quote_item_id'][$id]);
							}
							if (is_string($item)) {
								throw new \Magento\Framework\Exception\LocalizedException(__($item));
							}
							if ($item->getHasError()) {
								throw new \Magento\Framework\Exception\LocalizedException(__($item->getMessage()));
							}
						}else {
							if($data['qty'] != '' && $data['qty'] > 0) {
								$product = $this->_objectManager->create('Magento\Catalog\Model\Product')->setStoreId($storeId)->load($params['product']);
								if (!$product) {
									return $this->goBack();
								}
								$this->cart->addProduct($product, $data);
							}
						}
					}
				}

				$related = $this->getRequest()->getParam('related_product');
				if (!empty($related)) {
					$this->cart->addProductsByIds(explode(',', $related));
				}

				$this->cart->save();

				$this->_eventManager->dispatch(
					'checkout_cart_update_item_complete',
					['item' => $item, 'request' => $this->getRequest(), 'response' => $this->getResponse()]
					);
				if (!$this->_checkoutSession->getNoCartRedirect(true)) {
					if (!$this->cart->getQuote()->getHasError()) {
						$message = __(
							'%1 was updated in your shopping cart.',
							$this->_objectManager->get('Magento\Framework\Escaper')
							->escapeHtml($quoteItem->getProduct()->getName())
							);
						$this->messageManager->addSuccess($message);
					}
					return $this->_goBack($this->_url->getUrl('checkout/cart'));
				}
			} catch (\Magento\Framework\Exception\LocalizedException $e) {
				if ($this->_checkoutSession->getUseNotice(true)) {
					$this->messageManager->addNotice($e->getMessage());
				} else {
					$messages = array_unique(explode("\n", $e->getMessage()));
					foreach ($messages as $message) {
						$this->messageManager->addError($message);
					}
				}

				$url = $this->_checkoutSession->getRedirectUrl(true);
				if ($url) {
					return $this->resultRedirectFactory->create()->setUrl($url);
				} else {
					$cartUrl = $this->_objectManager->get('Magento\Checkout\Helper\Cart')->getCartUrl();
					return $this->resultRedirectFactory->create()->setUrl($this->_redirect->getRedirectUrl($cartUrl));
				}
			} catch (\Exception $e) {
				$this->messageManager->addException($e, __('We can\'t update the item right now.'));
				$this->_objectManager->get('Psr\Log\LoggerInterface')->critical($e);
				return $this->_goBack();
			}
			return $this->resultRedirectFactory->create()->setPath('*/*');
		}else {
			return parent::execute();
		}
	}
}