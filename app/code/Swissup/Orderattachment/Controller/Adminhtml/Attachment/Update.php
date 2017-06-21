<?php
namespace Swissup\Orderattachment\Controller\Adminhtml\Attachment;

class Update extends \Magento\Backend\App\Action
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
        \Magento\Framework\Escaper $escaper
    ) {
        parent::__construct($context);
        $this->resultRawFactory = $resultRawFactory;
        $this->_escaper = $escaper;
    }

    /**
     * @return bool
     */
    protected function _isAllowed()
    {
        return $this->_authorization->isAllowed('Swissup_Orderattachment::update');
    }

    /**
     * @return \Magento\Framework\Controller\Result\Raw
     */
    public function execute()
    {
        $result = [];
        $isAjax = $this->getRequest()->isAjax();
        $isPost = $this->getRequest()->isPost();
        $request = $this->getRequest()->getParams();
        $attachmentId = $request['attachment'];
        $hash = $request['hash'];
        $comment = $this->_escaper->escapeHtml($request['comment']);
        $orderId = $request['order_id'];
        if (!$isAjax || !$isPost || !$attachmentId || !$hash || !$orderId) {
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
            if (!$attachment->getId() || ($orderId !== $attachment->getOrderId())) {
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
