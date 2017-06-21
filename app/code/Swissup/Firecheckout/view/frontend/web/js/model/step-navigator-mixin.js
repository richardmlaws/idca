define([
    'mage/utils/wrapper'
], function(wrapper) {
    'use strict';

    var checkoutConfig = window.checkoutConfig;

    return function(target) {
        if (!checkoutConfig.isFirecheckout) {
            return target;
        }

        target.registerStep = wrapper.wrap(
            target.registerStep,
            function (originalAction, code, alias, title, isVisible, navigate, sortOrder) {
                arguments[4] = wrapper.wrap(
                    isVisible,
                    function(o, flag) {
                        // make section always visible
                        return o(true);
                    }
                );

                return originalAction.apply(
                    target,
                    Array.prototype.slice.call(arguments, 1)
                );
            }
        );
        return target;
    }
});
