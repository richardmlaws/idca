<?php
namespace Swissup\Orderattachment\Controller\Adminhtml\Attachment;

use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Store\Model\ScopeInterface;
use Swissup\Orderattachment\Model\Attachment;
use Magento\Framework\Math\Random;
use Magento\Framework\Stdlib\DateTime\DateTime;
use Magento\Store\Model\StoreManagerInterface;

class Upload extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Framework\Controller\Result\RawFactory
     */
    protected $resultRawFactory;

    /**
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\Framework\Controller\Result\RawFactory $resultRawFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Controller\Result\RawFactory $resultRawFactory,
        Random $random,
        DateTime $dateTime,
        StoreManagerInterface $storeManager
    ) {
        parent::__construct($context);
        $this->resultRawFactory = $resultRawFactory;
        $this->random = $random;
        $this->_datetime = $dateTime;
        $this->_storeManager = $storeManager;
    }

    /**
     * @return bool
     */
    protected function _isAllowed()
    {
        return $this->_authorization->isAllowed('Swissup_Orderattachment::upload');
    }

    /**
     * @return \Magento\Framework\Controller\Result\Raw
     */
    public function execute()
    {
        try {
            $uploadData = $_FILES['order-attachment'];
            $newUpload = [];
            foreach ($uploadData as $key => $item) {
                if (is_array($item)) {
                    foreach ($item as $pos => $val) {
                        $newUpload[$key] = $val;
                    }
                } else {
                    $newUpload[$key] = $item;
                }
            }

            $_FILES['order-attachment'] = $newUpload;

            $config = $this->_objectManager->get('Magento\Framework\App\Config\ScopeConfigInterface');
            $allowedExtensions = $config->getValue(
                Attachment::XML_PATH_ATTACHMENT_FILE_EXT,
                ScopeInterface::SCOPE_STORE
            );
            $uploader = $this->_objectManager->create(
                'Magento\Framework\File\Uploader',
                ['fileId' => 'order-attachment']
            );
            $uploader->setAllowedExtensions(explode(',', $allowedExtensions));
            $uploader->setAllowRenameFiles(true);
            $uploader->setFilesDispersion(true);
            /** @var \Magento\Framework\Filesystem\Directory\Read $varDirectory */
            $varDirectory = $this->_objectManager->get('Magento\Framework\Filesystem')
                ->getDirectoryRead(DirectoryList::VAR_DIR);

            $result = $uploader->save($varDirectory->getAbsolutePath("orderattachment"));
            unset($result['tmp_name']);
            unset($result['path']);
            $result['success'] = true;
            $attachment = $this->_objectManager->create(
                'Swissup\Orderattachment\Model\Attachment'
            );
            $hash = $this->random->getRandomString(32);
            $orderId = $this->getRequest()->getParam('order_id');
            $date = $this->_datetime->gmtDate('Y-m-d H:i:s');
            $attachment->setPath($result['file'])
                ->setHash($hash)
                ->setOrderId($orderId)
                ->setComment('')
                ->setType($result['type'])
                ->setUploadedAt($date)
                ->setModifiedAt($date);
            $attachment->save();
            $defaultStoreId = $this->_storeManager->getDefaultStoreView()->getStoreId();
            $preview = $this->_storeManager->getStore($defaultStoreId)->getUrl(
                'orderattachment/attachment/preview',
                [
                    'attachment' => $attachment->getId(),
                    'hash' => $attachment->getHash()
                ]
            );
            $download = $this->_storeManager->getStore($defaultStoreId)->getUrl(
                'orderattachment/attachment/preview',
                [
                    'attachment' => $attachment->getId(),
                    'hash' => $attachment->getHash(),
                    'download' => 1
                ]
            );
            $result['preview'] = $preview;
            $result['download'] = $download;
            $result['attachment_id'] = $attachment->getId();
            $result['hash'] = $attachment->getHash();
            $result['comment'] = '';
        } catch (\Exception $e) {
            $result = ['success' => false, 'error' => $e->getMessage(), 'errorcode' => $e->getCode()];
        }

        /** @var \Magento\Framework\Controller\Result\Raw $response */
        $response = $this->resultRawFactory->create();
        $response->setHeader('Content-type', 'text/plain');
        $response->setContents(json_encode($result));
        return $response;
    }
}
