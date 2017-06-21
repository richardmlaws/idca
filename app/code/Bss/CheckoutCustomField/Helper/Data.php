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
 * @package    Bss_CheckoutCustomField
 * @author     Extension Team
 * @copyright  Copyright (c) 2015-2016 BSS Commerce Co. ( http://bsscommerce.com )
 * @license    http://bsscommerce.com/Bss-Commerce-License.txt
 */
namespace Bss\CheckoutCustomField\Helper;

use Magento\Store\Model\StoreManagerInterface as StoreId;
use Magento\Framework\Json\Helper\Data as JsonHelper;

class Data extends \Magento\Framework\App\Helper\AbstractHelper
{
    const XML_PATH_SECURE_IN_FRONTEND = 'web/secure/use_in_frontend';

    protected $jsonHelper;

    protected $_configSectionId = 'custom_field';

    protected $storeId;

    protected $_resigtry;

    protected $logger;

    public function __construct(
        \Magento\Framework\Registry $resigtry,
        \Magento\Framework\App\Helper\Context $context,
        JsonHelper $jsonHelper,
        StoreId $storeId
    ) {
        $this->_resigtry = $resigtry;
        $this->jsonHelper = $jsonHelper;
        $this->storeId = $storeId;
        $this->logger = $context->getLogger();
        parent::__construct($context);
    }

    public function getConfig($path, $store = null, $scope = null)
    {
        if ($scope === null) {
            $scope = \Magento\Store\Model\ScopeInterface::SCOPE_STORE;
        }
        return $this->scopeConfig->getValue($path, $scope, $store);
    }

    public function moduleEnabled()
    {
        return (bool)$this->getConfig($this->_configSectionId.'/general/enable');
    }

    public function getTitle()
    {
        return (string)$this->getConfig($this->_configSectionId.'/general/title');
    }

    protected function getPdfView()
    {
        return (bool)$this->getConfig($this->_configSectionId.'/general/pdf_view');
    }

    protected function getEmailView()
    {
        return (bool)$this->getConfig($this->_configSectionId.'/general/email_view');
    }

    public function showInPdf()
    {
        return $this->moduleEnabled() && $this->getPdfView();
    }

    public function showInEmail()
    {
        return $this->moduleEnabled() && $this->getEmailView();
    }

    public function getVariableEmailHtml($json)
    {
        $html = '';
        if($this->showInEmail() && $json)
        {
            $html = '<h3>' . $this->getTitle() . '</h3';
            $bssCustomfield = $this->jsonHelper->jsonDecode($json);
            foreach($bssCustomfield as $key => $field)
            {
                if($field['show_in_email'] == '1')
                {
                    $fieldText = $field['frontend_label'] . ': ';
                    if(is_array($field['value']))
                    {
                        foreach($field['value'] as $value)
                        {
                            $fieldText .= $value . ",";
                        }
                    } else {
                        $fieldText .= $field['value'];
                    }
                    $html .= "<span>" . $fieldText . "</span><br/>";
                }
            }
        }
        return $html;
    }

    public function getCurrentStoreId()
    {
        return $this->storeId->getStore()->getId();
    }
}
