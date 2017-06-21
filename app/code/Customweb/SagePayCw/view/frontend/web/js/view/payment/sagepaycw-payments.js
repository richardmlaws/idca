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
define(
    [
        'uiComponent',
        'Magento_Checkout/js/model/payment/renderer-list'
    ],
    function (
        Component,
        rendererList
    ) {
        'use strict';
        rendererList.push(
        	
			{
			    type: 'sagepaycw_sagepay',
			    component: 'Customweb_SagePayCw/js/view/payment/method-renderer/sagepaycw_sagepay-method'
			},
			{
			    type: 'sagepaycw_creditcard',
			    component: 'Customweb_SagePayCw/js/view/payment/method-renderer/sagepaycw_creditcard-method'
			},
			{
			    type: 'sagepaycw_visa',
			    component: 'Customweb_SagePayCw/js/view/payment/method-renderer/sagepaycw_visa-method'
			},
			{
			    type: 'sagepaycw_mastercard',
			    component: 'Customweb_SagePayCw/js/view/payment/method-renderer/sagepaycw_mastercard-method'
			},
			{
			    type: 'sagepaycw_debitmastercard',
			    component: 'Customweb_SagePayCw/js/view/payment/method-renderer/sagepaycw_debitmastercard-method'
			},
			{
			    type: 'sagepaycw_maestro',
			    component: 'Customweb_SagePayCw/js/view/payment/method-renderer/sagepaycw_maestro-method'
			},
			{
			    type: 'sagepaycw_visaelectron',
			    component: 'Customweb_SagePayCw/js/view/payment/method-renderer/sagepaycw_visaelectron-method'
			},
			{
			    type: 'sagepaycw_americanexpress',
			    component: 'Customweb_SagePayCw/js/view/payment/method-renderer/sagepaycw_americanexpress-method'
			},
			{
			    type: 'sagepaycw_diners',
			    component: 'Customweb_SagePayCw/js/view/payment/method-renderer/sagepaycw_diners-method'
			},
			{
			    type: 'sagepaycw_jcb',
			    component: 'Customweb_SagePayCw/js/view/payment/method-renderer/sagepaycw_jcb-method'
			},
			{
			    type: 'sagepaycw_lasercard',
			    component: 'Customweb_SagePayCw/js/view/payment/method-renderer/sagepaycw_lasercard-method'
			},
			{
			    type: 'sagepaycw_paypal',
			    component: 'Customweb_SagePayCw/js/view/payment/method-renderer/sagepaycw_paypal-method'
			}
        );
        /** Add view logic here if needed */
        return Component.extend({});
    }
);