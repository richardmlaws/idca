define([
    'jquery',
    'underscore',
    'uiComponent',
    'Magento_Customer/js/customer-data',
    'Magento_Checkout/js/model/address-converter',
    'Magento_Checkout/js/checkout-data'
], function (
    $,
    _,
    Component,
    customerData,
    addressConverter,
    checkoutData
) {
    'use strict';

    var countryData = customerData.get('directory-data');
    if (_.isEmpty(countryData())) {
        customerData.reload(['directory-data'], false);
    }

    var config = window.checkoutConfig.swissup.AddressAutocomplete;

    function getAutocomplete(el) {
        return el.addressAutocomplete;
    }

    /**
     * Find region_id by it's code, or name
     *
     * @param  {Object} address
     * @return {Number}
     */
    function findRegionId(address) {
        var id,
            regionCode = address.region_code,
            regionName = address.region,
            countryCode = address.country_id;

        if (countryData()[countryCode]
            && countryData()[countryCode]['regions']
            ) {
                var regions = countryData()[countryCode]['regions'];
                // 1. search by codes
                for (id in regions) {
                    if (regions[id].code === regionCode) {
                        return id;
                    }
                }
                // 2. search by name
                for (id in regions) {
                    if (regions[id].name === regionName) {
                        return id;
                    }
                }
        }
        return false;
    }

    function extractFieldValueFromPlace(name, value, place) {
        var i = 0, field;
        while ((field = place.address_components[i])) {
            if (field.types[0] === name) {
                return field[value];
            }
            i++;
        }
        return '';
    }

    /**
     * Extract address from google place object
     * @param  {Object} place   @see autocomplete.getPlace()
     * @return {Object}
     */
    function extractAddress(place) {
        if (!place || !place.address_components) {
            return false;
        }

        var mapping = {
            'country_id'    : '{{country.short_name}}',
            'street1'       : '{{street_number.short_name}} {{route.long_name}}',
            'street2'       : '',
            'city'          : '{{locality.long_name}}',
            'postcode'      : '{{postal_code.short_name}}',
            'region'        : '{{administrative_area_level_1.long_name}}',
            'region_id'     : '',
            'region_code'   : '{{administrative_area_level_1.short_name}}'
        };
        if (config.streetNumberPlacement === 'line1_end') {
            mapping.street1 = '{{route.short_name}} {{street_number.short_name}}';
        } else if (config.streetNumberPlacement === 'line2') {
            mapping.street1 = '{{route.short_name}}';
            mapping.street2 = '{{street_number.short_name}}';
        }

        var address = {};
        for (var i in mapping) {
            if (!mapping[i].length) {
                address[i] = '';
                continue;
            }

            address[i] = [];

            var re = /\{\{(.+?)\}\}/g, fields;
            while ((fields = re.exec(mapping[i]))) {
                var field = fields[1].split('.')[0],
                    value = fields[1].split('.')[1];

                var fieldValue = extractFieldValueFromPlace(field, value, place);
                if (fieldValue) {
                    address[i].push(fieldValue);
                }
            }
            address[i] = address[i].join(' ');
        }

        address.street = [address.street1, address.street2];
        address.region_id = findRegionId(address);

        return address;
    }

    function setAddress(address, formId) {
        var selectors = {
            'street[0]'  : 'street1',
            'street[1]'  : 'street2',
            'city'       : 'city',
            'region_id'  : 'region_id',
            'postcode'   : 'postcode',
            'country_id' : 'country_id'
        };

        _.each(selectors, function(key, selector) {
            var _selector = formId + ' [name="' + selector + '"]';
            var el = $(_selector);
            if (!el.length || typeof address[key] == 'undefined') {
                return;
            }

            el.val(address[key]);
            el.trigger('change');
        });

        // address = addressConverter.formAddressDataToQuoteAddress(address);
        // address = addressConverter.quoteAddressToFormAddressData(address);
        // checkoutData.setShippingAddressFromData(address);
        // console.log(address);
        return true;
    }

    function placeChangedHandler(el) {
        // 1. Match field prefix (billing:, shipping: or empty string)
        var _el = $(el);
        var form = _el.closest('.address');
        if (!form.length) {
            return;
        }
        var formId = '#' + form.attr('id');//'.form-shipping-address';

        // 2. Extract address from google place
        var address = extractAddress(getAutocomplete(el).getPlace());
        if (!address) {
            return;
        }
        // console.log(address);

        // 3. Fill the form
        return setAddress(address, formId);
    }

    return Component.extend({
        checkDelay: 2000,
        checkRulesSelectorsInterval: 0,
        isVisible: function() {
           return config.enable;
        },

        rules : [{
            selectors: [
                '.form-shipping-address input[name*="street[0]"]',
                // '.form-shipping-address input[name*="street[1]"]',
                '#billing-new-address-form input[name*="street[0]"]'
            ],
            types: ['address'],
            listeners: {
                place_changed: placeChangedHandler
            }
        }],
        initObservable: function () {
            this._super();
            if (this.isVisible()) {
                var self = this;
                var params = 'key=' + config.apiKey + '&'
                    + 'libraries=places' + '&'
                    + 'language=' + config.locale;

                require(['goog!maps,3,other_params:' + params], function() {
                    clearInterval(self.checkRulesSelectorsInterval); //
                    self.checkRulesSelectorsInterval = setInterval( // setTimeout do defer and event
                        self.initAutocompletes.bind(self),
                        self.checkDelay
                    );
                });
            }
            return this;
        },

        initAutocompletes: function () {
            if (this.validRulesSelectors()) {
                this.addAutocompletes();
                // clearInterval(self.checkRulesSelectorsInterval);
            }
        },
        validRulesSelectors: function() {
            var check = false;
            $.each(this.rules, function(i, rule) {
                $.each(rule.selectors, function(j, selector) {
                    var el = $(selector);
                    check = check || el.length;
                });
            });
            // console.log('valid ' + (check ? 'true' : 'false'));
            return check;
        },
        addAutocompletes: function() {
            var self = this;
            $.each(self.rules, function(i, rule) {
                $.each(rule.selectors, function(j, selector) {

                    var el = $(selector);
                    // console.log(el);
                    if (!el.length) {
                        return;
                    }
                    // el = el[0];
                    el = document.getElementById(el.attr('id'));
                    if (el.addressAutocomplete) {
                        return;
                    }
                    // console.log(el);
                    var autocomplete = new google.maps.places.Autocomplete(el, {
                        types: rule.types
                    });
                    el.addressAutocomplete = autocomplete;

                    if (rule.listeners) {
                        $.each(rule.listeners, function(k, listener) {
                            autocomplete.addListener(k, listener.bind(self, el));
                        });
                    }
                });
            });
        }
    });
});