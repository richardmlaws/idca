<?php

namespace Swissup\Firecheckout\Helper;

class Data extends \Magento\Framework\App\Helper\AbstractHelper
{
    /**
     * @var string
     */
    const CONFIG_PATH_ENABLED = 'firecheckout/general/enabled';

    /**
     * @var string
     */
    const CONFIG_PATH_URL_PATH = 'firecheckout/general/url_path';

    /**
     * @var string
     */
    const CONFIG_PATH_LAYOUT = 'firecheckout/general/layout';

    /**
     * @var string
     */
    const CONFIG_PATH_PAGE_LAYOUT = 'firecheckout/design/page_layout';

    /**
     * Retrieve isEnabled flag
     *
     * @return boolean
     */
    public function isFirecheckoutEnabled()
    {
        return $this->scopeConfig->getValue(
            self::CONFIG_PATH_ENABLED,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    /**
     * Retrieve firecheckout url path
     *
     * @return boolean
     */
    public function getFirecheckoutUrlPath()
    {
        return $this->scopeConfig->getValue(
            self::CONFIG_PATH_URL_PATH,
            \Magento\Store\Model\ScopeInterface::SCOPE_WEBSITE
        );
    }

    public function isOnFirecheckoutPage()
    {
        return $this->_getRequest()->getRouteName() === 'firecheckout';
    }

    /**
     * Get Firecheckout page url
     *
     * @return string
     */
    public function getFirecheckoutUrl()
    {
        return $this->_urlBuilder->getUrl(
            $this->getFirecheckoutUrlPath(),
            ['_secure' => true]
        );
    }

    /**
     * Get Firecheckout layout class name
     *
     * @return string
     */
    public function getLayoutClassNames()
    {
        $classes = $this->scopeConfig->getValue(
            self::CONFIG_PATH_LAYOUT,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
        return explode(' ', $classes);
    }

    /**
     * Get page layout config
     *
     * @return string
     */
    public function getPageLayout()
    {
        return $this->scopeConfig->getValue(
            self::CONFIG_PATH_PAGE_LAYOUT,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }
}
