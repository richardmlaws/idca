<?php
namespace Swissup\Ajaxlayerednavigation\Plugin;

use Magento\Catalog\Controller\Category\View as Subject;
use Magento\Framework\Json\EncoderInterface as Encoder;

class AjaxCategoryProductList
{
    protected $_jsonEncoder;

    public function __construct(
        Encoder $_jsonEncoder
    ) {
        $this->_jsonEncoder = $_jsonEncoder;
    }

    public function afterExecute(Subject $subject, $page)
    {
        $request = $subject->getRequest();
        $isAjax = $request->isXmlHttpRequest();
        if ($isAjax && $request->getParam('aln')) {
            $layout = $page->getLayout();
            $ajaxPro = '';
            if ($ajaxPro = $layout->getBlock('ajaxpro.init')) {
                $ajaxPro = $ajaxPro->toHtml();
            }
            $output = [
                'list'    => $layout->getBlock('category.products')->toHtml() . $ajaxPro,
                'filters' => $layout->getBlock('catalog.leftnav')->toHtml(),
                'state'   => $layout->getBlock('catalog.navigation.state')->toHtml()
            ];
            return $subject->getResponse()->setBody(
                $this->_jsonEncoder->encode($output)
            );
        }
        return $page;
    }
}
