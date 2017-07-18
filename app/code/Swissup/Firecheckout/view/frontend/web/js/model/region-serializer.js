define([
    'jquery'
], function($, ko, registry, quote, $t) {
    'use strict';

    return {

        /**
         * Collect all values from all inputs inside from parent element
         *
         * @param  jQuery region
         * @return Object
         */
        serialize: function(region) {
            var data = {},
                iterators = {};

            region.find('input, select').each(function(i, input) {
                var key;
                if (input.id && input.id.length && input.id.indexOf(' ') === -1) {
                    key = '#' + input.id;
                } else if (input.name && input.name.length) {
                    key = '[name="' + input.name + '"]';
                } else {
                    return;
                }

                if (typeof iterators[key] === 'undefined') {
                    iterators[key] = 0;
                }
                iterators[key]++;

                if ($(key).length > 1) {
                    // in case if elements has the same name
                    key += ':nth-child(' + iterators[key] + ')';
                }

                if ('radio' == input.type || 'checkbox' == input.type) {
                    data[key] = $(this).prop('checked');
                } else {
                    data[key] = $(this).val();
                }
            });
            return data;
        },

        /**
         * Fill inputs of the region with
         *
         * @param  {[type]} region [description]
         * @param  {[type]} data   [description]
         * @return {[type]}        [description]
         */
        restore: function(region, data) {
            for (var selector in data) {
                if (!selector || !data.hasOwnProperty(selector)) {
                    continue;
                }
                region.find(selector).each(function(i, input) {
                    if ('radio' == input.type || 'checkbox' == input.type) {
                        $(this).prop('checked', data[selector]);
                    } else {
                        $(this).val(data[selector]);
                    }
                });
            }
        }
    }
});
