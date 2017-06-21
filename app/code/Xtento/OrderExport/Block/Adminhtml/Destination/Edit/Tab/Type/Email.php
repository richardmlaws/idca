<?php

/**
 * Product:       Xtento_OrderExport (2.2.7)
 * ID:            4RGlvZ05rmKjdraKRe9ZL5NK6rygxIYqOS+HXQX4UCg=
 * Packaged:      2017-05-17T13:43:30+00:00
 * Last Modified: 2016-02-29T15:07:30+00:00
 * File:          app/code/Xtento/OrderExport/Block/Adminhtml/Destination/Edit/Tab/Type/Email.php
 * Copyright:     Copyright (c) 2017 XTENTO GmbH & Co. KG <info@xtento.com> / All rights reserved.
 */

namespace Xtento\OrderExport\Block\Adminhtml\Destination\Edit\Tab\Type;

class Email extends AbstractType
{
    // E-Mail Configuration
    public function getFields(\Magento\Framework\Data\Form $form)
    {
        $model = $this->registry->registry('orderexport_destination');
        // Set default values
        if (!$model->getId()) {
            $model->setEmailAttachFiles(1);
        }

        $fieldset = $form->addFieldset('config_fieldset', [
            'legend' => __('E-Mail Export Configuration'),
        ]
        );

        $fieldset->addField('email_sender', 'text', [
            'label' => __('E-Mail From Address'),
            'name' => 'email_sender',
            'note' => __('Enter the email address that should be set as the sender of the email. '),
            'required' => true
        ]
        );
        $fieldset->addField('email_recipient', 'text', [
            'label' => __('E-Mail Recipient Address'),
            'name' => 'email_recipient',
            'note' => __('Enter the email address where exports should be sent to. Separate multiple emails using a comma.'),
            'required' => true
        ]
        );
        $fieldset->addField('email_subject', 'text', [
            'label' => __('E-Mail Subject'),
            'name' => 'email_subject',
            'note' => __('Subject of email. Available variables: %d%, %m%, %y%, %Y%, %h%, %i%, %s%, %recordcount%, %lastexportedincrementid%, %exportid%'),
        ]
        );
        $fieldset->addField('email_body', 'textarea', [
            'label' => __('E-Mail Text'),
            'name' => 'email_body',
            'note' => __('Email text (body text). Available variables: %d%, %m%, %y%, %Y%, %h%, %i%, %s%, %exportid%, %lastexportedincrementid%, %recordcount%, %content% (%content% contains the data generated by the export)'),
        ]
        );
        $fieldset->addField('email_attach_files', 'select', [
            'label' => __('Attach exported files to email'),
            'name' => 'email_attach_files',
            'values' => $this->yesNo->toOptionArray(),
            'note' => __('Should exported files be attached to the email sent?'),
        ]
        );
    }
}