<?php

namespace Swissup\Firecheckout\Helper;

class AdditionalContent extends \Magento\Framework\App\Helper\AbstractHelper
{
    /**
     * @var string
     */
    const CONFIG_PATH_CMS_BLOCK_TOP = 'firecheckout/additional_content/top';

    /**
     * @var string
     */
    const CONFIG_PATH_CMS_BLOCK_BOTTOM = 'firecheckout/additional_content/bottom';

    /**
     * @var string
     */
    const CONFIG_PATH_CMS_BLOCK_BELOW_ORDER_SUMMARY = 'firecheckout/additional_content/below_order_summary';

    /**
     * @var \Magento\Framework\View\LayoutFactory
     */
    protected $layoutFactory;

    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Framework\View\LayoutFactory $layoutFactory
    ) {
        $this->layoutFactory = $layoutFactory;

        parent::__construct($context);
    }

    /**
     * Get template path to render additional content
     *
     * @return string
     */
    public function getTemplate()
    {
        return 'Swissup_Firecheckout::additional_content.phtml';
    }

    /**
     * Get top cms block
     *
     * @return string
     */
    public function getTopCmsBlockId()
    {
        return $this->scopeConfig->getValue(
            self::CONFIG_PATH_CMS_BLOCK_TOP,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    /**
     * Get bottom cms block
     *
     * @return string
     */
    public function getBottomCmsBlockId()
    {
        return $this->scopeConfig->getValue(
            self::CONFIG_PATH_CMS_BLOCK_BOTTOM,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    /**
     * Get below order summary cms block
     *
     * @return string
     */
    public function getBelowOrderSummaryCmsBlockId()
    {
        return $this->scopeConfig->getValue(
            self::CONFIG_PATH_CMS_BLOCK_BELOW_ORDER_SUMMARY,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    /**
     * Render cms block by its identifier or ID
     *
     * @param  mixed $blockId
     * @param  string $blockCss Css class to use in content wrapper
     * @return string
     */
    public function render($blockId, $blockCss = null)
    {
        if (strpos($blockId, '::')) {
            $blockId = call_user_func($blockId);
        }

        if (!$blockId) {
            return '';
        }

        return $this->layoutFactory->create()
            ->createBlock('Magento\Cms\Block\Widget\Block')
            ->setTemplate($this->getTemplate())
            ->setBlockId($blockId)
            ->setBlockCss($blockCss)
            ->toHtml();
    }
}
