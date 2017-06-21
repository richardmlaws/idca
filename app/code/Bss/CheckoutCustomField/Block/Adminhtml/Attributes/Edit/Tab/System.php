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
namespace Bss\CheckoutCustomField\Block\Adminhtml\Attributes\Edit\Tab;

use Magento\Backend\Block\Widget\Form\Generic;

class System extends Generic
{
    /**
     * @return $this
     */
    protected function _prepareForm()
    {
        $model = $this->_coreRegistry->registry('entity_attribute');

        /** @var \Magento\Framework\Data\Form $form */
        $form = $this->_formFactory->create();
        $fieldset = $form->addFieldset('base_fieldset', ['legend' => __('System Properties')]);

        if ($model->getAttributeId()) {
            $fieldset->addField('attribute_id', 'hidden', ['name' => 'attribute_id']);
        }

        $yesno = [['value' => 0, 'label' => __('No')], ['value' => 1, 'label' => __('Yes')]];

        $fieldset->addField(
            'backend_type',
            'select',
            [
                'name' => 'backend_type',
                'label' => __('Data Type for Saving in Database'),
                'title' => __('Data Type for Saving in Database'),
                'options' => [
                    'text' => __('Text'),
                    'varchar' => __('Varchar'),
                    'static' => __('Static'),
                    'datetime' => __('Datetime'),
                    'decimal' => __('Decimal'),
                    'int' => __('Integer'),
                ]
            ]
        );

        $fieldset->addField(
            'is_global',
            'select',
            [
                'name' => 'is_global',
                'label' => __('Globally Editable'),
                'title' => __('Globally Editable'),
                'values' => $yesno
            ]
        );

        $form->setValues($model->getData());

        if ($model->getAttributeId()) {
            $form->getElement('backend_type')->setDisabled(1);
        }

        $this->setForm($form);
        return parent::_prepareForm();
    }
}
