<?php
/**
 * ITORIS
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the ITORIS's Magento Extensions License Agreement
 * which is available through the world-wide-web at this URL:
 * http://www.itoris.com/magento-extensions-license.html
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to sales@itoris.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade the extensions to newer
 * versions in the future. If you wish to customize the extension for your
 * needs please refer to the license agreement or contact sales@itoris.com for more information.
 *
 * @category   ITORIS
 * @package    ITORIS_M2_DYNAMIC_PRODUCT_OPTIONS
 * @copyright  Copyright (c) 2016 ITORIS INC. (http://www.itoris.com)
 * @license    http://www.itoris.com/magento-extensions-license.html  Commercial License
 */

namespace Itoris\DynamicProductOptions\Controller\Adminhtml\Product\Options;

class MassLoad extends \Itoris\DynamicProductOptions\Controller\Adminhtml\Product\Options
{
    /**
     * @return mixed
     */
    public function execute()
    {
        $filter = $this->_objectManager->create('Magento\Ui\Component\MassAction\Filter');
        $collectionFactory = $this->_objectManager->create('Magento\Catalog\Model\ResourceModel\Product\CollectionFactory');
        $collection = $filter->getCollection($collectionFactory->create());
        $productIds = $collection->getAllIds();
        
        $res = $this->_objectManager->get('Magento\Framework\App\ResourceConnection');
        $con = $res->getConnection('read');
        
        if (is_array($productIds)) {
            try {
                $template = $this->_objectManager->create('Itoris\DynamicProductOptions\Model\Template')->load($this->getRequest()->getParam('template_id'));
                if ($template->getId()) {
                    $method = (int) $this->getRequest()->getParam('method');
                    $saved = 0;
                    foreach ($productIds as $newProductId) {
                        if ($method == 1) { //append options                        
                            $config = $con->fetchRow("select * from {$res->getTableName('itoris_dynamicproductoptions_options')} where `product_id`={$newProductId} and `store_id`=0");
                            $_template = json_decode($config['configuration'], true);
                            $sections = $template->getSections();
                            foreach($sections as $section) if (!empty($section)) {
                                $section['order'] = count($_template);
                                foreach($section['fields'] as &$field) {
                                    if (isset($field['internal_id'])) $field['internal_id'] = 0;
                                    if (isset($field['section_order'])) $field['section_order'] = $section['order'];
                                }
                                $_template[] = $section;
                            }
                            
                            $template->setConfiguration(json_encode($_template));
                            $template->setData('form_style', 'table_sections');
                            $template->setData('appearance', $config['appearance']);
                            if ($config['css_adjustments']) $template->setData('css_adjustments', $template->getData('css_adjustments'). "\n". $config['css_adjustments']);
                            if ($config['extra_js']) $template->setData('extra_js', $template->getData('extra_js'). "\n". $config['extra_js']);
                            
                            //print_r($_template); exit;
                        }

                        if ($this->applyToProduct($newProductId, [0 => $template])) {
                            $saved++;
                        }
                    }
                    $this->messageManager->addSuccess(__(sprintf('%s products have been changed', $saved)));
                    
                    //invalidate FPC
                    $cacheTypeList = $this->_objectManager->create('\Magento\Framework\App\Cache\TypeList');
                    $cacheTypeList->invalidate('full_page');
                    
                } else {
                    $this->messageManager->addError(__('Template has not been loaded'));
                }
            } catch (\Exception $e) {
                $this->messageManager->addError(__('Products have not been changed'));
            }
        } else {
            $this->messageManager->addError(__('Please select product ids'));
        }

        $this->_redirect('catalog/product/', ['_current' => true]);
    }
}