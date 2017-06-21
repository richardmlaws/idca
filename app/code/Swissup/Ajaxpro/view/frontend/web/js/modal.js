define([
    'jquery',
    'mage/template',
    'jquery/ui',
    'Magento_Ui/js/modal/modal'
], function($, $t){

    $.widget('swissup.modal', $.mage.modal, {

        // _init: function () {
        //     console.log('_init widget after create');
        //     console.log(this.element);
        // },

        // openModal: function () {
        //     console.log('openModal modal.js');
        //     super.openModal()
        // },

         /**
         * Close modal.
         * * @return {Element} - current element.
         */
        closeModal: function () {
            if (!this.options.isOpen) {
                return this.element;
            }
            var that = this;

            this._removeKeyListener();
            this.options.isOpen = false;
            this.modal.one(this.options.transitionEvent, function () {
                that._close();
            });
            this.modal.removeClass(this.options.modalVisibleClass);

            if (!this.options.transitionEvent) {
                that._close();
            }

            return this.element;
        }
    });

    return $.swissup.modal;
});