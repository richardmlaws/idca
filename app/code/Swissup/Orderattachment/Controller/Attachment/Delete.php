<?php
namespace Swissup\Orderattachment\Controller\Attachment;

use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Filesystem\DirectoryList;

class Delete extends Action
{
    /**
     * @var \Magento\Framework\Controller\Result\RawFactory
     */
    protected $resultRawFactory;
    /**
     * @param \Magento\Framework\App\Action\Context $context
     */
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\Controller\Result\RawFactory $resultRawFactory)
    {
        parent::__construct($context);
        $this->resultRawFactory = $resultRawFactory;
    }

    public function execute()
    {
        $result = [];
        $isAjax = $this->getRequest()->isAjax();
        $isPost = $this->getRequest()->isPost();
        $request = $this->getRequest()->getParams();
        $attachmentId = $request['attachment'];
        $hash = $request['hash'];
        if (!$isAjax || !$isPost || !$attachmentId || !$hash) {
            $result = ['success' => false, 'error' => __('Invalid Request Params')];
            $response = $this->resultRawFactory->create();
            $response->setHeader('Content-type', 'text/plain');
            $response->setContents(json_encode($result));
            return $response;
        }
        try {
            $attachment = $this->_objectManager->create(
                'Swissup\Orderattachment\Model\Attachment'
            );
            $attachment->load($attachmentId);
            if (!$attachment->getId()) {
                $result = ['success' => false, 'error' => __('Can\'t find a attachment to delete.')];
                $response = $this->resultRawFactory->create();
                $response->setHeader('Content-type', 'text/plain');
                $response->setContents(json_encode($result));
                return $response;
            }
            if ($hash !== $attachment->getHash()) {
                $result = ['success' => false, 'error' => __('Invalid Hash Params')];
                $response = $this->resultRawFactory->create();
                $response->setHeader('Content-type', 'text/plain');
                $response->setContents(json_encode($result));
                return $response;
            }
            /** @var \Magento\Framework\Filesystem\Directory\Read $varDirectory */
            $varDirectory = $this->_objectManager->get('Magento\Framework\Filesystem')
                ->getDirectoryRead(DirectoryList::VAR_DIR);

            $attachFile = $varDirectory->getAbsolutePath("orderattachment") . "/" . $attachment->getPath();
            if (file_exists($attachFile)) {
                unlink($attachFile);
            }
            $attachment->delete();
            $result = ['success' => true];
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
