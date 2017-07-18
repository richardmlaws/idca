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
 * @category  BSS
 * @package   Bss_QuantityDropdown
 * @author    Extension Team
 * @copyright Copyright (c) 2015-2016 BSS Commerce Co. ( http://bsscommerce.com )
 * @license   http://bsscommerce.com/Bss-Commerce-License.txt
 */
namespace Bss\QuantityDropdown\Plugin;

use Magento\Framework\Exception\LocalizedException;
use Bss\QuantityDropdown\Helper\Data;
use Magento\Catalog\Model\ProductRepository;

class CheckBeforeAdd
{
    protected $helper;
    protected $quote;
    protected $request;
    protected $checkoutSession;


    public function __construct(
        Data $helper,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Framework\App\Request\Http $request,
        ProductRepository $productRepository
    ) {

        $this->helper = $helper;
        $this->request = $request;
        $this->_productRepository=$productRepository;
        $this->_checkoutSession = $checkoutSession;
        $this->quote = $checkoutSession->getQuote();
    }

    public function fixArr($before)
    {   
        $after="";
        foreach ($before as $key) {
            $after.=$key.',';
        }
        return $after;
    }

    public function beforeAddProduct($subject, $productInfo, $requestInfo = null)
    {

        $productId = $this->request->getParam('product', 0);
        $qty = $this->request->getParam('qty', 1);
        $productname=$this->helper->getProductItem($productId)->getName();
        $quantity_value=$this->helper->getProductItem($productId)->getData("quantity_value");
        $defaultcusvalue=$this->helper->getCustom();
        $defaultcustombf=explode(',', $defaultcusvalue);
        $defaultcustom=$this->helper->validCustom($defaultcustombf);
        $cusvalue=$this->helper->getProductItem($productId)->getData("custom_value");
        $cusbefore=explode(',', $cusvalue);
        $cus=$this->helper->validCustom($cusbefore);
        $type= $this->helper->getProductItem($productId)->getTypeId();

        if ($type== 'simple') {
            if ($this->helper->getEnable() &&
                $this->helper->getDefaultValue()==2 &&
                ($quantity_value==3 ||
                is_null($quantity_value))) {
                $error = true;

                foreach ($defaultcustom as $key) {
                    if ($key==$qty || $qty % $key == 0) {
                        $error=false;
                    }
                }

                if ($error) {
                    $product = $this->_productRepository->getById($productId);
                    $urlproduct = $product->getUrlModel()->getUrl($product);
                    $this->_checkoutSession->setRedirectUrl($urlproduct);
                    $custom="";
                    $custom=$this->fixArr($defaultcustom);
                    $custom=substr($custom, 0, -1);
                    $message = $productname." is only sold when the selected quantity is ".$custom;
                    $message .= " or multiples of these numbers.";
                    throw new \Magento\Framework\Exception\LocalizedException(__($message));
                }
            }

            if ($this->helper->getEnable() && $quantity_value==2) {
                $error = true;

                foreach ($cus as $key) {
                    if ($key==$qty || $qty % $key == 0) {
                        $error=false;
                    }
                }

                if ($error) {
                    $product = $this->_productRepository->getById($productId);
                    $urlproduct = $product->getUrlModel()->getUrl($product);
                    $this->_checkoutSession->setRedirectUrl($urlproduct);
                    $custom="";
                    $custom=$this->fixArr($cus);
                    $custom=substr($custom, 0, -1);
                    $message = $productname." is only sold when the selected quantity is ".$custom;
                    $message .= " or multiples of these numbers. ";
                    throw new \Magento\Framework\Exception\LocalizedException(__($message));
                }
            }
        }

        return [$productInfo, $requestInfo];
    }
}
