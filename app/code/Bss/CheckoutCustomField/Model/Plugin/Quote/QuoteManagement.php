<?php
/**
 * BSS Commerce Co.
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the EULA
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://bsscommerce.com/Bss-Commerce-License.txt
 *
 * =================================================================
 *                 MAGENTO EDITION USAGE NOTICE
 * =================================================================
 * This package designed for Magento COMMUNITY edition
 * BSS Commerce does not guarantee correct work of this extension
 * on any other Magento edition except Magento COMMUNITY edition.
 * BSS Commerce does not provide extension support in case of
 * incorrect edition usage.
 * =================================================================
 *
 * @category   BSS
 * @package    Bss_CheckoutCustomField
 * @author     Extension Team
 * @copyright  Copyright (c) 2015-2016 BSS Commerce Co. ( http://bsscommerce.com )
 * @license    http://bsscommerce.com/Bss-Commerce-License.txt
 */
namespace Bss\CheckoutCustomField\Model\Plugin\Quote;

use Magento\Authorization\Model\UserContextInterface;
use Magento\Framework\Event\ManagerInterface as EventManager;
use Magento\Sales\Api\Data\OrderInterfaceFactory as OrderFactory;
use Magento\Sales\Api\OrderManagementInterface as OrderManagement;
use Magento\Quote\Model\Quote\Address\ToOrder as ToOrderConverter;
use Magento\Quote\Model\Quote\Address\ToOrderAddress as ToOrderAddressConverter;
use Magento\Quote\Model\Quote\Item\ToOrderItem as ToOrderItemConverter;
use Magento\Quote\Model\Quote\Payment\ToOrderPayment as ToOrderPaymentConverter;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\Json\Helper\Data as JsonHelper;

class QuoteManagement extends \Magento\Quote\Model\QuoteManagement
{
    /**
     * @var \Bss\CheckoutCustomField\Model\Attribute $attribute
     */
    protected $attribute;

    /**
     * @var \Bss\CheckoutCustomField\Model\AttributeOption $attributeOption
     */
    protected $attributeOption;

    /**
     * @var \Magento\Framework\Json\Helper\Data $jsonHelper
     */
    protected $jsonHelper;

    /**
     * @var \Magento\Store\Model\StoreManagerInterface $storeManager
     */
    protected $storeManager;

    public function __construct(
        EventManager $eventManager,
        \Magento\Quote\Model\QuoteValidator $quoteValidator,
        OrderFactory $orderFactory,
        OrderManagement $orderManagement,
        \Magento\Quote\Model\CustomerManagement $customerManagement,
        ToOrderConverter $quoteAddressToOrder,
        ToOrderAddressConverter $quoteAddressToOrderAddress,
        ToOrderItemConverter $quoteItemToOrderItem,
        ToOrderPaymentConverter $quotePaymentToOrderPayment,
        UserContextInterface $userContext,
        \Magento\Quote\Api\CartRepositoryInterface $quoteRepository,
        \Magento\Customer\Api\CustomerRepositoryInterface $customerRepository,
        \Magento\Customer\Model\CustomerFactory $customerModelFactory,
        \Magento\Quote\Model\Quote\AddressFactory $quoteAddressFactory,
        \Magento\Framework\Api\DataObjectHelper $dataObjectHelper,
        StoreManagerInterface $storeManager,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Customer\Model\Session $customerSession,
        \Magento\Customer\Api\AccountManagementInterface $accountManagement,
        \Magento\Quote\Model\QuoteFactory $quoteFactory,
        JsonHelper $jsonHelper,
        \Bss\CheckoutCustomField\Model\Attribute $attribute,
        \Bss\CheckoutCustomField\Model\AttributeOption $attributeOption

    ) {
        parent::__construct(
            $eventManager,
            $quoteValidator,
            $orderFactory,
            $orderManagement,
            $customerManagement,
            $quoteAddressToOrder,
            $quoteAddressToOrderAddress,
            $quoteItemToOrderItem,
            $quotePaymentToOrderPayment,
            $userContext,
            $quoteRepository,
            $customerRepository,
            $customerModelFactory,
            $quoteAddressFactory,
            $dataObjectHelper,
            $storeManager,
            $checkoutSession,
            $customerSession,
            $accountManagement,
            $quoteFactory
        );
        $this->attribute = $attribute;
        $this->jsonHelper = $jsonHelper;
        $this->attributeOption = $attributeOption;
        $this->storeManager = $storeManager;
    }

