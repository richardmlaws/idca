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

namespace Customweb\SagePayCw\Model\Asset;

class CompositeResolver extends \Customweb_Asset_Resolver_Composite
{
	/**
	 * @param \Customweb\SagePayCw\Model\Asset\TemplateResolver $templateResolver
	 * @param \Customweb\SagePayCw\Model\Asset\JavascriptResolver $javascriptResolver
	 * @param \Customweb\SagePayCw\Model\Asset\CssResolver $cssResolver
	 * @param \Customweb\SagePayCw\Model\Asset\ImageResolver $imageResolver
	 * @param \Customweb\SagePayCw\Model\Asset\MediaResolver $mediaResolver
	 */
	public function __construct(
			\Customweb\SagePayCw\Model\Asset\TemplateResolver $templateResolver,
			\Customweb\SagePayCw\Model\Asset\JavascriptResolver $javascriptResolver,
			\Customweb\SagePayCw\Model\Asset\CssResolver $cssResolver,
			\Customweb\SagePayCw\Model\Asset\ImageResolver $imageResolver,
			\Customweb\SagePayCw\Model\Asset\MediaResolver $mediaResolver
	) {
		parent::__construct([
			$templateResolver,
			$javascriptResolver,
			$cssResolver,
			$imageResolver,
			$mediaResolver
		]);
	}
}