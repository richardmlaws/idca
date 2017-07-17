<?php

/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Biztech\Productdesigner\Controller\Index;

class conti extends \Magento\Framework\App\Action\Action {

    protected $image;
    protected $_scopeConfig;

    const ResizeWidth      = 'productdesigner/general/imagewidth';
    const ResizeHeight     = 'productdesigner/general/imageheight';
    const ResizeWidthBand  = 'productdesigner/general/imagewidthband';
    const ResizeHeightBand = 'productdesigner/general/imageheightband';

    public function __construct(
    \Magento\Framework\App\Action\Context $context, \Magento\Catalog\Helper\Image $image,\Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
    ) {
        parent::__construct($context);
        $this->image = $image;
        $this->_scopeConfig = $scopeConfig;
    }

    /**
     * Index action
     *
     * @return $this
     */
    public function execute() {

        
        //$session = Mage::getSingleton('customer/session');
            $sub_total = 0;
        $result = array('status' => 'fail');
        if ($this->getRequest()->isPost()) {
            // $customerData = $session->getCustomer();
            // $customer_id = $customerData->getId();
            $params = $this->getRequest()->getParams();
            $images = $params['data']['images'];
            $isSVGCanvas = $params['data']['isSVGCanvas'];
            

            $large_images = $params['data']['large_images'];
            $prod_id = $params['data']['id'];
            $saveDesign = $this->_saveDesign($images, $large_images, $isSVGCanvas);
        }

        if ($saveDesign['success'] == 'success') {

            $result['status'] = 'redirect';
            $result['url'] = $saveDesign['url'];
            $result['design_id'] = $saveDesign['design_id'];
            $result['productid'] = $prod_id;
        }
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $obj_product = $objectManager->create('Biztech\Productdesigner\Model\Mysql4\Designs\Collection');
        $demo = $obj_product->getData();
        $design_id = 0 ;
        foreach ($demo as $d) {
            $design_id = $d['design_id'];
        }
        $obj_product = $objectManager->create('Biztech\Productdesigner\Model\Mysql4\Designs\Collection');
        $designModel = $obj_product->addFieldToFilter('design_id', $design_id)->getData();
        
        $sub_total = json_decode($designModel[0]['prices'])->sub_total;
        $params = $this->getRequest()->getParams();
        $prod_id = $params['data']['id'];
        $obj_product1 = $objectManager->create('Magento\Catalog\Model\Product');
        $product = $obj_product1->load($prod_id);

            $product->setHasOptions(true);

        $this->getResponse()->setBody(json_encode($result));
    }

