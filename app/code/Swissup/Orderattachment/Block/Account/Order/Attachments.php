<?php
namespace Swissup\Orderattachment\Block\Account\Order;

use Magento\Customer\Model\Context;
use Magento\Store\Model\ScopeInterface;
use Swissup\Orderattachment\Model\Attachment;
use Magento\Framework\UrlInterface;

class Attachments extends \Magento\Framework\View\Element\Template
{
    protected $_template = 'account/order/attachments.phtml';

    protected $_coreRegistry = null;

    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\Registry $registry,
        array $data = []
    ) {
        $this->_coreRegistry = $registry;
        parent::__construct($context, $data);
    }

    public function getOrder()
    {
        return $this->_coreRegistry->registry('current_order');
    }

    public function isOrderAttachmentEnabled()
    {
        $scope = ScopeInterface::SCOPE_STORE;
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $_scopeConfig = $objectManager->get('Magento\Framework\App\Config\ScopeConfigInterface');
        $moduleEnabled = $_scopeConfig->getValue(
            Attachment::XML_PATH_ENABLE_ATTACHMENT,
            ScopeInterface::SCOPE_STORE
        );

        return $moduleEnabled;
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
        $urlInterface = $objectManager->get('Magento\Framework\UrlInterface');
        if (count($attachments) > 0) {
            foreach ($attachments as &$attachment) {
                $url = $objectManager->get('Magento\Store\Model\StoreManagerInterface')
                    ->getStore()->getBaseUrl(UrlInterface::URL_TYPE_MEDIA) . "orderattachment/" . $attachment['path'];
                $preview = $urlInterface->getUrl(
                    'orderattachment/attachment/preview',
                    [
                        'attachment' => $attachment['attachment_id'],
                        'hash' => $attachment['hash']
                    ]
                );
                $download = $urlInterface->getUrl(
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

    public function IsAllowedFileUpload()
    {
        $scope = ScopeInterface::SCOPE_STORE;
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $_scopeConfig = $objectManager->get('Magento\Framework\App\Config\ScopeConfigInterface');

        return (bool)$_scopeConfig->getValue(Attachment::XML_PATH_ATTACHMENT_ON_ORDER_VIEW, $scope);
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
}
