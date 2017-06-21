<?php

namespace Swissup\Ajaxlayerednavigation\Helper;

use Magento\Framework\App\Helper\AbstractHelper;

class Search extends AbstractHelper
{
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Framework\ObjectManagerInterface $objectManager
    ) {
        $this->_storeManager  = $storeManager;
        $this->_scopeConfig = $context->getScopeConfig();
        $this->_objectManager= $objectManager;
        $this->request = $context->getRequest();
        parent::__construct($context);
    }

    public function search()
    {
        $searchQuery = $this->request->getParam('q');
        if (!$searchQuery) {
            return false;
        }

        $search = $this->_objectManager->create(
            '\Magento\Search\Api\SearchInterface');

        $searchCriteriaBuilder = $this->_objectManager->create(
            '\Magento\Framework\Api\Search\SearchCriteriaBuilder');

        $filterBuilder = $this->_objectManager->create(
            '\Magento\Framework\Api\FilterBuilder');

        $filterBuilder
            ->setField('search_term')
            ->setValue($searchQuery);

        $searchCriteriaBuilder->addFilter($filterBuilder->create());

        $searchCriteria = $searchCriteriaBuilder->create();

        $searchCriteria->setRequestName('quick_search_container');
        $items = $search->search($searchCriteria)->getItems();
        if (count($items) > 0) {
            $entityIds = [];
            foreach ($items as $item) {
                $entityIds[] = $item->getId();
            }

            return $entityIds;
        }
        return false;
    }
}