    public function _saveDesign($images, $large_images, $isSVGCanvas, $customer_id = '') {

        


        $params = $this->getRequest()->getParams();
        
        $images = json_decode($images);    
        $large_images = json_decode($large_images);
        $parentImageId = json_decode($params['data']['parentImageId']);
        $masking_images = json_decode($params['data']['masking_images']);
        //$selected_qty        = json_decode($params['data']['selected_qty'],true);


        $prod_id = $params['data']['id'];
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $obj_product = $objectManager->create('Magento\Catalog\Model\Product');
        $product = $obj_product->load($prod_id);

        //$demo = $objectManager->create('\Magento\Store\Model\StoreManagerInterface');
        $prod_url = $product->getProductUrl();
        //$prod_url   = Mage::getBaseUrl().$product->getUrlPath();
        $product_images = $product->getMediaGalleryImages();
        $color_id = $params['data']['color'];
        $prices = $params['data']['prices'];
        $layers = $params['data']['layers'];
        $isGroupOrder = $params['data']['isGroupOrder'];
        if(isset($params['data']['group_order_details']))
        $group_order_details = $params['data']['group_order_details'];
        else
        $group_order_details = '';
        $customer_comments = $params['data']['customer_comments'];
        $layer_images = array();
        $layers = json_decode($layers);
        foreach ($layers as $key => $layer) {
           if (isset($layer[0]->image_url) && $layer[0]->image_url) {
                $image = $layer[0]->image_url;

                $pathinfo = pathinfo($image);
                $ext = $pathinfo['extension'];
            } else {

                $image = base64_decode($layer[0]->image_data);
                $ext = ".png";
            }

            $time = substr(md5(microtime()),
                    rand(0,
                            26),
                    7);
            if ($ext == 'svg') {
                $image_name = "layer_" . $time . ".svg";
            } else {
                $image_name = "layer_" . $time . "." . $ext;
            }



            //$image_path = $image_name->setFilesDispersion();
            //$large_image_path = $this->getDispretionPath($large_image_name);
            $filesystem = $objectManager->get('Magento\Framework\Filesystem');
            $reader = $filesystem->getDirectoryRead(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA);
            $dir = $reader->getAbsolutePath() . 'productdesigner/designs/catalog/product/layers';
            //$dir= Mage::getBaseDir(Mage_Core_Model_Store::URL_TYPE_MEDIA).DS.'productdesigner'.DS.'designs'.DS.'catalog'.DS.'product'.DS.'layers'.$image_path;
            if (!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }
            $dirImg = $dir . '/' . $image_name;
            $demo = $objectManager->create('\Magento\Store\Model\StoreManagerInterface');
            $url = 'productdesigner/designs/catalog/product/layers/' . $image_name;

              
            $layer_images[$key] = array(
                "url" => $url,
                "product_id" => isset($layer[0]->product_id) ? $layer[0]->product_id : '',
                "top" => isset($layer[0]->top) ? $layer[0]->top : '',
                "left" => isset($layer[0]->left) ? $layer[0]->left : '',
                "tab" => isset($layer[0]->tab) ? $layer[0]->tab : '',
                "group_type" => isset($layer[0]->group_type) ? $layer[0]->group_type : '',
                "last_row_size" => isset($layer[0]->last_row_size) ? $layer[0]->last_row_size : '',
                "type" => isset($layer[0]->type) ? $layer[0]->type : '',
                "text" => isset($layer[0]->text) ? $layer[0]->text : '',
                "textObj" => isset($layer[0]->textObj) ? $layer[0]->textObj : '',
                "name" => isset($layer[0]->name) ? $layer[0]->name : '',
                "arc"  => isset($layer[0]->arc) ? $layer[0]->arc : 0 ,
                "image_id" => isset($layer[0]->image_id) ? $layer[0]->image_id : '',
                "designarea_id" => isset($layer[0]->designarea_id) ? $layer[0]->designarea_id : '',                
                "price" => isset($layer[0]->price) ? $layer[0]->price : '',
                 "angle" => isset($layer[0]->angle) ? $layer[0]->angle : '',
                "objFilters" => isset($layer[0]->objFilters) ? $layer[0]->objFilters : '',
                "used_colors_old" => isset($layer[0]->obj_used_colors_obj) ? $layer[0]->obj_used_colors_obj : '',
                "resized_url" => isset($layer[0]->resized_url) ? $layer[0]->resized_url : '',
                "image_side" => isset($layer[0]->image_side) ? $layer[0]->image_side : '',
                "brush_path" => isset($layer[0]->brush_path) ? $layer[0]->brush_path : '',
                "height" => isset($layer[0]->height) ? $layer[0]->height : '',
                "width" => isset($layer[0]->width) ? $layer[0]->width : '',
                "scalex" => isset($layer[0]->scalex) ? $layer[0]->scalex : '',
                "scaley" => isset($layer[0]->scaley) ? $layer[0]->scaley : '',
                "wInnerWidth" => isset($layer[0]->wInnerWidth) ? $layer[0]->wInnerWidth : '',
                "zIndex" =>  isset($layer[0]->zIndex) ? $layer[0]->zIndex : '',
                "textarea" =>  isset($layer[0]->textarea) ? $layer[0]->textarea : '',
                
            );
             if (isset($layer[0]->image_url) && $layer[0]->image_url) {
                file_put_contents($dirImg, file_get_contents($image));
            } else {
                file_put_contents($dirImg, $image);
            }
        }

        foreach($masking_images as $key => $mask_layer)
            {   

                $image = $mask_layer;
                $time = substr(md5(microtime()),rand(0,26),7);  
                $mask_image_name = "mask_".$time.".svg";  
                
                $dir= $reader->getAbsolutePath().'/productdesigner/designs/catalog/product/mask/'.$mask_image_name;
                if(!file_exists($dir)){
                    mkdir($dir, 0777, true);
                }
                $dirImg= $dir.'/'.$mask_image_name;
                $url = $demo->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA).'productdesigner/designs/catalog/product/mask/m/a/'.$mask_image_name;
                $masking_data[$key] = array(
                    "url" => $url,
                );
                file_put_contents($dirImg, file_get_contents($image));
            }

        $product_type = $product->getTypeId();

        if ($product_type == 'configurable') {
            // get images of child product
            $obj_product = $objectManager->create('Magento\ConfigurableProduct\Model\Product\Type\Configurable');
            $childProducts = $obj_product->getChildrenIds($prod_id);


            $grouped_product_images = array();
            foreach ($childProducts[0] as $childProduct) {
                $obj_product = $objectManager->create('Magento\Catalog\Model\Product');
                $childProduct = $obj_product->load($childProduct);

                foreach ($childProduct->getMediaGalleryImages() as $_image) {
                    $grouped_product_images[] = $_image;
                }
            }
            // get images of child product
        } else {
            $grouped_product_images = array();
            $grouped_product_images = $product_images;
        }





