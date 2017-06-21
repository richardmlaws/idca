<?php
namespace Swissup\Orderattachment\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;
use Magento\Checkout\Model\ConfigProviderInterface;
use Magento\Framework\UrlInterface;
use Magento\Checkout\Model\Session as CheckoutSession;
use Swissup\Orderattachment\Model\Attachment;

class AttachmentConfigProvider implements ConfigProviderInterface
{
    protected $scopeConfig;

    protected $urlBuilder;

    public function __construct(
        ScopeConfigInterface $scopeConfig,
        UrlInterface $urlBuilder,
        CheckoutSession $checkoutSession,
        \Swissup\Orderattachment\Model\ResourceModel\Attachment\Collection $attachmentCollection
    ) {
        $this->scopeConfig = $scopeConfig;
        $this->urlBuilder = $urlBuilder;
        $this->_checkoutSession = $checkoutSession;
        $this->attachmentCollection = $attachmentCollection;
    }

    public function getConfig()
    {
        $attachSize = $this->getOrderAttachmentFileSize();
        return [
            'swissupAttachmentEnabled' => $this->isOrderAttachmentEnabled(),
            'attachments' => $this->getUploadedAttachments(),
            'swissupAttachmentLimit'    => $this->getOrderAttachmentFileLimit(),
            'swissupAttachmentSize'     => $this->getOrderAttachmentFileSize(),
            'swissupAttachmentExt'      => $this->getOrderAttachmentFileExt(),
            'swissupAttachmentUpload'   => $this->getAttachmentUploadUrl(),
            'swissupAttachmentUpdate'   => $this->getAttachmentUpdateUrl(),
            'swissupAttachmentRemove'   => $this->getAttachmentRemoveUrl(),
            'removeItem' => __('Remove Item'),
            'swissupAttachmentInvalidExt' => __('Invalid File Type'),
            'swissupAttachmentComment' => __('Write comment here'),
            'swissupAttachmentInvalidSize' => __('Size of the file is greather than allowed') . '(' . $attachSize . ' KB)',
            'swissupAttachmentInvalidLimit' => __('You have reached the limit of files'),
        ];
    }

    private function getUploadedAttachments()
    {
        if ($quoteId = $this->_checkoutSession->getQuote()->getId()) {
            $attachments = $this->attachmentCollection
                ->addFieldToFilter('quote_id', $quoteId)
                ->addFieldToFilter('order_id', ['is' => new \Zend_Db_Expr('null')]);

            $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
            $storeManager = $objectManager->get('Magento\Store\Model\StoreManagerInterface');
            $defaultStoreId = $storeManager->getDefaultStoreView()->getStoreId();
            foreach ($attachments as $attachment) {
                $url = $storeManager->getStore()->getBaseUrl(
                    \Magento\Framework\UrlInterface::URL_TYPE_MEDIA) . "orderattachment/" . $attachment['path'];
                $attachment->setUrl($url);
                $preview = $storeManager->getStore($defaultStoreId)->getUrl(
                    'orderattachment/attachment/preview',
                    [
                        'attachment' => $attachment['attachment_id'],
                        'hash' => $attachment['hash']
                    ]
                );
                $attachment->setPreview($preview);
                $attachment->setPath(basename($attachment->getPath()));
            }
            $result = $attachments->toArray();
            $result = $result['items'];
            return $result;
        }

        return false;
    }

    private function isOrderAttachmentEnabled()
    {
        $moduleEnabled = $this->scopeConfig->getValue(
            Attachment::XML_PATH_ENABLE_ATTACHMENT,
            ScopeInterface::SCOPE_STORE
        );
        $onCheckout = $this->scopeConfig->getValue(
            Attachment::XML_PATH_ATTACHMENT_ON_CHECKOUT,
            ScopeInterface::SCOPE_STORE
        );

        return ($moduleEnabled && $onCheckout);
    }

    private function getOrderAttachmentFileLimit()
    {
        return $this->scopeConfig->getValue(
            Attachment::XML_PATH_ATTACHMENT_FILE_LIMIT,
            ScopeInterface::SCOPE_STORE
        );
    }

    private function getOrderAttachmentFileSize()
    {
        return $this->scopeConfig->getValue(
            Attachment::XML_PATH_ATTACHMENT_FILE_SIZE,
            ScopeInterface::SCOPE_STORE
        );
    }

    private function getOrderAttachmentFileExt()
    {
        return $this->scopeConfig->getValue(
            Attachment::XML_PATH_ATTACHMENT_FILE_EXT,
            ScopeInterface::SCOPE_STORE
        );
    }

    public function getAttachmentUploadUrl()
    {
        return $this->urlBuilder->getUrl('orderattachment/attachment/upload');
    }

    public function getAttachmentUpdateUrl()
    {
        return $this->urlBuilder->getUrl('orderattachment/attachment/update');
    }

    public function getAttachmentRemoveUrl()
    {
        return $this->urlBuilder->getUrl('orderattachment/attachment/delete');
    }
}
