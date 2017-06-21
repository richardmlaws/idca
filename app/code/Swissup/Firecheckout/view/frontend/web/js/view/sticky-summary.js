define([
    'jquery',
    'uiComponent',
    'Magento_Checkout/js/view/sidebar',
    'Swissup_Firecheckout/js/sticky'
], function($, Component) {
    'use strict';

    return Component.extend({
        initialize: function() {
            this.stick();
        },

        stick: function() {
            if (!$('.opc-sidebar').length) {
                setTimeout(this.stick.bind(this), 1000);
                return false;
            }

            this.sticky = $('.opc-sidebar').firesticky({
                container: '#checkout',
                spacingTop: 25
            });
        }
    });
});
