define([
    'jquery',
    'mage/sticky'
], function($) {

    // 1. Added spacingTop feature
    // 2. Add _calculateDimens call in a interval
    $.widget('firecheckout.firesticky', $.mage.sticky, {
        _create: function() {
            this._super();

            // body height is not a constant
            setInterval(this._calculateDimens.bind(this), 500);
        },

        _stick: function() {
            var offset,
                isStatic;

            isStatic = this.element.css('position') === 'static';

            if( !isStatic && this.element.is(':visible') ) {
                offset = $(document).scrollTop() - this.parentOffset;

                // firecheckot modification
                offset += this.options.spacingTop;

                offset = Math.max( 0, Math.min( offset, this.maxOffset) );

                this.element.css( 'top', offset );
            }
        }
    });

    return $.firecheckout.firesticky;
});
