<?php
namespace Swissup\Orderattachment\Controller\Attachment;

use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Filesystem\DirectoryList;

class Preview extends Action
{
    /**
     * @var \Magento\Framework\Controller\Result\RawFactory
     */
    protected $resultRawFactory;
    /**
     * @var \Magento\Framework\File\Mime
     */
    private $mime;

    /**
     * @param \Magento\Framework\App\Action\Context $context
     */
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\Controller\Result\RawFactory $resultRawFactory,
        \Magento\Framework\File\Mime $mime)
    {
        parent::__construct($context);
        $this->resultRawFactory = $resultRawFactory;
        $this->mime = $mime;
    }

    public function execute()
    {
        $result = [];
        $attachmentId = $this->getRequest()->getParam('attachment');
        $hash = $this->getRequest()->getParam('hash');
        $download = $this->getRequest()->getParam('download');
        $response = $this->resultRawFactory->create();
        if (!$attachmentId || !$hash) {
            $result = ['success' => false, 'error' => __('Invalid Request Params')];
            $response->setHeader('Content-type', 'text/plain')
                ->setContents(json_encode($result));
            return $response;
        }
        try {
            $attachment = $this->_objectManager->create(
                'Swissup\Orderattachment\Model\Attachment'
            );
            $attachment->load($attachmentId);
            if (!$attachment->getId()) {
                $result = ['success' => false, 'error' => __('Can\'t find a attachment to delete.')];
                $response->setHeader('Content-type', 'text/plain')
                    ->setContents(json_encode($result));
                return $response;
            }
            if ($hash !== $attachment->getHash()) {
                $result = ['success' => false, 'error' => __('Invalid Hash Params')];
                $response->setHeader('Content-type', 'text/plain')
                    ->setContents(json_encode($result));
                return $response;
            }
            /** @var \Magento\Framework\Filesystem\Directory\Read $varDirectory */
            $varDirectory = $this->_objectManager->get('Magento\Framework\Filesystem')
                ->getDirectoryRead(DirectoryList::VAR_DIR);

            $attachmentFile = $varDirectory->getAbsolutePath("orderattachment") . "/" . $attachment->getPath();

            $attachmentType = explode('/', $attachment->getType());
            $handle = fopen($attachmentFile, "r");
            if ($download) {
                $response
                    ->setHeader('Content-Type', 'application/octet-stream', true)
                    ->setHeader('Content-Disposition', 'attachment; filename="' . basename($attachmentFile) . '"', true);
            } else {
                $response->setHeader('Content-Type', $attachment->getType(), true);
            }
            $response->setContents(fread($handle, filesize($attachmentFile)));
            fclose($handle);
        } catch (\Exception $e) {
            $result = ['success' => false, 'error' => $e->getMessage(), 'errorcode' => $e->getCode()];
            $response->setHeader('Content-type', 'text/plain');
            $response->setContents(json_encode($result));
        }

        return $response;
    }
}
