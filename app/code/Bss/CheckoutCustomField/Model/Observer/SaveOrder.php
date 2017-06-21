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
namespace Bss\CheckoutCustomField\Model\Observer;

use Magento\Framework\Event\Observer as EventObserver;
use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Json\Helper\Data as JsonHelper;

/**
 * Visitor Observer
 */
class SaveOrder implements ObserverInterface
{
   /**
     * @var \Magento\Framework\Json\Helper\Data $jsonHelper
     */
    protected $jsonHelper;

    /**
     * @var \Magento\Framework\App\ResourceConnection $resource
     */
    protected $resource;

    /**
     * @var \Magento\Framework\App\ResourceConnection $resource
     */
    protected $orderRepository;

    /**
     * @param \Magento\Sales\Api\OrderRepositoryInterface $orderRepository
     */
    public function __construct(
        JsonHelper $jsonHelper,
        \Magento\Framework\App\ResourceConnection $resource,
        \Magento\Sales\Api\OrderRepositoryInterface $orderRepository
    ) {
        $this->resource = $resource;
        $this->jsonHelper = $jsonHelper;
        $this->orderRepository = $orderRepository;
    }

    public function execute(EventObserver $observer)
    {
        $orderIds = $observer->getOrderIds();
        $connection = $this->resource->getConnection();

        foreach($orderIds as $orderId)
        {
            $order = $this->orderRepository->get($orderId);
            if(!$order->getBssCustomfield())
                continue;
            $customAttr = $this->jsonHelper->jsonDecode($order->getBssCustomfield());
            if(!$customAttr)
                continue;
            $sql = '';
            foreach($customAttr as $key => $attr)
            {
                if($attr['show_gird'] != 2)
                {
                    if ($attr['type'] == 'multiselect') {
                        $sql .= "`" . $key . "`='" . implode(",", $attr['val']) . "', ";
                    } elseif ($attr['type'] == 'select' || $attr['type'] == 'boolean') {
                        $sql .= "`" . $key . "`='" . $attr['val'] . "', ";
                    } else {
                        $sql .= "`" . $key . "`='" . $attr['value'] . "', ";
                    }
                }
            } 
            $sql = trim($sql, ", ");
            $sql = "Update " . $this->resource->getTableName('sales_order_grid') . " Set " . $sql . " where entity_id = ". $orderId;
            $connection->query($sql);
        }
    }
}
