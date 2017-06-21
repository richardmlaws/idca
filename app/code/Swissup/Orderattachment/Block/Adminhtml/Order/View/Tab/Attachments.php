<?php
namespace Swissup\Orderattachment\Block\Adminhtml\Order\View\Tab;

use Magento\Sales\Block\Adminhtml\Order\AbstractOrder;
use Magento\Backend\Block\Widget\Tab\TabInterface;
use Magento\Store\Model\ScopeInterface;
use Swissup\Orderattachment\Model\Attachment;
use Magento\Framework\UrlInterface;

class Attachments extends AbstractOrder implements TabInterface
{
    public function getOrder()
    {
        return $this->_coreRegistry->registry('current_order');
    }

    public function getAttachmentConfig()
    {
        $scope = ScopeInterface::SCOPE_STORE;
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $_scopeConfig = $objectManager->get('Magento\Framework\App\Config\ScopeConfigInterface');
        $_jsonEncoder = $objectManager->get('Magento\Framework\Json\EncoderInterface');

        $config = [
            'attachments' => $this->getOrderAttachments(),
            'limit' => $_scopeConfig->getValue(Attachment::XML_PATH_ATTACHMENT_FILE_LIMIT, $scope),
            'size' => $_scopeConfig->getValue(Attachment::XML_PATH_ATTACHMENT_FILE_SIZE, $scope),
            'ext' => $_scopeConfig->getValue(Attachment::XML_PATH_ATTACHMENT_FILE_EXT, $scope),
            'uploadUrl' => $this->getUploadUrl(),
            'updateUrl' => $this->getUpdateUrl(),
            'removeUrl' => $this->getRemoveUrl()
        ];

        return $_jsonEncoder->encode($config);
    }

    public function getOrderAttachments()
    {
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $_attachment = $objectManager->get('Swissup\Orderattachment\Model\Attachment');
        $attachments = $_attachment->getOrderAttachments($this->getOrder()->getId());
        $urlBuilder = $objectManager->get('Magento\Framework\Url');
        $storeManager = $objectManager->get('Magento\Store\Model\StoreManagerInterface');
        $defaultStoreId = $storeManager->getDefaultStoreView()->getStoreId();
        if (count($attachments) > 0) {
            foreach ($attachments as &$attachment) {
                $url = $storeManager->getStore()->getBaseUrl(
                    UrlInterface::URL_TYPE_MEDIA) . "orderattachment/" . $attachment['path'];
                $preview = $urlBuilder->getUrl(
                    'orderattachment/attachment/preview',
                    [
                        'attachment' => $attachment['attachment_id'],
                        'hash' => $attachment['hash']
                    ]
                );
                $download = $urlBuilder->getUrl(
                    'orderattachment/attachment/preview',
                    [
                        'attachment' => $attachment['attachment_id'],
                        'hash' => $attachment['hash'],
                        'download' => 1
                    ]
                );
                $attachment['path'] = basename($attachment['path']);
                $attachment['url'] = $url;
                $attachment['comment'] = $this->escapeHtml($attachment['comment']);
                $attachment['preview'] = $preview;
                $attachment['download'] = $download;
            }
            return $attachments;
        }

        return false;
    }

    public function getUploadUrl()
    {
        return $this->getUrl(
            'orderattachment/attachment/upload',
            ['order_id' => $this->getOrder()->getId()]
        );
    }

    public function getUpdateUrl()
    {
        return $this->getUrl(
            'orderattachment/attachment/update',
            ['order_id' => $this->getOrder()->getId()]
        );
    }

    public function getRemoveUrl()
    {
        return $this->getUrl(
            'orderattachment/attachment/delete',
            ['order_id' => $this->getOrder()->getId()]
        );
    }

    public function getTabLabel()
    {
        return __('Order Attachments');
    }

    public function getTabTitle()
    {
        return __('Order Attachments');
    }

    public function canShowTab()
    {
        $scope = ScopeInterface::SCOPE_STORE;
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $_scopeConfig = $objectManager->get('Magento\Framework\App\Config\ScopeConfigInterface');

        return $_scopeConfig->getValue(Attachment::XML_PATH_ENABLE_ATTACHMENT, $scope);
    }

    public function isHidden()
    {
        return false;
    }
}
