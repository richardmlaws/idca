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
 * @category  BSS
 * @package   Bss_QuantityDropdown
 * @author    Extension Team
 * @copyright Copyright (c) 2015-2016 BSS Commerce Co. ( http://bsscommerce.com )
 * @license   http://bsscommerce.com/Bss-Commerce-License.txt
 */
namespace Bss\QuantityDropdown\Plugin;

use \Bss\QuantityDropdown\Block\QuantityDropdown;

class CategoryPlugin
{
    protected $dropdown;
    protected $helper;
    protected $productFactory;
    protected $request;
    public function __construct(
        QuantityDropdown $dropdown,
        \Magento\Catalog\Model\ProductFactory $productFactory,
        \Magento\Framework\App\Request\Http $request,
        \Bss\QuantityDropdown\Helper\Data $helper
    ) {
        $this->dropdown=$dropdown;
        $this->helper=$helper;
        $this->productFactory = $productFactory;
        $this->request = $request;
    }

    public function afterToHtml($subject, $result)
    {
        $max=$this->dropdown->getMax();
        $product = $this->dropdown->callProduct();
        $qty=$this->dropdown->getStockItem($product)->getqty_increments();
        $in_stock=$this->dropdown->getStockItem($product)->getIsInStock();
        $quantity_value=$this->dropdown->getProductItem($product)->getData("quantity_value");
        $enaqtyvl=$this->dropdown->getStockItem($product)->getenable_qty_increments();
        $defaultcustom=$this->helper->getCustom();
        $realprice=$this->dropdown->getPrice();
        $tierprice=$this->dropdown->getTierPrice();
        $show=$this->helper->getShow();
        $hide=$this->helper->getHide();
        $type=$this->dropdown->checkProduct();
        $page=$this->request->getFullActionName();
        $list=["catalog_category_view","catalogsearch_result_index"];
        array_push($list, "catalog_product_compare_index", "wishlist_index_index");
        if ($this->dropdown->getDisplay()) {
            if ($in_stock) {
                if (in_array($page, $list)) {
                    if ($type=="general-default") {
                        $html=$this->dropdown->htmlDef($product, $max, $enaqtyvl, $qty, $realprice, $tierprice, $show);
                        return $result.$html;
                    }

                    if ($type=="general-custom") {
                        $cusbefore=explode(',', $this->helper->getCustom());
                        $cus= $this->dropdown->validCustom($cusbefore);
                        $html=$this->dropdown->htmlCus($product, $cus, $max, $hide, $realprice, $tierprice, $show);
                        return $result.$html;
                    }

                    if ($type=="product-default") {
                        $html=$this->dropdown->htmlDef($product, $max, $enaqtyvl, $qty, $realprice, $tierprice, $show);
                        return $result.$html;
                    }

                    if ($type=="product-custom") {
                        $cusbefore=explode(',', $this->dropdown->getProductItem($product)->getData("custom_value"));
                        $cus= $this->dropdown->validCustom($cusbefore);
                        $html=$this->dropdown->htmlCus($product, $cus, $max, $hide, $realprice, $tierprice, $show);
                        return $result.$html;
                    }
                }
            }
        }
        return $result;
    }
}
