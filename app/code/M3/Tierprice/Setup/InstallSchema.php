<?php

namespace M3\Tierprice\Setup;

use Magento\Framework\Setup\InstallSchemaInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\SchemaSetupInterface;
use Magento\Framework\DB\Ddl\Table;
use Magento\Framework\DB\Adapter\AdapterInterface;

class InstallSchema implements InstallSchemaInterface
{
    public function install(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $installer = $setup;

        $installer->startSetup();

		$tableName = $installer->getTable('catalog_product_entity_tier_price');
		if ($installer->getConnection()->isTableExists($tableName) == true)
		{
			$columns = [
				'isshow' => [
					'type' => \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
					'nullable' => false,
					'default' => '',
					'comment' => 'isshow',
				],

			];

			$connection = $installer->getConnection();
			foreach ($columns as $name => $definition) {
				$connection->addColumn($tableName, $name, $definition);
			}

	
			
		}
       

		$installer->endSetup();
       

    }
}