        $params = $this->getRequest()->getParams();
        $designModel = $objectManager->create('Biztech\Productdesigner\Model\Designs');
        //$designModel = Mage::getModel('productdesigner/designs');
        $designModel->setProductId($prod_id)
                ->setCustomerId($customer_id)
                ->setColorId($color_id)
                ->setLayers($params['data']['layers'])
                ->setLayerImages(json_encode($layer_images))
                ->setMaskingImages(json_encode($masking_images))
                ->setPrices($prices)
                ->setGroupOrderDetails($group_order_details == "[]" ? NULL : $group_order_details)
                ->setCustomerComments($customer_comments);
        $designModel->save();




        $merged_images = array();
        foreach ($images as $key => $image) {
            $newkey = str_replace('@', '', $key);
            $newkey1 = strstr($newkey, "&", true);
            $newkey2 = str_replace('&', '', strstr($newkey, "&", false));
            $merged_images[$newkey1]['sides'][$newkey2] = $image;
            $merged_images[$newkey1]['isSideSvg'] = 'false';
            if($isSVGCanvas[$key] == 'true'){
                $merged_images[$newkey1]['isSideSvg'] = 'true';
            }
        }
        
        


        



        $merged_large_images = array();
        foreach ($large_images as $key => $large_image) {
            $newkey = str_replace('@', '', $key);
            $newkey1 = strstr($newkey, "&", true);
            $newkey2 = str_replace('&', '', strstr($newkey, "&", false));
            $merged_large_images[$newkey1][$newkey2] = $large_image;
        }




        $parentImageids = array();
        foreach ($parentImageId as $key => $parentImage) {
            $newkey = str_replace('@', '', $key);
            $newkey1 = strstr($newkey, "&", true);
            $newkey2 = str_replace('&', '', strstr($newkey, "&", false));
            $parentImageids[$newkey1] = $parentImage;
        }

        $isEnableBand = $product->getEnableWristband();
        if(!$isEnableBand)
            $isEnableBand = 0;
        foreach ($merged_large_images as $key => $large_image) {



            foreach ($grouped_product_images as $product_image) {
                // $newkey = str_replace('@','',$key);
                // $newkey1 = strstr($newkey,"&",true);
                if ($product_image->getId() == $key) {
                    $prod_image_path = $product_image->getPath();

                    $image_id = $parentImageids[$key];
                    $image = $merged_images[$key]['sides'];

                    $isSideSvgfinal = $merged_images[$key]['isSideSvg'];
                    
                    

                    

                    $design_images = $this->saveDesignImages($prod_image_path, $image, $large_image, $image_id, $isSideSvgfinal,$isEnableBand);



                    

                    try {

                        //$designImagesModel = Mage::getModel('productdesigner/designimages');
                        foreach ($design_images as $image_key => $design_image) {

                            $designImagesModel = $objectManager->create('Biztech\Productdesigner\Model\Designimages');
                            $designImagesModel->setDesignId($designModel->getId())
                                    ->setDesignImageType($image_key)
                                    ->setProductImageId($key)
                                    ->setImagePath(str_replace('\\', '/', $design_image));
                            $designImagesModel->save();
                        }

                        $result['success'] = 'success';
                        $result['design_id'] = $designModel->getId();
                        $result['url'] = $prod_url . '?design_id=' . $result['design_id'];


                        // $result['cartProcess'] = $this->_addToCart($prod_id,$designModel->getId(),$group_order_details, $selected_qty);
                        // $result['url'] = Mage::getUrl('checkout/cart');



                        $a = $objectManager->create('Magento\Store\Model\StoreManagerInterface')->getStore()->getBaseUrl();
                        /* share on social media */
                        $result['fbshare'] = "http://www.facebook.com/sharer.php?u=" . urlencode($a . "productdesigner/?id=" . $prod_id . "&design=" . $designModel->getId());

                        $result['twshare'] = "http://twitter.com/share?text=My%20Custom%20Design&url=" . urlencode($a . "productdesigner/?id=" . $prod_id . "&design=" . $designModel->getId());

                        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
                        $obj_product = $objectManager->create('Magento\Catalog\Model\Product');
                        $product = $obj_product->load($prod_id);
                        $designImagesModel = $objectManager->create('Biztech\Productdesigner\Model\Mysql4\Designimages\Collection');
                        $designImages = $designImagesModel->addFieldToFilter('design_id', Array('eq' => $designModel->getId()))->addFieldToFilter('design_image_type', 'base')->getData();


                        $media_path = $this->image->init($product, 'product_page_image_small')->setImageFile($designImages[0]['image_path'])->getUrl();


                        $result['pinshare'] = "http://pinterest.com/pin/create/button/?url=" . urlencode($a . "productdesigner/?id=" . $prod_id . "&design=" . $designModel->getId()) . "&media=" . urlencode($media_path) . "&description=" . urlencode("My Custom Design");


                        $result['gshare'] = "https://plus.google.com/share?url=" . urlencode($a . "productdesigner/?id=" . $prod_id . "&design=" . $designModel->getId());
                        /* ends */
                    } catch (\Exception $e) {
                        $result['error'] = $e->getMessage();
                    }
                }
            }
        }
        
