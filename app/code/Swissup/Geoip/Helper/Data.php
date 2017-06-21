<?php
namespace Swissup\Geoip\Helper;

use GeoIp2\Database\Reader;
use Magento\Framework\HTTP\PhpEnvironment\RemoteAddress;
use Magento\Customer\Api\Data\RegionInterfaceFactory;
use Swissup\Geoip\Model\ResourceModel\LocationDirectory;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;
// use Psr\Log\LoggerInterface as Logger;
use GeoIp2\Exception\GeoIp2Exception;

class Data
{
    const FILENAME_CONFIG = 'geoip/main/filename';
    const ENABLE_CONFIG   = 'geoip/main/enable';

    /**
     * @var \Magento\Framework\HTTP\PhpEnvironment\RemoteAddress
     */
    protected $remoteAddress;

    /**
     * @var \Magento\Customer\Api\Data\RegionInterfaceFactory
     */
    protected $regionFactory;

    /**
     * @var LocationDirectory
     */
    private $locationDirectory;

    /** @var Logger */
    // protected $logger;

    /**
     * @var ScopeConfigInterface
     */
    protected $scopeConfig;

    /**
     * Factory constructor
     *
     * @param \Magento\Framework\HTTP\PhpEnvironment\RemoteAddress $remoteAddress
     * @param \Magento\Customer\Api\Data\RegionInterfaceFactory $regionFactory
     * @param LocationDirectory $locationDirectory
     * @param ScopeConfigInterface $scopeConfig
     * @ param Logger $logger
     */
    public function __construct(
        RemoteAddress $remoteAddress,
        RegionInterfaceFactory $regionFactory,
        LocationDirectory $locationDirectory,
        ScopeConfigInterface $scopeConfig
        // Logger $logger
    ) {
        $this->remoteAddress = $remoteAddress;
        $this->regionFactory = $regionFactory;
        $this->locationDirectory = $locationDirectory;
        $this->scopeConfig = $scopeConfig;
        // $this->logger = $logger;
    }

    public function getGeo2($ip = null)
    {
        $enable = (bool) $this->scopeConfig->getValue(
            self::ENABLE_CONFIG,
            ScopeInterface::SCOPE_STORE
        );
        if (!$enable) {
            return;
        }

        $data = array();
        if (empty($ip)) {
            $ip = $this->remoteAddress->getRemoteAddress();
        }
        if ($ip) {
            $filename = $this->scopeConfig->getValue(self::FILENAME_CONFIG, ScopeInterface::SCOPE_STORE);
            try {
                $mmdb = getcwd() . '/vendor/swissup/geoip/' . basename($filename);
                if (!file_exists($mmdb)) {
                    return $data;
                }
                $reader = new Reader($mmdb);
                // $record = $reader->city('128.101.101.101');//54.195.241.132
                $record = $reader->city($ip);
            } catch (GeoIp2Exception $e) {
                // $this->logger->critical($e);
                return $data;
            }

            $regionId = 0;
            $countryCode = $record->country->isoCode;
            $regionCode = $record->mostSpecificSubdivision->isoCode;
            if ($this->locationDirectory->hasCountryId($countryCode)) {
                $countryId = $this->locationDirectory->getCountryId($countryCode);
            }
            if ($this->locationDirectory->hasRegionId($countryId, $regionCode)) {
                $regionId = $this->locationDirectory->getRegionId($countryId, $regionCode);
            }
            $region = $this->regionFactory->create()
                ->setRegionCode($regionCode)
                ->setRegionId($regionId)
            ;

            $data = array(
                'city'       => $record->city->name,
                'region'     => $region,
                'region_id'  => $regionId,
                'postcode'   => $record->postal->code,
                'country_id' => $record->country->isoCode
            );
        }
        return $data;
    }
}
