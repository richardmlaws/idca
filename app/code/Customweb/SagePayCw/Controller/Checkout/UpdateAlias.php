<?php

/**
 *  * You are allowed to use this API in your web application.
 *
 * Copyright (C) 2016 by customweb GmbH
 *
 * This program is licenced under the customweb software licence. With the
 * purchase or the installation of the software in your application you
 * accept the licence agreement. The allowed usage is outlined in the
 * customweb software licence which can be found under
 * http://www.sellxed.com/en/software-license-agreement
 *
 * Any modification or distribution is strictly forbidden. The license
 * grants you the installation in one application. For multiuse you will need
 * to purchase further licences at http://www.sellxed.com/shop.
 *
 * See the customweb software licence agreement for more details.
 *
 *
 * @category Customweb
 * @package Customweb_SagePayCw
 *
 */
namespace Customweb\SagePayCw\Controller\Checkout;

class UpdateAlias extends \Customweb\SagePayCw\Controller\Checkout {
	/**
	 *
	 * @var \Magento\Framework\Controller\Result\JsonFactory
	 */
	protected $_resultJsonFactory;
	
	/**
	 *
	 * @var \Magento\Payment\Helper\Data
	 */
	protected $_paymentHelper;
	
	/**
	 *
	 * @var \Customweb\SagePayCw\Model\Payment\Method\ConfigProvider
	 */
	protected $_configProvider;

	/**
	 *
	 * @param \Magento\Framework\App\Action\Context $context
	 * @param \Magento\Framework\View\Result\PageFactory $resultPageFactory
	 * @param \Magento\Checkout\Model\Session $checkoutSession
	 * @param \Magento\Quote\Api\CartRepositoryInterface $quoteRepository
	 * @param \Customweb\SagePayCw\Model\Authorization\TransactionFactory $transactionFactory
	 * @param \Customweb\SagePayCw\Model\Authorization\Method\Factory $authorizationMethodFactory
	 * @param \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory
	 * @param \Magento\Payment\Helper\Data $paymentHelper
	 * @param \Customweb\SagePayCw\Model\Payment\Method\ConfigProvider $configProvider
	 */
	public function __construct(\Magento\Framework\App\Action\Context $context, \Magento\Framework\View\Result\PageFactory $resultPageFactory, \Magento\Checkout\Model\Session $checkoutSession, \Magento\Quote\Api\CartRepositoryInterface $quoteRepository, \Customweb\SagePayCw\Model\Authorization\TransactionFactory $transactionFactory, \Customweb\SagePayCw\Model\Authorization\Method\Factory $authorizationMethodFactory, \Magento\Framework\Controller\Result\JsonFactory $resultJsonFactory, \Magento\Payment\Helper\Data $paymentHelper, \Customweb\SagePayCw\Model\Payment\Method\ConfigProvider $configProvider){
		parent::__construct($context, $resultPageFactory, $checkoutSession, $quoteRepository, $transactionFactory, $authorizationMethodFactory);
		$this->_resultJsonFactory = $resultJsonFactory;
		$this->_paymentHelper = $paymentHelper;
		$this->_configProvider = $configProvider;
	}

	public function execute(){
		$lastException = null;
		for ($i = 0; $i < 10; $i++) {
			try {
				$paymentMethod = $this->_paymentHelper->getMethodInstance($this->getRequest()->getParam('paymentMethod'));
				$result = [
					'html' => $this->_configProvider->getForm($paymentMethod) 
				];
				return $this->_resultJsonFactory->create()->setData($result);
			}
			catch (\Customweb\SagePayCw\Model\Exception\OptimisticLockingException $e) {
				// Try again.
				$lastException = $e;
			}
		}
		throw $lastException;
	}
}