<?php
namespace Swissup\AddressAutocomplete\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;
use Magento\Checkout\Model\ConfigProviderInterface;
use Magento\Framework\UrlInterface;
use Magento\Framework\Locale\Resolver as LocaleResolver;

class ConfigProvider implements ConfigProviderInterface
{
    const ENABLE_CONF_PATH = 'address_autocomplete/main/enable';
    const API_KEY_CONF_PATH = 'address_autocomplete/main/api_key';
    const STREET_PLACEMENT_CONF_PATH = 'address_autocomplete/main/street_number_placement';

    /**
     * @var ScopeConfigInterface
     */
    protected $scopeConfig;

    /**
     * @var UrlInterface
     */
    // protected $urlBuilder;

    /**
     *
     * @var LocaleResolver
     */
    protected $localeResolver;

    public function __construct(
        ScopeConfigInterface $scopeConfig,
        LocaleResolver $localeResolver
        // ,UrlInterface $urlBuilder
    ) {
        $this->scopeConfig = $scopeConfig;
        $this->localeResolver = $localeResolver;
        // $this->urlBuilder = $urlBuilder;

    }

    public function getConfig()
    {
        return [
            'swissup' => [
                'AddressAutocomplete' => [
                    'enable' => $this->getEnable(),
                    'apiKey' => $this->getApiKey(),
                    'streetNumberPlacement' => $this->getStreetNumberPlacement(),
                    'locale' => $this->getLocale()
                ]
            ]
        ];
    }

    private function getEnable()
    {
        return (bool) $this->scopeConfig->getValue(
            self::ENABLE_CONF_PATH,
            ScopeInterface::SCOPE_STORE
        );
    }

    private function getApiKey()
    {
        return $this->scopeConfig->getValue(
            self::API_KEY_CONF_PATH,
            ScopeInterface::SCOPE_STORE
        );
    }

    private function getStreetNumberPlacement()
    {
        return $this->scopeConfig->getValue(
            self::STREET_PLACEMENT_CONF_PATH,
            ScopeInterface::SCOPE_STORE
        );
    }

    private function getLocale()
    {
        $locale = $this->localeResolver->getLocale();
        return str_replace('_', '-', $locale);
    }

    //
    // public function getAttachmentUploadUrl()
    // {
    //     return $this->urlBuilder->getUrl('orderattachment/attachment/upload');
    // }
}
