<?php

/**
 * Product:       Xtento_OrderExport (2.2.7)
 * ID:            4RGlvZ05rmKjdraKRe9ZL5NK6rygxIYqOS+HXQX4UCg=
 * Packaged:      2017-05-17T13:43:30+00:00
 * Last Modified: 2016-04-17T13:03:38+00:00
 * File:          app/code/Xtento/OrderExport/Observer/CustomerSaveAfterRegistrationObserver.php
 * Copyright:     Copyright (c) 2017 XTENTO GmbH & Co. KG <info@xtento.com> / All rights reserved.
 */

namespace Xtento\OrderExport\Observer;

use Xtento\OrderExport\Model\Export;

class CustomerSaveAfterRegistrationObserver extends AbstractEventObserver implements \Magento\Framework\Event\ObserverInterface
{
    /**
     * @param \Magento\Framework\Event\Observer $observer
     */
    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        // Check if customer is new, only export then
        if ($observer->getCustomer()->isObjectNew()) {
            $this->handleEvent($observer, self::EVENT_CUSTOMER_AFTER_REGISTRATION, Export::ENTITY_CUSTOMER);
        }
    }
}
