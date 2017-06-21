define(
    [
        'jquery',
    ],
    function($) {
        'use strict';

        return {
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
                var messages = $('div.message-error:visible');
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
            }
        }
    }
);
