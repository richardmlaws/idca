<?php

/**
 * Product:       Xtento_OrderExport (2.2.7)
 * ID:            4RGlvZ05rmKjdraKRe9ZL5NK6rygxIYqOS+HXQX4UCg=
 * Packaged:      2017-05-17T13:43:30+00:00
 * Last Modified: 2016-03-02T18:14:21+00:00
 * File:          app/code/Xtento/OrderExport/Model/Export/Data/Shipment/Comments.php
 * Copyright:     Copyright (c) 2017 XTENTO GmbH & Co. KG <info@xtento.com> / All rights reserved.
 */

namespace Xtento\OrderExport\Model\Export\Data\Shipment;

class Comments extends \Xtento\OrderExport\Model\Export\Data\AbstractData
{
    public function getConfiguration()
    {
        return [
            'name' => 'Shipment Comments',
            'category' => 'Shipment',
            'description' => 'Export any comments added to shipments, retrieved from the sales_flat_shipment_comment table.',
            'enabled' => true,
            'apply_to' => [\Xtento\OrderExport\Model\Export::ENTITY_INVOICE],
        ];
    }

    // @codingStandardsIgnoreStart
    public function getExportData($entityType, $collectionItem)
    {
        // @codingStandardsIgnoreEnd
        // Set return array
        $returnArray = [];
        $this->writeArray = & $returnArray['shipment_comments'];
        // Fetch fields to export
        $shipment = $collectionItem->getObject();

        if (!$this->fieldLoadingRequired('shipment_comments')) {
            return $returnArray;
        }

        if ($shipment) {
            $commentsCollection = $shipment->getCommentsCollection();
            if ($commentsCollection) {
                foreach ($commentsCollection->getItems() as $shipmentComment) {
                    $this->writeArray = & $returnArray['shipment_comments'][];
                    $this->writeValue('comment', $shipmentComment->getComment());
                    $this->writeValue('created_at', $shipmentComment->getCreatedAt());
                }
            }
        }
        $this->writeArray = & $returnArray;
        // Done
        return $returnArray;
    }
}