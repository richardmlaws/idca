<?php

namespace Swissup\AddressFieldManager\Controller\Adminhtml\Index;

use Magento\Backend\App\Action\Context;
use Magento\Eav\Api\AttributeRepositoryInterface as AttributeRepository;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Eav\Api\Data\AttributeInterface;
use Swissup\AddressFieldManager\Model\Config\Source\Status;

class InlineEdit extends \Magento\Backend\App\Action
{
    const ADMIN_RESOURCE = 'Swissup_AddressFieldManager::save';

    /** @var AttributeRepository  */
    protected $attributeRepository;

    /** @var JsonFactory  */
    protected $jsonFactory;

    /**
     * @param Context $context
     * @param AttributeRepository $attributeRepository
     * @param JsonFactory $jsonFactory
     */
    public function __construct(
        Context $context,
        AttributeRepository $attributeRepository,
        JsonFactory $jsonFactory
    ) {
        parent::__construct($context);
        $this->attributeRepository = $attributeRepository;
        $this->jsonFactory = $jsonFactory;
    }

    /**
     * @return \Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        /** @var \Magento\Framework\Controller\Result\Json $resultJson */
        $resultJson = $this->jsonFactory->create();
        $error = false;
        $messages = [];

        if ($this->getRequest()->getParam('isAjax')) {
            $postItems = $this->getRequest()->getParam('items', []);
            if (!count($postItems)) {
                $messages[] = __('Please correct the data sent.');
                $error = true;
            } else {
                // copy same values into linked elements
                if (isset($postItems['region'])) {
                    $postItems['region_id'] = $postItems['region'];
                    $postItems['region_id']['attribute_code'] = 'region_id';
                }

                foreach ($postItems as $attributeCode => $values) {
                    /** @var \Magento\Customer\Model\Attribute $attribute */
                    $attribute = $this->attributeRepository->get('customer_address', $attributeCode);
                    $values = $this->prepareValues($values);

                    if (in_array($attributeCode, ['firstname', 'lastname'])) {
                        $values['is_visible'] = 1;
                        $values['is_required'] = 1;
                    }

                    if ('country_id' === $attributeCode) {
                        $values['is_visible'] = 1;
                    }

                    if ('region' === $attributeCode || 'region_id' === $attributeCode) {
                        $values['is_visible'] = 1;
                        $values['is_required'] = 0;
                    }

                    try {
                        $attribute->setData(array_merge($attribute->getData(), $values));
                        $this->attributeRepository->save($attribute);
                    } catch (\Exception $e) {
                        $messages[] = $this->getErrorWithAttributeId(
                            $attribute,
                            __($e->getMessage())
                        );
                        $error = true;
                    }
                }
            }
        }

        return $resultJson->setData([
            'messages' => $messages,
            'error' => $error
        ]);
    }

    /**
     * Convert status key into is_required and is_visible
     *
     * @param  array $values
     * @return array
     */
    protected function prepareValues($values)
    {
        switch ($values['status']) {
            case Status::HIDDEN:
                $values['is_required'] = 0;
                $values['is_visible']  = 0;
                break;
            case Status::REQUIRED:
                $values['is_required'] = 1;
                $values['is_visible']  = 1;
                break;
            case Status::OPTIONAL:
                $values['is_required'] = 0;
                $values['is_visible']  = 1;
                break;
        }
        unset($values['status']);
        return $values;
    }

    /**
     * Add attribute code to error message
     *
     * @param AttributeInterface $attribute
     * @param string $errorText
     * @return string
     */
    protected function getErrorWithAttributeId(AttributeInterface $attribute, $errorText)
    {
        return '[Attribute ID: ' . $attribute->getAttributeCode() . '] ' . $errorText;
    }
}
