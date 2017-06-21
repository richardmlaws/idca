<?php
/**
 * Copyright © 2015 Biztech. All rights reserved.
 */

namespace Biztech\Productdesigner\Controller\Adminhtml\Masking;

class Massdelete extends \Biztech\Productdesigner\Controller\Adminhtml\Masking
{

    public function execute()
    {

                $id = $this->getRequest()->getParam('masking');
	
        if ($id) {
            try {
	
 $model = $this->_objectManager->create('Biztech\Productdesigner\Model\Masking');
		 foreach ($id as $quotesId) 
               {
                $model->load($quotesId);
                $model->delete();
		}
                $this->messageManager->addSuccess(__('You deleted the item.'));
                $this->_redirect('productdesigner/masking/');
                return;
            } catch (\Magento\Framework\Exception\LocalizedException $e) {
                $this->messageManager->addError($e->getMessage());
            } catch (\Exception $e) {
                $this->messageManager->addError(
                    __('We can\'t delete item right now. Please review the log and try again.')
                );
                $this->_objectManager->get('Psr\Log\LoggerInterface')->critical($e);
                $this->_redirect('productdesigner/masking/edit', ['id' => $this->getRequest()->getParam('id')]);
                return;
            }
        }
        $this->messageManager->addError(__('We can\'t find a item to delete.'));
        $this->_redirect('productdesigner/masking/');
    }
}
