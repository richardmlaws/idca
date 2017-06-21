<?php
namespace Swissup\Ajaxpro\Observer;

use Magento\Framework\Event\Observer;

use Magento\Framework\Event\ObserverInterface;
use Magento\Framework\Json\Helper\Data as jsonDataHelper;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Exception\NoSuchEntityException;

class FixIsAjaxCheckoutObserver implements ObserverInterface
{
    const ENABLE = 'ajaxpro/main/product';

    /**
     * json helper
     *
     * @var jsonDataHelper
     */
    protected $jsonHelper;

    /**
     * @var ProductRepositoryInterface
     */
    protected $productRepository;

    /**
     * @var StoreManagerInterface
     */
    protected $storeManager;

    /**
     * @var ScopeConfigInterface
     */
    protected $scopeConfig;

    /**
     * @var RequestInterface
     */
    protected $request;

    /**
     * Constructor
     *
     * @param jsonDataHelper $helper
     * @param ProductRepositoryInterface $productRepository
     * @param StoreManagerInterface $storeManager
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(
        jsonDataHelper $jsonHelper,
        ProductRepositoryInterface $productRepository,
        StoreManagerInterface $storeManager,
        ScopeConfigInterface $scopeConfig
    ) {
        $this->jsonHelper = $jsonHelper;
        $this->productRepository = $productRepository;
        $this->storeManager =  $storeManager;
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * Initialize product instance from request data
     *
     * @return \Magento\Catalog\Model\Product|false
     */
    protected function initProduct()
    {
        $productId = (int) $this->getRequest()->getParam('product');
        if ($productId) {
            $storeId = $this->storeManager->getStore()->getId();
            try {
                return $this->productRepository->getById($productId, false, $storeId);
            } catch (NoSuchEntityException $e) {
                return false;
            }
        }
        return false;
    }

    /**
     * [setRequest description]
     * @param \Magento\Framework\App\RequestInterface $request [description]
     */
    protected function setRequest(\Magento\Framework\App\RequestInterface $request)
    {
        $this->request = $request;
        return $this;
    }

    /**
     *
     * @return \Magento\Framework\App\RequestInterface
     */
    protected function getRequest()
    {
        return $this->request;
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
        $this->setRequest($request);

        /** @var \Magento\Framework\App\Action\Action $controller */
        $controller = $observer->getControllerAction();
        /** @var $response \Magento\Framework\App\ResponseInterface */
        $response = $controller->getResponse();

        if ($request->isAjax()) {
            $result = $response->getContent();
            // \Zend_Debug::dump();
            // die;
            $result = $this->jsonHelper->jsonDecode($result);

            $result['action'] = $request->getFullActionName();

            $enable = (bool) $this->getConfig(self::ENABLE);
            if (isset($result['backUrl']) && $enable) {
                $product = $this->initProduct();
                if ($product) {
                    $typeInstance = $product->getTypeInstance();
                    if ($typeInstance->hasRequiredOptions($product)
                        || $typeInstance->hasOptions($product)) {
                        $additional = [];
                        $additional['_escape'] = true;
                        $additional['_query'] = [];
                        $additional['_query']['options'] = 'cart';

                        $result['ajaxpro']['product'] = [
                            'id' => $product->getId(),
                            'product_url' => $product->getUrlModel()->getUrl($product, $additional),
                            'has_options' => true
                        ];
                    }
                }
            }

            // \Zend_Debug::dump($result);
            // die;

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

    /**
     *
     * @param  string $key
     * @param  string $scope
     * @return string
     */
    protected function getConfig($key, $scope = ScopeInterface::SCOPE_STORE)
    {
        return $this->scopeConfig->getValue($key, $scope);
    }
}
