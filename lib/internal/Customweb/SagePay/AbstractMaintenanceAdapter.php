<?php
/**
  * You are allowed to use this API in your web application.
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

//require_once 'Customweb/SagePay/AbstractAdapter.php';
//require_once 'Customweb/I18n/Translation.php';

abstract class Customweb_SagePay_AbstractMaintenanceAdapter extends Customweb_SagePay_AbstractAdapter
{
	
	protected function processServiceRequest($url, $parameters) {
		$response = Customweb_SagePay_Util::sendRequest(
			$url,
			$parameters
		);
		
		if (strtoupper($response['Status']) != 'OK') {
			throw new Exception(
				Customweb_I18n_Translation::__("Action failed with '!message'", array('!message' => $response['StatusDetail']))
			); 
		}
		
		return $response;
	}
}