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
define([
	'jquery',
	'mage/url',
	'Customweb_SagePayCw/js/checkout',
	'Customweb_SagePayCw/js/storage'
], function($, urlBuilder, Form, Storage){
	"use strict";
	
	/**
	 * Abstract Authorization Method Class
	 * 
	 * @param string formElement
	 * @param string authorizationUrl
	 */
	var AuthorizationMethod = function(formElement, authorizationUrl) {
		
		/**
		 * @return void
		 */
		this.redirect = function() {
			Storage.post(
				authorizationUrl, this.getFormValues()
            ).done(
        		function (response) {
        			if ($.type(response) === 'object' && !$.isEmptyObject(response)) {
                		if (response.redirect) {
                			window.location.replace(response.redirect);
                		} else {
                			var form = new Form(response.formActionUrl, response.hiddenFormFields);
                			form.submit();
                		}
                	}
        		}
            );
		}
		
		/**
		 * @return boolean
		 */
		this.formDataProtected = function() {
			return false;
		}
		
		/**
		 * @return object
		 */
		this.getFormValues = function() {
			return Form.getValues($(formElement), this.formDataProtected());
		}
		
		/**
		 * @return void
		 */
		this.authorize = function() {
			throw 'Not implemented';
		}
	}
	
	
	
	
	
	
	/**
	 * Iframe Authorization Method Class
	 * 
	 * @param string formElement
	 * @param string authorizationUrl
	 */
	AuthorizationMethod.IframeAuthorization = function(formElement, authorizationUrl) {
		AuthorizationMethod.call(this, formElement, authorizationUrl);
		
		/**
         * @override
         */
		this.authorize = function() {
			this.redirect();
		}
	}
	
	
	
	/**
	 * Payment Page Authorization Method Class
	 * 
	 * @param string formElement
	 * @param string authorizationUrl
	 */
	AuthorizationMethod.PaymentPage = function(formElement, authorizationUrl) {
		AuthorizationMethod.call(this, formElement, authorizationUrl);
		
		/**
         * @override
         */
		this.authorize = function() {
			this.redirect();
		}
	}
	
	
	
	/**
	 * Server Authorization Method Class
	 * 
	 * @param string formElement
	 * @param string authorizationUrl
	 */
	AuthorizationMethod.ServerAuthorization = function(formElement, authorizationUrl) {
		AuthorizationMethod.call(this, formElement, authorizationUrl);
		
		/**
         * @override
         */
		this.authorize = function() {
			var form = new Form(authorizationUrl, this.getFormValues());
			form.submit();
		}
	}
	
	
	
	
	/**
	 * Authorization Method Collection Function
	 * 
	 * @param string authorizationMethod
	 * @param string formElement
	 * @param string authorizationUrl
	 * @return AuthorizationMethod
	 */
	var Collection = function(authorizationMethod, formElement, authorizationUrl){
		if (!AuthorizationMethod[authorizationMethod]) {
			throw "No authorization method named '" + authorizationMethod + "' found.";
		}
		return new AuthorizationMethod[authorizationMethod](formElement, authorizationUrl);
	}
	
	return Collection;
});