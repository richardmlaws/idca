<?php
namespace Swissup\DeliveryDate\Plugin\Checkout\Model;

use Magento\Quote\Model\QuoteRepository;
use Magento\Checkout\Model\ShippingInformationManagement as Management;
use Magento\Checkout\Api\Data\ShippingInformationInterface;
use Magento\Checkout\Model\Session;

use Swissup\DeliveryDate\Model\DeliverydateFactory;
use Swissup\DeliveryDate\Helper\Data as DataHelper;

class ShippingInformationManagement
{
    /**
     *
     * @var QuoteRepository
     */
    protected $quoteRepository;

    /**
     * @var DeliverydateFactory
     */
    protected $deliverydateFactory;

    /**
     * @var Session
     */
    protected $session;

    /**
     * @var \Swissup\DeliveryDate\Helper\Data
     */
    public $dataHelper;

    /**
     *
     * @param QuoteRepository     $quoteRepository
     * @param DeliverydateFactory $deliverydateFactory
     * @param Session             $session
     */
    public function __construct(QuoteRepository $quoteRepository, DeliverydateFactory $deliverydateFactory, Session $session, DataHelper $dataHelper)
    {
        $this->quoteRepository = $quoteRepository;
        $this->deliverydateFactory = $deliverydateFactory;
        $this->session = $session;
        $this->dataHelper = $dataHelper;
    }

    /**
     * @param Management $subject
     * @param $cartId
     * @param ShippingInformationInterface $addressInformation
     */
    public function beforeSaveAddressInformation(
        Management $subject,
        $cartId,
        ShippingInformationInterface $addressInformation
    ) {
        $extAttributes = $addressInformation->getExtensionAttributes();
        $date = false;
        if ($extAttributes) {
            $date = $extAttributes->getDeliveryDate();
            $date = $this->dataHelper->formatMySqlDateTime($date);
        }

        if (false === $date) {
            $date = null;// return false;
        }

        $quote = $this->quoteRepository->getActive($cartId);
        $quote->setDeliveryDate($date);

        $this->session->setDeliveryDate($date);

        $modelDeliveryDate = $this->deliverydateFactory
            ->create()
            ->loadByQuoteId($quote->getId());

        $modelDeliveryDate->setDate($date)
            ->setQuoteId($quote->getId())
            ->save()
        ;
    }
}
