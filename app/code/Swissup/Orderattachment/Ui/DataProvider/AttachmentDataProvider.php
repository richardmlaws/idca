<?php
namespace Swissup\Orderattachment\Ui\DataProvider;

use Magento\Framework\App\RequestInterface;
use Magento\Ui\DataProvider\AbstractDataProvider;
use Swissup\Orderattachment\Model\ResourceModel\Attachment\Grid\CollectionFactory;
use Swissup\Orderattachment\Model\ResourceModel\Attachment\Grid\Collection;

class AttachmentDataProvider extends AbstractDataProvider
{

    protected $collectionFactory;

    protected $request;

    public function __construct(
        $name,
        $primaryFieldName,
        $requestFieldName,
        CollectionFactory $collectionFactory,
        RequestInterface $request,
        array $meta = [],
        array $data = []
    ) {
        parent::__construct($name, $primaryFieldName, $requestFieldName, $meta, $data);
        $this->collectionFactory = $collectionFactory;
        $this->collection = $this->collectionFactory->create();
        $this->request = $request;
    }

    /**
     * {@inheritdoc}
     */
    public function getData()
    {
        $arrItems = [
            'totalRecords' => $this->getCollection()->getSize(),
            'items' => [],
        ];

        foreach ($this->getCollection() as $item) {
            $arrItems['items'][] = $item->toArray([]);
        }

        return $arrItems;
    }

    // /**
    //  * {@inheritdoc}
    //  */
    // public function addFilter(\Magento\Framework\Api\Filter $filter)
    // {
    //     $field = $filter->getField();

    //     if (in_array($field, ['review_id', 'created_at', 'status_id'])) {
    //         $filter->setField('rt.' . $field);
    //     }

    //     if (in_array($field, ['title', 'nickname', 'detail'])) {
    //         $filter->setField('rdt.' . $field);
    //     }

    //     if ($field === 'review_created_at') {
    //         $filter->setField('rt.created_at');
    //     }

    //     parent::addFilter($filter);
    // }
}
