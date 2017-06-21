<?php
namespace Swissup\Orderattachment\Controller\Attachment;

use Magento\Framework\App\Action\Action;

class Update extends Action
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
        \Magento\Framework\Controller\Result\RawFactory $resultRawFactory,
        \Magento\Framework\Escaper $escaper)
    {
        parent::__construct($context);
        $this->resultRawFactory = $resultRawFactory;
        $this->_escaper = $escaper;
    }

    public function execute()
    {
        $result = [];
        $isAjax = $this->getRequest()->isAjax();
        $isPost = $this->getRequest()->isPost();
        $request = $this->getRequest()->getParams();
        $attachmentId = $request['attachment'];
        $hash = $request['hash'];
        $comment = $this->_escaper->escapeHtml($request['comment']);
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
                $result = ['success' => false, 'error' => __('Can\'t find a attachment to update.')];
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
            /** @var \Magento\Framework\Filesystem\Directory\Read $mediaDirectory */
            $attachment->setComment($comment);
            $attachment->save();
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
