<?php

namespace Swissup\Firecheckout\Model;

class ShippingAddressManagement
    extends \Magento\Checkout\Model\ShippingInformationManagement
    implements \Swissup\Firecheckout\Api\ShippingAddressManagementInterface
{
    /**
     * This method is used to retrieve updated payment methods list,
     * when changing shipping address.
     *
     * It's a copy of parent::saveShippingInformation method with supressed validation
     */
    public function saveShippingAddress(
        $cartId,
        \Magento\Checkout\Api\Data\ShippingInformationInterface $addressInformation
    ) {
        try {
            return parent::saveAddressInformation($cartId, $addressInformation);
        } catch (\Magento\Framework\Exception\StateException $e) {
            // supress all validation errors - we need to regenerate payments list

            // getPaymentDetails works if prepareShippingAssignment called before,
            // but it is private, so we use Reflection to call it.
            $quote = $this->quoteRepository->getActive($cartId);
            $reflectedClass = new \ReflectionClass($this);
            $method = $reflectedClass->getMethod('prepareShippingAssignment');
            $method->setAccessible(true);
            $method->invoke($this, $quote, $addressInformation->getShippingAddress(), null);

            try {
                $this->quoteRepository->save($quote);
            } catch (\Exception $e) {
                // $this->logger->critical($e);
            }

        } catch (\Exception $e) {
            // supress all validation errors - we need to regenerate payments list.

            // prepareShippingAssignment was already called, so we need
            // to return payment methods only.
        }

        return $this->getPaymentDetails($cartId);
    }

    protected function getPaymentDetails($cartId)
    {
        $paymentDetails = $this->paymentDetailsFactory->create();
        $paymentDetails->setPaymentMethods($this->paymentMethodManagement->getList($cartId));
        $paymentDetails->setTotals($this->cartTotalsRepository->get($cartId));
        return $paymentDetails;
    }
}
