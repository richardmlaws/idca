<?php

namespace Swissup\Geoip\Block\Checkout;

use Magento\Directory\Helper\Data as DirectoryHelper;
use Magento\Customer\Model\Session;
use Magento\Customer\Api\CustomerRepositoryInterface as CustomerRepository;
use Magento\Customer\Helper\Address as AddressHelper;

use Swissup\Geoip\Helper\Data as GeoHelper;

class AttributeMerger extends \Magento\Checkout\Block\Checkout\AttributeMerger
{
    /**
     *
     * @var array
     */
    protected $geoData = [];

    /**
     * @param AddressHelper $addressHelper
     * @param Session $customerSession
     * @param CustomerRepository $customerRepository
     * @param DirectoryHelper $directoryHelper
     * @param \Swissup\Geoip\Helper\Data geoHelper
     */
    public function __construct(
        AddressHelper $addressHelper,
        Session $customerSession,
        CustomerRepository $customerRepository,
        DirectoryHelper $directoryHelper,
        GeoHelper $geoHelper
    ) {
        parent::__construct($addressHelper, $customerSession, $customerRepository, $directoryHelper);

        $this->geoData = $geoHelper->getGeo2();
    }

    /**
     * @param string $attributeCode
     * @return null|string
     */
    protected function getDefaultValue($attributeCode)
    {
        $return = parent::getDefaultValue($attributeCode);
        $geoData = $this->geoData;

        if (!empty($geoData)) {
            switch ($attributeCode) {
                case 'city':
                    return isset($geoData['city']) ? $geoData['city'] : null;
                case 'region_id':
                    return isset($geoData['region_id']) ? $geoData['region_id'] : null;
                case 'country_id':
                    return isset($geoData['country_id']) ? $geoData['country_id'] : null;
                case 'postcode':
                    return isset($geoData['postcode']) ? $geoData['postcode'] : null;
            }
        }
        return $return;
    }
}