        // die('save design images');

        /* $result['isGroupOrder'] = true;
          print_r($selected_qty);
          die('11');
          $result['cartProcess'] = $this->_addToCart($prod_id,$designModel->getId(),$group_order_details,$selected_qty);
          $result['url'] = Mage::getUrl('checkout/cart');

          if($isGroupOrder == 1)
          {

          $result['isGroupOrder'] = true;
          $result['cartProcess'] = $this->_addToCart($prod_id,$designModel->getId(),$group_order_details);
          $result['url'] = Mage::getUrl('checkout/cart');
          } */
        return $result;
    }

    public function saveDesignImages($prod_image_path, $image, $large_image, $image_id, $isSideSvgfinal,$isEnableBand = 0) {    

        
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $config = $objectManager->create('Magento\Framework\App\Config\ScopeConfigInterface');

        $isGoogleFontEnable = $config->getValue('productdesigner/textconfiguration/enablegooglefonts');
        if ($isGoogleFontEnable):
            $googleFontList = $config->getValue('productdesigner/textconfiguration/googlefontlist');
            $googleFontListCss = str_replace(',', '|', $googleFontList);
            $googleapis = "https://fonts.googleapis.com/css?family=" . $googleFontListCss;
            $googleapis_style = '<defs><style type="text/css">@import url(' . $googleapis . ');</style></defs>';
        endif;



        $result = array();

        /*$decodedimage = array();
        foreach ($image as $key => $value) {
            $decodedimage[$key] = base64_decode($value);
        }*/
        
        




        $decodedlargeimage = array();
        foreach ($large_image as $key => $value) {
            $decodedlargeimage[$key] = base64_decode($value);
        }




        $srcNew = array();
        foreach ($decodedlargeimage as $key => $value) {
            $srcNew[$key] = imagecreatefromstring($value);
        }



        $time = substr(md5(microtime()), rand(0, 26), 7);




        //image store in orig start  -- 2- des png and des large png starts

        $image_name = "des_" . $time . ".png";
        $large_image_name = "des_" . $time . "_large.png";
        //$image_path = $this->getDispretionPath($image_name);
        //$large_image_path = $this->getDispretionPath($large_image_name);
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $filesystem = $objectManager->get('Magento\Framework\Filesystem');
        $reader = $filesystem->getDirectoryRead(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA);
        $dir = $reader->getAbsolutePath() . 'productdesigner/designs/catalog/product/orig';
        if (!file_exists($dir)) {
            mkdir($dir, 0777, true);
        }

        
        //Save SVG file

        

        //Save SVG file
        if ($isSideSvgfinal == 'true') {
            //Merge Multiple SVGs into one SVG code start
            if (count($image) > 1) {
                $svgarray = array();
                $usearray = '';
                $svgarray = '<?xml version="1.0" encoding="utf-8"?>';
                $svgarray .= '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
                $svgarray .= '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
                $svgarray .= '<defs>';


                $k = 0;
                foreach ($image as $key => $value) {

                    $newkey = explode('&', $key);
                    $ret_string = str_replace('<?xml version="1.0" encoding="UTF-8" standalone="no" ?>', "", $value);
                    $ret_string1 = str_replace('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">', "", $ret_string);
                    $ret_string2 = str_replace('<svg', '<svg id="' . $k . '"', $ret_string1);
                    $svgarray .= $ret_string2;

                    $xmlget = simplexml_load_string($ret_string2);
                    $xmlattributes = $xmlget->attributes();
                    $svgwidth = (string) $xmlattributes->width;
                    $svgheight = (string) $xmlattributes->height;



                    
                    $objSelectionArea = $objectManager->create('Biztech\Productdesigner\Model\Selectionarea')->load($newkey);
                    $x1 = json_decode($objSelectionArea->getSelectionArea())->x1;
                    $y1 = json_decode($objSelectionArea->getSelectionArea())->y1;
                    $width1 = json_decode($objSelectionArea->getSelectionArea())->width;
                    $height1 = json_decode($objSelectionArea->getSelectionArea())->height;



                   




                    /*$dimensions = Mage::getModel('productdesigner/selectionarea')->getCollection()->addFieldToFilter('design_area_id', $newkey)->getData();
                    foreach ($dimensions as $d) {
                        $x1 = json_decode($d['selection_area'])->x1;
                        $y1 = json_decode($d['selection_area'])->y1;
                        $width1 = json_decode($d['selection_area'])->width;
                        $height1 = json_decode($d['selection_area'])->height;
                    }*/


                    










                    $usearray .= '<use xlink:href="#' . $k . '" x="' . $x1 . '" y="' . $y1 . '"  width="' . $o_width . '" height="' . $o_height . '"/>';

                    $k = $k + 1;
                }
                $svgarray .= '</defs>';
                $svgarray .= $usearray;
                $svgarray .= '</svg>';

                $svg_name = "des_" . $time . ".svg";
                $fp = fopen($dir . DS . $svg_name, 'w+');
                $temp = fwrite($fp, $svgarray);
            }
            //Merge Multiple SVGs into one SVG code end
            if (count($image) == 1) {

                // $search = "<desc>Created with Fabric.js 1.6.2</desc>";
                $search = "<desc>Created with Fabric.js 1.4.6</desc>";
                foreach ($image as $key => $value) {
                    $newkey = explode('&', $key);

                    if (strpos($value, $search) !== false) {
                        $found = true;
                        //$newsvg = str_replace('<desc>Created with Fabric.js 1.6.2</desc>', '<desc>Created with Fabric.js 1.6.2</desc>'.$googleapis_style, $value);
                        $newsvg = str_replace('<desc>Created with Fabric.js 1.4.6</desc>', '<desc>Created with Fabric.js 1.4.6</desc>' . $googleapis_style, $value);
                    }

                    /*$dimensions = Mage::getModel('productdesigner/selectionarea')->getCollection()->addFieldToFilter('design_area_id', $newkey)->getData();

                    foreach ($dimensions as $d) {
                        $newx1 = json_decode($d['selection_area'])->x1;
                        $newy1 = json_decode($d['selection_area'])->y1;
                        $newwidth1 = json_decode($d['selection_area'])->width;
                        $newheight1 = json_decode($d['selection_area'])->height;
                    }*/

                    
                    $objSelectionArea = $objectManager->create('Biztech\Productdesigner\Model\Selectionarea')->load($newkey);

                    $x1 = json_decode($objSelectionArea->getSelectionArea())->x1;
                    $y1 = json_decode($objSelectionArea->getSelectionArea())->y1;
                    $width1 = json_decode($objSelectionArea->getSelectionArea())->width;
                    $height1 = json_decode($objSelectionArea->getSelectionArea())->height;




                }


                //To get first key making reset array
                reset($image);
                $first_key = key($image);

                $svg_name = "des_" . $time . ".svg";
                $fp = fopen($dir .'/'. $svg_name, 'w+');
                $temp = fwrite($fp, $image[$first_key]);
                fclose($fp);
            }
        }





        $dirImg = $dir . '/' . $image_name;

        $testdirImg1 = $dir . '/' . 'test1.png';
        $testdirImg2 = $dir . '/' . 'test2.png';

        list($o_width, $o_height) = getimagesize($prod_image_path);
        $dest = imagecreatetruecolor($o_width, $o_height);

        

        $obj_product = $objectManager->create('Biztech\Productdesigner\Model\Mysql4\Selectionarea\Collection')->addFieldToFilter('image_id', $image_id);
        $dimensions = $obj_product->getData();
        //$dimensions = Mage::getModel('productdesigner/selectionarea')->getCollection()->addFieldToFilter('image_id',$image_id)->getData();


     

        /*header('Content-type: image/png');
        imagepng($srcNew[81], $testdirImg1);
        header('Content-type: image/png');
        imagepng($srcNew[89], $testdirImg2);
        die;*/
        
        foreach ($dimensions as $d) {

            
            

            
            $x1 = json_decode($d['selection_area'])->x1;
            $y1 = json_decode($d['selection_area'])->y1;
            if (isset($srcNew[$d['design_area_id']]))
            imagecopy($dest, $srcNew[$d['design_area_id']], $x1, $y1, 0, 0, imagesx($srcNew[$d['design_area_id']]), imagesy($srcNew[$d['design_area_id']]));
        }
        header('Content-type: image/png');
        imagepng($dest, $dirImg);

        





        $dirLargeImg = $dir . '/' . $large_image_name;
        foreach ($dimensions as $d) {
            $x1 = json_decode($d['selection_area'])->x1;
            $y1 = json_decode($d['selection_area'])->y1;
            if (isset($srcNew[$d['design_area_id']]))
            imagecopy($dest, $srcNew[$d['design_area_id']], $x1, $y1, 0, 0, imagesx($srcNew[$d['design_area_id']]), imagesy($srcNew[$d['design_area_id']]));
        }
        header('Content-type: image/png');
        imagepng($dest, $dirLargeImg);





        $config = $objectManager->create('Magento\Framework\App\Config\ScopeConfigInterface');

        $resize_width       = $this->_scopeConfig->getValue(self::ResizeWidth, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
        $resize_height      = $this->_scopeConfig->getValue(self::ResizeHeight, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
        $resize_width_band  = $this->_scopeConfig->getValue(self::ResizeWidthBand, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
        $resize_height_band = $this->_scopeConfig->getValue(self::ResizeHeightBand, \Magento\Store\Model\ScopeInterface::SCOPE_STORE);

        if (!isset($resize_width) && $resize_width == null) {
            $resize_width = 540;
        }
        if (!isset($resize_height) && $resize_height == null) {
            $resize_height = 650;
        }

        if ($isEnableBand) {

            $resize_width  = $resize_width_band;
            $resize_height = $resize_height_band;
            if (!isset($resize_width_band) && $resize_width_band == null) {
                $resize_width = 540;
            }
            if (!isset($resize_height_band) && $resize_height_band == null) {
                $resize_height = 100;
            }
        }

        $base_image_name = "pd_" . $time . ".jpg";
        //$base_path = $this->getDispretionPath($base_image_name);

        $prod_image_dir = $reader->getAbsolutePath() . 'productdesigner/designs/catalog/product/base';
        $new_prod_image = $prod_image_dir . '/' . $base_image_name;

        $default_prod_image_path = $reader->getAbsolutePath() . 'catalog/product';
        $default_prod_image = $default_prod_image_path . '/' . $base_image_name;
        if (!file_exists($default_prod_image_path)) {
            mkdir($default_prod_image_path, 0777, true);
        }
        if (!file_exists($prod_image_dir)) {
            mkdir($prod_image_dir, 0777, true);
        }
        $newPath_c = $new_prod_image;

        $resize = $this->resizeAndCreateDesignImage($prod_image_path, $newPath_c, $resize_width, $resize_height);


        if ($resize) {

            // image store in base start - 1 - jpg

            $info = getimagesize($newPath_c);
            $imgtype = image_type_to_mime_type($info[2]);
            switch ($imgtype) {
                case 'image/jpeg':
                    $dest = imagecreatefromjpeg($newPath_c);
                    break;
                case 'image/gif':
                    $dest = imagecreatefromgif($newPath_c);
                    break;
                case 'image/png':
                    $dest = imagecreatefrompng($newPath_c);
                    break;
                default:
                    break;
            }
            $obj_product = $objectManager->create('Biztech\Productdesigner\Model\Mysql4\Selectionarea\Collection')->addFieldToFilter('image_id', $image_id);
            $dimensions = $obj_product->getData();
            //$dimensions = Mage::getModel('productdesigner/selectionarea')->getCollection()->addFieldToFilter('image_id',$image_id)->getData();

            foreach ($dimensions as $d) {
                $x1 = json_decode($d['selection_area'])->x1;
                $y1 = json_decode($d['selection_area'])->y1;
                if (isset($srcNew[$d['design_area_id']]))
                imagecopy($dest, $srcNew[$d['design_area_id']], $x1, $y1, 0, 0, imagesx($srcNew[$d['design_area_id']]), imagesy($srcNew[$d['design_area_id']]));
            }
            header('Content-Type: image/png');
            imagesavealpha($dest, true);
            imagejpeg($dest, $newPath_c, 100);
            copy($newPath_c, imagepng(imagecreatefromstring(file_get_contents($newPath_c)), $default_prod_image));
            //imagedestroy($dest);
            //imagedestroy($srcNew);
            // high resolution images in base 2 - pd_res png and jpg


             $base_high_image = "pd_res_" . $time . ".jpg";
            $newPath_high = $prod_image_dir . '/' . $base_high_image;
            $default_prod_image_high_jpg = $default_prod_image_path.'/'.$base_high_image;
            $base_high_image_png = "pd_res_" . $time . ".png";
            $newPath_high_png = $prod_image_dir . '/' . $base_high_image_png;
             $default_prod_image_high_png = $default_prod_image_path.'/'.$base_high_image_png;

            $oinfo = getimagesize($prod_image_path);
            $oimgtype = image_type_to_mime_type($oinfo[2]);


            if ($oimgtype == 'image/png') {
                list($o_width, $o_height) = getimagesize($prod_image_path);
                    $file = imagecreatetruecolor($o_width, $o_height);
                    $new = imagecreatefrompng($prod_image_path);
                    $kek=imagecolorallocate($file, 255, 255, 255);
                    imagefill($file,0,0,$kek);
                    imagecopyresampled($file, $new,0,0, 0, 0,$o_width, $o_height,$o_width, $o_height);
                    imagejpeg($file, $newPath_high, 100);
                    copy($prod_image_path, $newPath_high_png);
                     copy($prod_image_path, $default_prod_image_high_png);
            } else {
                copy($prod_image_path, $newPath_high);
                copy($prod_image_path, $newPath_high_png);
                copy($prod_image_path, $default_prod_image_high_png);
            }
            $ssrc = imagecreatefrompng($dirLargeImg);
            $sinfo = getimagesize($newPath_high);
            $simgtype = image_type_to_mime_type($sinfo[2]);

            switch ($simgtype) {
                case 'image/jpeg':
                    $sdest = imagecreatefromjpeg($newPath_high);
                    break;
                case 'image/gif':
                    $sdest = imagecreatefromgif($newPath_high);
                    break;
                case 'image/png':
                    $sdest = imagecreatefrompng($newPath_high);
                    break;
                default:
                    break;
            }
            foreach ($dimensions as $d) {

                $selection_area = json_decode($d['selection_area']);
                list($s_width, $s_height) = getimagesize($newPath_high);
                $sw = ($s_width * $selection_area->width) / $resize_width;
                $sh = ($s_height * $selection_area->height) / $resize_height;
                $sx1 = ($s_width * $selection_area->x1) / $resize_width;
                $sy1 = ($s_height * $selection_area->y1) / $resize_height;
                $hi = ($s_height * $resize_width) / $s_width;
                $gap = ($resize_height - $hi) / 2;
                $img_gap = $selection_area->y1 - $gap;
                $sy1 = ($s_height * $img_gap) / $hi;
                if (isset($srcNew[$d['design_area_id']]))
                imagecopy($sdest, $srcNew[$d['design_area_id']], $sx1, $sy1, 0, 0, imagesx($srcNew[$d['design_area_id']]), imagesy($srcNew[$d['design_area_id']]));
            }

            header('Content-Type: image/png');
            imagesavealpha($sdest, true);
            imagejpeg($sdest, $newPath_high, 100);
            imagejpeg($sdest,$default_prod_image_high_jpg,100);
            imagejpeg($sdest,$newPath_c,80);
            imagedestroy($sdest);
            imagedestroy($ssrc);

            $ssrc_png = imagecreatefrompng($dirLargeImg);
            $sinfo_png = getimagesize($newPath_high_png);
            $simgtype_png = image_type_to_mime_type($sinfo_png[2]);

            switch ($simgtype_png) {
                case 'image/jpeg':
                    $sdest_png = imagecreatefromjpeg($newPath_high_png);
                    break;
                case 'image/gif':
                    $sdest_png = imagecreatefromgif($newPath_high_png);
                    break;
                case 'image/png':
                    $sdest_png = imagecreatefrompng($newPath_high_png);
                    break;
                default:
                   break;
            }
            foreach ($dimensions as $d) {

                $x1 = json_decode($d['selection_area'])->x1;
                $y1 = json_decode($d['selection_area'])->y1;
                if (isset($srcNew[$d['design_area_id']]))
                imagecopy($sdest_png, $srcNew[$d['design_area_id']], 0, 0, $x1, $y1, imagesx($srcNew[$d['design_area_id']]), imagesy($srcNew[$d['design_area_id']]));
            }
            header('Content-Type: image/png');
            imagesavealpha($sdest_png, true);
            imagepng($sdest_png, $newPath_high_png);
            imagepng($sdest_png,$default_prod_image_high_png);

            imagedestroy($sdest_png);
            imagedestroy($ssrc_png);
            imagepng(imagecreatefromstring(file_get_contents($newPath_high)), $newPath_high_png);
            imagepng(imagecreatefromstring(file_get_contents($default_prod_image_high_jpg)), $default_prod_image_high_png);


            // large jpg in origin 1



            $large_jpg_image_name = "des_" . $time . "_large.jpg";
            $dirLargeJpgImg = $dir . '/' . $large_jpg_image_name;

            $info_dirLargeJpgImg = getimagesize($prod_image_path);
            $oimgtype_dirLargeJpgImg = image_type_to_mime_type($info_dirLargeJpgImg[2]);
            if ($oimgtype_dirLargeJpgImg == 'image/png') {

                list($o_width, $o_height) = getimagesize($prod_image_path);
                $file = imagecreatetruecolor($o_width, $o_height);
                $new = imagecreatefrompng($prod_image_path);
                $kek = imagecolorallocate($file, 255, 255, 255);
                imagefill($file, 0, 0, $kek);
                imagecopyresampled($file, $file, 0, 0, 0, 0, $o_width, $o_height, $o_width, $o_height);
                imagejpeg($file, $dirLargeJpgImg, 100);
            } else {
                //copy($prod_image_path, $dirLargeJpgImg);
                list($o_width, $o_height) = getimagesize($prod_image_path);
                $file = imagecreatetruecolor($o_width, $o_height);
                $new = imagecreatefromjpeg($prod_image_path);
                $kek = imagecolorallocate($file, 255, 255, 255);
                imagefill($file, 0, 0, $kek);
                imagecopyresampled($file, $file, 0, 0, 0, 0, $o_width, $o_height, $o_width, $o_height);
                imagejpeg($file, $dirLargeJpgImg, 100);
            }


            $sinfo = getimagesize($dirLargeJpgImg);
            $simgtype = image_type_to_mime_type($sinfo[2]);
            switch ($simgtype) {
                case 'image/jpeg':
                    $sdest_dirLargeJpgImg = imagecreatefromjpeg($dirLargeJpgImg);
                    break;
                case 'image/gif':
                    $sdest_dirLargeJpgImg = imagecreatefromgif($dirLargeJpgImg);
                    break;
                case 'image/png':
                    $sdest_dirLargeJpgImg = imagecreatefrompng($dirLargeJpgImg);
                    break;
                default:
                    break;
            }

            foreach ($dimensions as $d) {

                $selection_area = json_decode($d['selection_area']);
                list($s_width, $s_height) = getimagesize($dirLargeJpgImg);
                $sw = ($s_width * $selection_area->width) / $resize_width;
                $sh = ($s_height * $selection_area->height) / $resize_height;
                $sx1 = ($s_width * $selection_area->x1) / $resize_width;
                $sy1 = ($s_height * $selection_area->y1) / $resize_height;
                $hi = ($s_height * $resize_width) / $s_width;
                $gap = ($resize_height - $hi) / 2;
                $img_gap = $selection_area->y1 - $gap;
                $sy1 = ($s_height * $img_gap) / $hi;
                if (isset($srcNew[$d['design_area_id']]))
                imagecopy($sdest_dirLargeJpgImg, $srcNew[$d['design_area_id']], $sx1, $sy1, 0, 0, imagesx($srcNew[$d['design_area_id']]), imagesy($srcNew[$d['design_area_id']]));
            }
            header('Content-Type: image/png');
            imagesavealpha($sdest_dirLargeJpgImg, true);
            imagejpeg($sdest_dirLargeJpgImg, $dirLargeJpgImg, 100);
            //imagedestroy($sdest_dirLargeJpgImg);
            //imagedestroy($srcNew);
            // output array

            if ($isSideSvgfinal == 'true') {
                $result = array("base" => '/' . $base_image_name, "base_high" => '/' . $base_high_image, "canvas_image" => '/' . $image_name, "canvas_large_image" => '/' . $large_jpg_image_name, "svg_image" => '/' . $svg_name);
            }else{
                $result = array("base" => '/' . $base_image_name, "base_high" => '/' . $base_high_image, "canvas_image" => '/' . $image_name, "canvas_large_image" => '/' . $large_jpg_image_name);
            }


            
        }

        return $result;
    }

    public function resizeAndCreateDesignImage($source_image, $destination, $tn_w, $tn_h, $quality = 100) {
        $info = getimagesize($source_image);
        $imgtype = image_type_to_mime_type($info[2]);

        switch ($imgtype) {
            case 'image/jpeg':
                $source = imagecreatefromjpeg($source_image);
                break;
            case 'image/gif':
                $source = imagecreatefromgif($source_image);
                break;
            case 'image/png':
                $source = imagecreatefrompng($source_image);
                break;
            default:
                break;
        }

        $src_w = imagesx($source);
        $src_h = imagesy($source);

        $x_ratio = $tn_w / $src_w;
        $y_ratio = $tn_h / $src_h;

        if (($src_w <= $tn_w) && ($src_h <= $tn_h)) {
            $new_w = $src_w;
            $new_h = $src_h;
        } elseif (($x_ratio * $src_h) < $tn_h) {
            $new_h = ceil($x_ratio * $src_h);
            $new_w = $tn_w;
        } else {
            $new_w = ceil($y_ratio * $src_w);
            $new_h = $tn_h;
        }

        if ($imgtype == 'image/png') {
            $file = imagecreatetruecolor($tn_w, $tn_h);
            $new = imagecreatefrompng($source_image);
            $kek = imagecolorallocate($file, 255, 255, 255);
            imagefill($file, 0, 0, $kek);
            imagecopyresampled($file, $new, (($tn_w - $new_w) / 2), (($tn_h - $new_h) / 2), 0, 0, $new_w, $new_h, $src_w, $src_h);

            if (imagejpeg($file, $destination, $quality)) {
                return true;
            }
        } else {


            $newpic = imagecreatetruecolor(round($new_w), round($new_h));
            imagecopyresampled($newpic, $source, 0, 0, 0, 0, $new_w, $new_h, $src_w, $src_h);
            $final = imagecreatetruecolor($tn_w, $tn_h);
            $backgroundColor = imagecolorallocate($final, 255, 255, 255);
            imagefill($final, 0, 0, $backgroundColor);
            imagecopy($final, $newpic, (($tn_w - $new_w) / 2), (($tn_h - $new_h) / 2), 0, 0, $new_w, $new_h);

            if (imagejpeg($final, $destination, $quality)) {
                return true;
            }
        }
        return false;
    }

}
