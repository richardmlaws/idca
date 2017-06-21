<?php
namespace Swissup\Orderattachment\Block\Email;

class Attachments extends \Magento\Framework\View\Element\Template
{
    protected $_template = 'email/order/attachments.phtml';

    public function getOrderId()
    {
        $order = $this->getData('order');
        if ($order) {
            return $order->getId();
        }
        return false;
    }

    public function getOrderAttachments()
    {
        $order = $this->getData('order');
        if (!$order) {
            return [];
        }
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $_attachment = $objectManager->get('Swissup\Orderattachment\Model\Attachment');
        $attachments = $_attachment->getAttachmentsByQuote($order->getQuoteId());
        $urlInterface = $objectManager->get('Magento\Framework\UrlInterface');
        if (count($attachments) > 0) {
            foreach ($attachments as &$attachment) {
                $download = $urlInterface->getUrl(
                    'orderattachment/attachment/preview',
                    [
                        'attachment' => $attachment['attachment_id'],
                        'hash' => $attachment['hash'],
                        'download' => 1
                    ]
                );
                $attachment['download'] = $download;
                $attachment['path'] = basename($attachment['path']);
            }
        }
        return $attachments;
    }
}