    protected function submitQuote(\Magento\Quote\Model\Quote $quote, $orderData = [])
    {
        $request_body = file_get_contents('php://input');
        $data = json_decode($request_body, true);
        $order = $this->orderFactory->create();
        $this->quoteValidator->validateBeforeSubmit($quote);
        if (!$quote->getCustomerIsGuest()) {
            if ($quote->getCustomerId()) {
                $this->_prepareCustomerQuote($quote);
            }
            $this->customerManagement->populateCustomerInfo($quote);
        }
        $addresses = [];
        $quote->reserveOrderId();
        if ($quote->isVirtual()) {
            $this->dataObjectHelper->mergeDataObjects(
                '\Magento\Sales\Api\Data\OrderInterface',
                $order,
                $this->quoteAddressToOrder->convert($quote->getBillingAddress(), $orderData)
            );
        } else {
            $this->dataObjectHelper->mergeDataObjects(
                '\Magento\Sales\Api\Data\OrderInterface',
                $order,
                $this->quoteAddressToOrder->convert($quote->getShippingAddress(), $orderData)
            );
            $shippingAddress = $this->quoteAddressToOrderAddress->convert(
                $quote->getShippingAddress(),
                [
                    'address_type' => 'shipping',
                    'email' => $quote->getCustomerEmail()
                ]
            );
            $addresses[] = $shippingAddress;
            $order->setShippingAddress($shippingAddress);
            $order->setShippingMethod($quote->getShippingAddress()->getShippingMethod());
        }
        $billingAddress = $this->quoteAddressToOrderAddress->convert(
            $quote->getBillingAddress(),
            [
                'address_type' => 'billing',
                'email' => $quote->getCustomerEmail()
            ]
        );
        $addresses[] = $billingAddress;
        $order->setBillingAddress($billingAddress);
        $order->setAddresses($addresses);
        $order->setPayment($this->quotePaymentToOrderPayment->convert($quote->getPayment()));
        $order->setItems($this->resolveItems($quote));
        if ($quote->getCustomer()) {
            $order->setCustomerId($quote->getCustomer()->getId());
        }
        $order->setQuoteId($quote->getId());
        $order->setCustomerEmail($quote->getCustomerEmail());
        $order->setCustomerFirstname($quote->getCustomerFirstname());
        $order->setCustomerMiddlename($quote->getCustomerMiddlename());
        $order->setCustomerLastname($quote->getCustomerLastname());
        $this->addBssCustomField($data, $order);

        $this->eventManager->dispatch(
            'sales_model_service_quote_submit_before',
            [
                'order' => $order,
                'quote' => $quote
            ]
        );
        try {
            $order = $this->orderManagement->place($order);
            $quote->setIsActive(false);
            $this->eventManager->dispatch(
                'sales_model_service_quote_submit_success',
                [
                    'order' => $order,
                    'quote' => $quote
                ]
            );
            $this->quoteRepository->save($quote);
        } catch (\Exception $e) {
            $this->eventManager->dispatch(
                'sales_model_service_quote_submit_failure',
                [
                    'order'     => $order,
                    'quote'     => $quote,
                    'exception' => $e
                ]
            );
            throw $e;
        }
        return $order;
    }

    protected function addBssCustomField($data = null, $order = null)
    {
        $quote = $this->quoteRepository->get($order->getQuoteId());
        $customAttrShipping = $quote->getBssCustomfield() ? $this->jsonHelper->jsonDecode($quote->getBssCustomfield()) : [];
        $customAttr = $customAttrShipping;
        if(isset($data['paymentMethod']['extension_attributes']['bss_customfield']))
        {
            $customAttrPayment = $data['paymentMethod']['extension_attributes']['bss_customfield'];
            $customAttr = array_merge((array)$customAttrShipping, (array)$customAttrPayment);
        }        
        $attrCodes = array_keys($customAttr);
        $bssCustomfield = [];
        $collection = $this->attribute->getCollectionByCode($attrCodes);
        $storeId = $this->storeManager->getStore()->getId();
        foreach ($collection as $col) {
            $labels = $this->jsonHelper->jsonDecode($col->getFrontendLabel());
            $label = !empty($labels[$storeId]) ? $labels[$storeId] : $labels[0];
            if ($col->getFrontendInput() == 'multiselect') {
                $value = [];
                foreach ($customAttr[$col->getAttributeCode()] as $val) {
                    $value[] = $this->attributeOption->getLabel($col->getAttributeId(), $val);
                }
            } elseif ($col->getFrontendInput() == 'select') {
                $value = $this->attributeOption->getLabel($col->getAttributeId(), $customAttr[$col->getAttributeCode()]);
            } elseif ($col->getFrontendInput() == 'boolean') {
                $value = $customAttr[$col->getAttributeCode()] ? "Yes" : "No";
            }else {
                $value = $customAttr[$col->getAttributeCode()];
            }
            $bssCustomfield[$col->getAttributeCode()] = [
                'show_gird' => $col->getShowGird(),
                'show_in_order' => $col->getShowInOrder(),
                'show_in_pdf' => $col->getShowInPdf(),
                'show_in_email' => $col->getShowInEmail(),
                'frontend_label' => $label,
                'value' => $value,
                'val' => $customAttr[$col->getAttributeCode()],
                'type' => $col->getFrontendInput()
            ];
        }
        $order->setBssCustomfield($this->jsonHelper->jsonEncode($bssCustomfield));
    }
}
