define([
    'jquery',
    'ko',
    'uiRegistry',
    'Magento_Checkout/js/model/quote',
    'mage/translate'
], function($, ko, registry, quote, $t) {
    'use strict';

    return {
        /**
         * Validate firecheckout form
         */
        validate: function() {
            var result = true;

            // 1. Validate selected shipping and payment radio buttons
            var isShippingSelected = this.validateShippingRadios(),
                isPaymentSelected  = this.validatePaymentRadios();
            if (!isShippingSelected || !isPaymentSelected) {
                this.scrollToError();
                return false;
            }

            // 2. Validate shipping information
            if (!quote.isVirtual()) {
                registry.get(
                    'checkout.steps.shipping-step.shippingAddress',
                    function(shippingAddress) {
                        if (!shippingAddress.validateShippingInformation()) {
                            result = false;
                        }
                    }
                );
            }

            // try to scroll to third-party message
            setTimeout(this.scrollToError.bind(this), 100);

            return result;
        },

        isElementVisibleInViewport: function(el) {
            var rect = el.getBoundingClientRect(),
                viewport = {
                    width: $(window).width(),
                    height: $(window).height()
                };

            return (
                rect.top  >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= viewport.height &&
                rect.right  <= viewport.width
            );
        },

        /**
         * Scroll to error if it's not visible in viewport
         */
        scrollToError: function() {
            var messages = $('div.mage-error:visible, .firecheckout-msg:visible');
            if (!messages.length) {
                return;
            }

            var timeout = 0,
                visibleMessage = messages.toArray().find(this.isElementVisibleInViewport);

            if (!visibleMessage) {
                visibleMessage = messages.first();
                timeout = 200;
                $('html, body').animate({
                    scrollTop: visibleMessage.offset().top - 70
                }, timeout);
            }
            setTimeout(function() {
                $(visibleMessage).addClass('firecheckout-shake')
                    .one(
                        'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                        function() {
                            $(this).removeClass('firecheckout-shake');
                        }
                    );
            }, timeout);
        },

        /**
         * Check is shipping radio is selected
         */
        validateShippingRadios: function() {
            var el = $('#co-shipping-method-form');
            if (!el.length) {
                return true;
            }

            this.removeNotice(el);
            if (!quote.shippingMethod() || typeof quote.shippingMethod() !== 'object') {
                this.addNotice(el, $t('Please specify a shipping method.'));
                return false;
            }
            return true;
        },

        /**
         * Check is payment radio is selected
         */
        validatePaymentRadios: function() {
            var el = $('#co-payment-form');
            if (!el.length) {
                return true;
            }

            this.removeNotice(el);
            if (!quote.paymentMethod() || typeof quote.paymentMethod() !== 'object') {
                this.addNotice(el, $t('Please specify a payment method.'));
                return false;
            }
            return true;
        },

        /**
         * Add notice message at the top of the element
         *
         * @param el
         * @param msg
         */
        addNotice: function(el, msg) {
            el.prepend(
                '<div class="firecheckout-msg message notice"><span>' +
                    msg +
                '</span></div>'
            );
        },

        /**
         * Remove notice label
         *
         * @param  el
         * @return void
         */
        removeNotice: function(el) {
            $('.firecheckout-msg', el).remove();
        }
    };
});
