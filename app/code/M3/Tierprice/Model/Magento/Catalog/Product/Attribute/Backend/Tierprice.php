<?php

namespace M3\Tierprice\Model\Magento\Catalog\Product\Attribute\Backend;

use Magento\Catalog\Api\Data\ProductInterface;
 
class Tierprice extends \Magento\Catalog\Model\Product\Attribute\Backend\Tierprice
{
	protected $metadataPool;
	public function afterSave($object)
    {
        $websiteId = $this->_storeManager->getStore($object->getStoreId())->getWebsiteId();
        $isGlobal = $this->getAttribute()->isScopeGlobal() || $websiteId == 0;

        $priceRows = $object->getData($this->getAttribute()->getName());
        if (null === $priceRows) {
            return $this;
        }

        $priceRows = array_filter((array)$priceRows);

        $old = [];
        $new = [];

        // prepare original data for compare
        $origPrices = $object->getOrigData($this->getAttribute()->getName());
        if (!is_array($origPrices)) {
            $origPrices = [];
        }
        foreach ($origPrices as $data) {
            if ($data['website_id'] > 0 || $data['website_id'] == '0' && $isGlobal) {
                $key = implode(
                    '-',
                    array_merge(
                        [$data['website_id'], $data['cust_group']],
                        $this->_getAdditionalUniqueFields($data)
                    )
                );
                $old[$key] = $data;
            }
        }

        // prepare data for save
        foreach ($priceRows as $data) {
            $hasEmptyData = false;
            foreach ($this->_getAdditionalUniqueFields($data) as $field) {
                if (empty($field)) {
                    $hasEmptyData = true;
                    break;
                }
            }

            if ($hasEmptyData || !isset($data['cust_group']) || !empty($data['delete'])) {
                continue;
            }
            if ($this->getAttribute()->isScopeGlobal() && $data['website_id'] > 0) {
                continue;
            }
            if (!$isGlobal && (int)$data['website_id'] == 0) {
                continue;
            }

            $key = implode(
                '-',
                array_merge([$data['website_id'], $data['cust_group']], $this->_getAdditionalUniqueFields($data))
            );

            $useForAllGroups = $data['cust_group'] == $this->_groupManagement->getAllCustomersGroup()->getId();
            $customerGroupId = !$useForAllGroups ? $data['cust_group'] : 0;

            $new[$key] = array_merge(
                [
                    'website_id' => $data['website_id'],
                    'all_groups' => $useForAllGroups ? 1 : 0,
                    'customer_group_id' => $customerGroupId,
                    'value' => $data['price'],
					'isshow' => $data['isshow'],
                ],
                $this->_getAdditionalUniqueFields($data)
            );
        }

        $delete = array_diff_key($old, $new);
        $insert = array_diff_key($new, $old);
        $update = array_intersect_key($new, $old);

        $isChanged = false;
        $productId = $object->getData($this->getMetadataPool()->getMetadata(ProductInterface::class)->getLinkField());

        if (!empty($delete)) {
            foreach ($delete as $data) {
                $this->_getResource()->deletePriceData($productId, null, $data['price_id']);
                $isChanged = true;
            }
        }

        if (!empty($insert)) {
            foreach ($insert as $data) {
                $price = new \Magento\Framework\DataObject($data);
                $price->setData(
                    $this->getMetadataPool()->getMetadata(ProductInterface::class)->getLinkField(),
                    $productId
                );
                $this->_getResource()->savePriceData($price);

                $isChanged = true;
            }
        }

        if (!empty($update)) {
		
            foreach ($update as $k => $v) {
                if ($old[$k]['price'] != $v['value']) {
                    $price = new \Magento\Framework\DataObject(['value_id' => $old[$k]['price_id'], 'value' => $v['value']]);
                    $this->_getResource()->savePriceData($price);

                    $isChanged = true;
                }
				if ($old[$k]['isshow'] != $v['isshow'] ) {
                    $price = new \Magento\Framework\DataObject(['value_id' => $old[$k]['price_id'], 'isshow' => $v['isshow']]);
                    $this->_getResource()->savePriceData($price);

                    $isChanged = true;
                }
            }

        }

        if ($isChanged) {
            $valueChangedKey = $this->getAttribute()->getName() . '_changed';
            $object->setData($valueChangedKey, 1);
        }

        return $this;
    }
	
	private function getMetadataPool()
    {
        if (null === $this->metadataPool) {
            $this->metadataPool = \Magento\Framework\App\ObjectManager::getInstance()
                ->get('Magento\Framework\EntityManager\MetadataPool');
        }
        return $this->metadataPool;
    }
}
	
	