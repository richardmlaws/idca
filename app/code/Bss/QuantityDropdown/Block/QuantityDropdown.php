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
namespace Bss\QuantityDropdown\Block;

use Magento\Framework\View\Element\Template;
use Bss\QuantityDropdown\Helper\Data;

class QuantityDropdown extends \Magento\Framework\View\Element\Template
{
    protected $stockItemRepository;
    protected $registry;
    protected $helper;
    protected $priceCurrency;
    protected $stockItem;
    protected $productFactory;

    public function __construct(
        Template\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\Pricing\PriceCurrencyInterface $priceCurrency,
        \Magento\Catalog\Model\ProductFactory $productFactory,
        \Magento\CatalogInventory\Api\StockStateInterface $stockItem,
        \Magento\CatalogInventory\Model\Spi\StockRegistryProviderInterface $stockItemRepository,
        Data $helper,
        array $data = []
    ) {

        parent::__construct($context, $data);
        $this->stockItemRepository = $stockItemRepository;
        $this->registry = $registry;
        $this->helper = $helper;
        $this->productFactory = $productFactory;
        $this->stockItem = $stockItem;
        $this->priceCurrency = $priceCurrency;
    }

    public function getProductItem($productId)
    {
        $product = $this->productFactory->create()->load($productId);
        return $product;
    }

    public function getStockItem($productId)
    {
        return $this->stockItemRepository->getStockItem($productId, 1);
    }

    public function callProduct()
    {
        return $this->registry->registry('recent_product')->getId();
    }

    public function getStockMaximumQty()
    {
        $product = $this->callProduct();
        return $this->getStockItem($product)->getQty();
    }

    public function getPrice()
    {
        $product = $this->callProduct();
        $price=$this->getProductItem($product)->getData("price");
        $specialprice=$this->getProductItem($product)->getData("special_price");
        if ($specialprice===null) {
            return $price;
        }
        if ($price<$specialprice) {
            return $price;
        }
        return $specialprice;
    }

    public function getTierPrice()
    {
        $product = $this->callProduct();
        $tierprice=$this->getProductItem($product)->getData("tier_price");

        foreach ($tierprice as $key => $value) {
            if ($value['price']>=$this->getPrice()) {
                unset($tierprice[$key]);
            }
        }
        return $tierprice;
    }
    public function getCustom()
    {
        return $this->helper->getCustom();
    }

    public function getShow()
    {
        return $this->helper->getShow();
    }

    public function getDefaultMax()
    {
        return $this->helper->getDefaultMax();
    }

    public function getMax()
    {
        $dmax=$this->getDefaultMax();
        $pmax=$this->getStockMaximumQty();
        if ($dmax<=$pmax) {
            return $dmax;
        }
        return $pmax;
    }

    public function getHide()
    {
        return $this->helper->getHide();
    }

    public function getEnable()
    {
        return $this->helper->getEnable();
    }

    public function getDisplay()
    {
        return $this->helper->getDisplay();
    }

    public function getDefaultValue()
    {
        return $this->helper->getDefaultValue();
    }

    public function checkProduct()
    {
        $product = $this->callProduct();
        $quantity_value=$this->getProductItem($product)->getData("quantity_value");
        if ($this->getProductItem($product)->getTypeId() == 'simple') {
            if ($this->getEnable()) {
                if ($quantity_value==3 || is_null($quantity_value)) {
                    if ($this->getDefaultValue()==1) {
                        return "general-default";
                    }
                    if ($this->getDefaultValue()==2) {
                        return "general-custom";
                    }
                }
                if ($quantity_value==0) {
                    return "none";
                }
                if ($quantity_value==1) {
                    return "product-default";
                }
                if ($quantity_value==2) {
                    return "product-custom";
                }
            }
        }
        return "none";
    }

    public function validCustom($custom)
    {
        foreach ($custom as $key => $value) {
            if (!is_numeric($value)) {
                unset($custom[$key]);
            }
        }
        return $custom;
    }

    public function checkError($product, $error, $value)
    {
        $productname=$this->getProductItem($product)->getName();
        $custom="";
        foreach ($value as $key) {
            $custom.=$key.',';
        }
        $custom=substr($custom, 0, -1);
        if ($error) {
            $message = $productname." is only sold when the selected quantity is ".$custom;
            $message .=" or multiples of these numbers.";
            throw new \Magento\Framework\Exception\LocalizedException(__($message));
        }
    }

    public function checkShow($show, $i, $newprice)
    {
        $cur=$this->priceCurrency->getCurrency()->getCurrencySymbol();
        if ($show=="total-price") {
            return $i." for total ".$i*$newprice." ".$cur;
        } elseif ($show=="price-per-one") {
            return $i." for ".(double)$newprice.$cur." each";
        } else {
            return $i;
        }
    }

    public function newPrice($tierprice, $i, $newprice)
    {
        foreach ($tierprice as $k => $v) {
            if ($i>=$v["price_qty"]) {
                $newprice=$v["price"];
            }
        }
        return $newprice;
    }

    public function htmlDef($product, $max, $enable_qty_increments, $qty, $realprice, $tierprice, $show)
    {
        $html="";
        if ($enable_qty_increments==1 && $qty>0) {
            $html = '<select type="number" name="qty" id="qty-'.$product.'" class="qty qty2" data-product-id="';
            $html .= $product.'">';
            $html .= '<option>-- Please Select --</option>';

            for ($i=0; $i<=$max; $i+=$qty) {
                if ($i!=0) {
                    $html .= '<option value='.$i.'>';
                    $newprice=$realprice;
                    $newprice=$this->newPrice($tierprice, $i, $newprice);
                    $html.= $this->checkShow($show, $i, $newprice);
                }
            }
            $html .= '</option>';
            $html .= '</select>';
        }
        return $html;
    }

    public function checkList()
    {
        $mode = $this->getRequest()->getParam('product_list_mode');
        if ($mode == 'list') {
            return true;
        }
        return false;
    }

    public function htmlCus($product, $cus, $max, $hide, $realprice, $tierprice, $show)
    {
        $cur=$this->priceCurrency->getCurrency()->getCurrencySymbol();
        $html = '<select type="number" name="qty" id="qty-'.$product.'" class="qty qty2" data-product-id="';
        $html .= $product.'">';
        $html .= '<option>-- Please Select --</option>';
        foreach ($cus as $key) {
            $html .= '<option value='.$key;
            if ($key>$max) {
                if ($hide=="show-noselect") {
                    $html .= " disabled";
                }
                if ($hide=="hide") {
                    $html .= " hidden";
                }
            }
            $html .= '>';
            $newprice=$realprice;
            foreach ($tierprice as $k => $v) {
                if ($key>=$v["price_qty"]) {
                    $newprice=$v["price"];
                }
            }
            if ($show=="total-price") {
                $html.= $key." for total ".$key*$newprice." ".$cur;
            } elseif ($show=="price-per-one") {
                $html.= $key." for ".(double)$newprice.$cur." each";
            } else {
                $html.=$key;
            }

            $html .= '</option>';
        }
        $html .= '</select>';

        return $html;
    }
}
