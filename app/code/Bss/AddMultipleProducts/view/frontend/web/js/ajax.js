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
* @package    Bss_AddMultipleProducts
* @author     Extension Team
* @copyright  Copyright (c) 2014-2016 BSS Commerce Co. ( http://bsscommerce.com )
* @license    http://bsscommerce.com/Bss-Commerce-License.txt
*/
var BssAjaxCart = function() {
    var self = this;
    this.init = function(addUrls) {
        jQuery('.actions-primary .tocart,.addmanytocart').click(function (e){
            e.preventDefault();
            var form = jQuery(this).parents('form').get(0);
            var addUrl = jQuery(this).parents('form').attr('action');
            if (jQuery(this).hasClass('tocart')) {
                addUrl = addUrls + 'add';
                var data = '';
                if(form && jQuery(form).attr('id') != 'wishlist-view-form') {
                    var serialize = jQuery(form).serialize();
                    self.sendAjax(addUrl, serialize);
                }else {
                var dataPost = jQuery.parseJSON(jQuery(this).attr('data-post'));
                    if(dataPost) {
                        if (dataPost.data.product) {
                            productidad = dataPost.data.product;
                        }else{
                            if (jQuery(this).parents('li.product-item').find('.price-box').data('product-id')!='') {
                                productidad = jQuery(this).parents('li.product-item').find('.price-box').data('product-id');
                            }
                        }
                        var formKey = jQuery("input[name='form_key']").val();
                        var qty = jQuery(this).siblings('.qty-m-c').val();
                        data += 'id=' +productidad + '&product=' + productidad + '&qty=' + qty + '&form_key=' + formKey + '&uenc=' + dataPost.data.uenc;
                        self.sendAjax(addUrl, data);
                        return false;
                    }
                }
            }
            if (jQuery(this).hasClass('addmanytocart')) {
                // if(jQuery(this).parents('form').find('.product-select').length){
                    var form = jQuery('#add-muntiple-product-'+ jQuery(this).data('froma'));
                    var data = jQuery(form).serialize();
                    addUrl = jQuery(form).attr('action');
                    self.sendAjax(addUrl, data);
                // }else{
                    // alert('Please select product !');
                // }
                return false;
            }
        });
    };

    this.sendAjax = function(addUrl, data) {
        self.showLoader();

        jQuery.ajax({
            type: 'post',
            url: addUrl,
            data: data, 
            dataType: 'json',
            success: function (data) {
                if (data.status == 'error') {
                    alert(data.mess);
                    jQuery.fancybox.hideLoading();
                    jQuery('.fancybox-overlay').hide();
                    return false;
                }
                if(data.popup) {
                    jQuery('#bss_ajaxmuntiple_cart_popup').html(data.popup);
                    self.showPopup();
                }
            },
            error: function(){
                // window.location.href = '';
            }
        });
    };


    this.showLoader = function() {
        jQuery.fancybox.showLoading();
        jQuery.fancybox.helpers.overlay.open({parent: 'body'});
    };

    this.showPopup = function() {
        jQuery.fancybox({
            href: '#bss_ajaxmuntiple_cart_popup', 
            modal: false,
            helpers: {
                overlay: {
                    locked: false
                }
            },
            afterClose: function() {
                clearInterval(count);
            }
        });
    }
}