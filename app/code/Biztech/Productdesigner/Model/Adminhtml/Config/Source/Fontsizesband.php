<?php
namespace Biztech\Productdesigner\Model\Adminhtml\Config\Source;
    class Fontsizesband extends \Magento\Config\Block\System\Config\Form\Field{

        public function toOptionArray(){
            for($i=8;$i<=24;$i = $i+1){ 
                $option_array[] = array(
                    'value' => $i,
                    'label' => $i
                );
            } 

            return $option_array;
        }


    }
