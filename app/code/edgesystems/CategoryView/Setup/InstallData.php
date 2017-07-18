<?php
 
namespace edgesystems\CategoryView\Setup;
 
use Magento\Eav\Setup\EavSetupFactory;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\InstallDataInterface;
 
 
class InstallData implements InstallDataInterface {
 
    private $eavSetupFactory;
 
    public function __construct(EavSetupFactory $eavSetupFactory) {
        $this->eavSetupFactory = $eavSetupFactory;
    }
 
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context) {
        $setup->startSetup();
 
        $eavSetup = $this->eavSetupFactory->create(['setup' => $setup]);
        $eavSetup->addAttribute(
                \Magento\Catalog\Model\Category::ENTITY, 'show_mode', [
            'type' => 'varchar',
            'label' => 'Show Mode',
            'input' => 'select',
            'required' => false,
            'source' => 'edgesystems\CategoryView\Model\Category\Attribute\Source\Showmode',
            'sort_order' => 102,
            'visible' => true,
            'user_defined' => true,
            'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
            'group' => 'Display Settings',
                ]
        );
 
 
        $setup->endSetup();
    }
 
}