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
 *
 * @category	Customweb
 * @package		Customweb_SagePayCw
 * 
 */

namespace Customweb\SagePayCw\Model\Config\Source\Paypal;

class Currency implements \Magento\Framework\Option\ArrayInterface
{
	/**
	 * @return array
	 */
	public function toOptionArray()
	{
		return [
			['value' => 'AUD', 'label' => __('Australian dollar (AUD)')],
			['value' => 'CAD', 'label' => __('Canadian dollar (CAD)')],
			['value' => 'CHF', 'label' => __('Swiss franc (CHF)')],
			['value' => 'CZK', 'label' => __('Czech koruna (CZK)')],
			['value' => 'DKK', 'label' => __('Danish krone (DKK)')],
			['value' => 'EUR', 'label' => __('Euro (EUR)')],
			['value' => 'GBP', 'label' => __('Pound sterling (GBP)')],
			['value' => 'HKD', 'label' => __('Hong Kong dollar (HKD)')],
			['value' => 'JPY', 'label' => __('Japanese yen (JPY)')],
			['value' => 'NOK', 'label' => __('Norwegian krone (NOK)')],
			['value' => 'NZD', 'label' => __('New Zealand dollar (NZD)')],
			['value' => 'SEK', 'label' => __('Swedish krona (SEK)')],
			['value' => 'SGD', 'label' => __('Singapore dollar (SGD)')],
			['value' => 'USD', 'label' => __('United States dollar (USD)')],
			['value' => 'ZAR', 'label' => __('South African rand (ZAR)')],
			['value' => 'UAH', 'label' => __('Ukrainian hryvnia (UAH)')],
			['value' => 'TRY', 'label' => __('Turkish lira (TRY)')],
			['value' => 'THB', 'label' => __('Thai baht (THB)')],
			['value' => 'RUB', 'label' => __('Russian rouble (RUB)')],
			['value' => 'PLN', 'label' => __('Polish złoty (PLN)')],
			['value' => 'MYR', 'label' => __('Malaysian ringgit (MYR)')],
			['value' => 'MXN', 'label' => __('Mexican peso (MXN)')],
			['value' => 'INR', 'label' => __('Indian rupee (INR)')],
			['value' => 'IDR', 'label' => __('Indonesian rupiah (IDR)')],
			['value' => 'CNY', 'label' => __('Chinese yuan (CNY)')],
			['value' => 'CLP', 'label' => __('Chilean peso (CLP)')],
			['value' => 'BRL', 'label' => __('Brazilian real (BRL)')],
			['value' => 'ARS', 'label' => __('Argentine peso (ARS)')],
			['value' => 'AED', 'label' => __('United Arab Emirates dirham (AED)')],
		];
	}
}
