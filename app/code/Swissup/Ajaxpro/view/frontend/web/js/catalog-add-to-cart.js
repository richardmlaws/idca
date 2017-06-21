define([
    'jquery',
    'mage/template',
    'jquery/ui',
    'Magento_Catalog/js/catalog-add-to-cart'
], function($, $t){

    $.widget('swissup.catalogAddToCart', $.mage.catalogAddToCart, {

        _bindSubmit: function() {
            var self = this,
            isValidation = !!this.options.submitForcePreventValidation;

            if (isValidation) {
                this.element.mage('validation');
            }
            this.element.on('submit', function(e) {
                e.preventDefault();
                if (isValidation) {
                    if(self.element.valid()) {
                        self.submitForm($(this));
                    }
                } else {
                    self.submitForm($(this));
                }
            });
        },

        ajaxSubmit: function(form) {
            var self = this;
            $(self.options.minicartSelector).trigger('contentLoading');
            self.disableAddToCartButton(form);

            $.ajax({
                url: form.attr('action'),
                data: form.serialize(),
                type: 'post',
                dataType: 'json',
                beforeSend: function() {
                    if (self.isLoaderEnabled()) {
                        $('body').trigger(self.options.processStart);
                    }
                },
                success: function(res) {
                    if (self.isLoaderEnabled()) {
                        $('body').trigger(self.options.processStop);
                    }

                    if (res.backUrl && !res.ajaxpro) {
                        window.location = res.backUrl;
                        return;
                    }
                    if (res.messages) {
                        $(self.options.messagesSelector).html(res.messages);
                    }
                    if (res.minicart) {
                        $(self.options.minicartSelector).replaceWith(res.minicart);
                        $(self.options.minicartSelector).trigger('contentUpdated');
                    }
                    if (res.product && res.product.statusText) {
                        $(self.options.productStatusSelector)
                            .removeClass('available')
                            .addClass('unavailable')
                            .find('span')
                            .html(res.product.statusText);
                    }
                    self.enableAddToCartButton(form);
                }
            });
        }
    });

    return $.swissup.catalogAddToCart;
});