define(
    [
        'mage/utils/wrapper',
        'Swissup_Taxvat/js/helper/error-processor'
    ],
    function (wrapper, errorProcessorHelper) {
        'use strict';
        return function(target) {
            target.process = wrapper.wrap(target.process, function (originalAction, response, messageContainer) {
                var result = originalAction(response, messageContainer);
                errorProcessorHelper.scrollToError();
                return result;
            });
            return target;
        }
    }
);
