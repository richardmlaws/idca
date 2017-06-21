<?php

namespace M3\Tierprice\Model\Magento\Catalog\Product\Type;


class Price extends \Magento\Catalog\Model\Product\Type\Price
{
	public function getTierPrices($product)
    {
        $prices = [];
        $tierPrices = $this->getExistingPrices($product, 'tier_price');
        foreach ($tierPrices as $price) {
		
            /** @var \Magento\Catalog\Api\Data\ProductTierPriceInterface $tierPrice */
            $tierPrice = $this->tierPriceFactory->create();
            $tierPrice->setCustomerGroupId($price['cust_group']);
            if (array_key_exists('website_price', $price)) {
                $value = $price['website_price'];
            } else {
                $value = $price['price'];
            }
            $tierPrice->setValue($value);
            $tierPrice->setQty($price['price_qty']);
			$tierPrice->setIsshow($price['isshow']);
            $prices[] = $tierPrice;
        }
        return $prices;
    }
	
	 public function setTierPrices($product, array $tierPrices = null)
    {
        // null array means leave everything as is
        if ($tierPrices === null) {
            return $this;
        }

        $websiteId = $this->getWebsiteForPriceScope();
        $allGroupsId = $this->getAllCustomerGroupsId();

        // build the new array of tier prices
        $prices = [];
        foreach ($tierPrices as $price) {
            $prices[] = [
                'website_id' => $websiteId,
                'cust_group' => $price->getCustomerGroupId(),
                'website_price' => $price->getValue(),
                'price' => $price->getValue(),
                'all_groups' => ($price->getCustomerGroupId() == $allGroupsId),
                'price_qty' => $price->getQty(),
				'isshow' => $price->getIsshow()
            ];
        }
        $product->setData('tier_price', $prices);

        return $this;
    }
	

	
}
	
	