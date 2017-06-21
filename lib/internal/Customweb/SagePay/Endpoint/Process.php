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
 */

//require_once 'Customweb/Core/DateTime.php';
//require_once 'Customweb/Payment/Endpoint/Controller/Abstract.php';
//require_once 'Customweb/I18n/Translation.php';
//require_once 'Customweb/SagePay/Util.php';
//require_once 'Customweb/Core/Http/Response.php';


/**
 *
 * @author Mathis Kappeler
 * @Controller("process")
 *
 */
class Customweb_SagePay_Endpoint_Process extends Customweb_Payment_Endpoint_Controller_Abstract {
	const PARAMETER_STORAGE_SPACE = 'SagePay_Parameters';

	/**
	 * @Action("server")
	 */
	public function processServer(Customweb_Payment_Authorization_ITransaction $transaction, Customweb_Core_Http_IRequest $request){
		$adapter = $this->getAdapterFactory()->getAuthorizationAdapterByName($transaction->getAuthorizationMethod());
		$parameters = $request->getParameters();
		$response = $adapter->processAuthorization($transaction, $parameters);
		return $response;
	}

	/**
	 * @Action("authorize")
	 */
	public function processAuthorize(Customweb_Payment_Authorization_ITransaction $transaction, Customweb_Core_Http_IRequest $request){
		$adapter = $this->getAdapterFactory()->getAuthorizationAdapterByName($transaction->getAuthorizationMethod());
		$parameters = $request->getParameters();
		if (!isset($parameters['cw_hash'])) {
			throw new Exception(Customweb_I18n_Translation::__('No signature provided.'));
		}
		$transaction->checkSecuritySignature('process/authorize', $parameters['cw_hash']);
		$stored = $this->getStorageAdapter()->read(self::PARAMETER_STORAGE_SPACE, $transaction->getTransactionId());
		$response = $adapter->processAuthorization($transaction, $stored);
		return $response;
	}

	/**
	 *
	 * @Action("fast")
	 */
	public function processFast(Customweb_Payment_Authorization_ITransaction $transaction, Customweb_Core_Http_IRequest $request){
		$storageAdapter = $this->getStorageAdapter();
		$parameters = $request->getParameters();
		$storageAdapter->write(self::PARAMETER_STORAGE_SPACE, $transaction->getTransactionId(), $parameters);
		$transaction->setUpdateExecutionDate(Customweb_Core_DateTime::_()->addMinutes(10));
		return $this->getRedirectResponse($transaction);
	}

	/**
	 * 
	 * @return Customweb_Storage_IBackend
	 */
	protected function getStorageAdapter(){
		return $this->getContainer()->getBean('Customweb_Storage_IBackend');
	}

	protected function getRedirectResponse(Customweb_SagePay_Authorization_Transaction $transaction){
		$transaction->setUpdateExecutionDate(Customweb_Core_DateTime::_()->addMinutes(15));
		$redirectionUrl = $this->getContainer()->getBean('Customweb_Payment_Endpoint_IAdapter')->getUrl("process", "authorize", 
				array(
					'cw_transaction_id' => $transaction->getExternalTransactionId(),
					'cw_hash' => $transaction->getSecuritySignature('process/authorize') 
				));
		
		$parameters = array();
		$parameters['Status'] = 'OK';
		$parameters['RedirectURL'] = $redirectionUrl;
		
		return Customweb_Core_Http_Response::_(Customweb_SagePay_Util::parseToCRLF($parameters));
	}
}