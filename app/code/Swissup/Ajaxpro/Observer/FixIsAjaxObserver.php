<?php
namespace Swissup\Ajaxpro\Observer;

use Magento\Framework\Event\Observer;

use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Json\Helper\Data as jsonDataHelper;

class FixIsAjaxObserver implements ObserverInterface
{
    /**
     * json helper
     *
     * @var jsonDataHelper
     */
    protected $jsonHelper;


    /**
     * Constructor
     *
     * @param jsonDataHelper $helper
     */
    public function __construct(jsonDataHelper $jsonHelper)
    {
        $this->jsonHelper = $jsonHelper;
    }

    /**
     *
     * @param Observer $observer
     * @return void
     */
    public function execute(Observer $observer)
    {
        /** @var $request \Magento\Framework\App\RequestInterface */
        $request = $observer->getEvent()->getRequest();
        /** @var \Magento\Framework\App\Action\Action $controller */
        $controller = $observer->getControllerAction();
        /** @var $response \Magento\Framework\App\ResponseInterface */
        $response = $controller->getResponse();
        if ($request->isAjax()) {
            $result = [
                'action' => $request->getFullActionName()
            ];

            $response
                ->clearHeaders()
                ->setHttpResponseCode(200)
                ->representJson(
                    $this->jsonHelper->jsonEncode($result)
                )
                ->send();
            die; // escape redirect
        }
        return $this;
    }
}
