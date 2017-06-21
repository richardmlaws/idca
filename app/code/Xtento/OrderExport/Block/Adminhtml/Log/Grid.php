<?php

/**
 * Product:       Xtento_OrderExport (2.2.7)
 * ID:            4RGlvZ05rmKjdraKRe9ZL5NK6rygxIYqOS+HXQX4UCg=
 * Packaged:      2017-05-17T13:43:30+00:00
 * Last Modified: 2016-02-25T14:30:56+00:00
 * File:          app/code/Xtento/OrderExport/Block/Adminhtml/Log/Grid.php
 * Copyright:     Copyright (c) 2017 XTENTO GmbH & Co. KG <info@xtento.com> / All rights reserved.
 */

namespace Xtento\OrderExport\Block\Adminhtml\Log;

class Grid extends \Magento\Backend\Block\Widget\Grid
{
    protected function getFormMessages()
    {
        $formMessages = [
            [
                'type' => 'notice',
                'message' => __('All exports are logged here. Find failed exports or download exported files.')
            ]
        ];
        return $formMessages;
    }

    protected function _toHtml()
    {
        if ($this->getRequest()->getParam('ajax')) {
            return parent::_toHtml();
        }
        return $this->_getFormMessages() . parent::_toHtml();
    }

    protected function _getFormMessages()
    {
        $html = '<div id="messages"><div class="messages">';
        foreach ($this->getFormMessages() as $formMessage) {
            $html .= '<div class="message message-' . $formMessage['type'] . ' ' . $formMessage['type'] . '"><div>' . $formMessage['message'] . '</div></div>';
        }
        $html .= '</div></div>';
        return $html;
    }
}