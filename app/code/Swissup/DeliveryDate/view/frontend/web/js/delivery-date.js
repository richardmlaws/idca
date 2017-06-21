define([
    'jquery',
    'ko',
    'Magento_Ui/js/form/element/abstract',
    'Magento_Checkout/js/model/quote'
], function ($, ko, Element, quote) {
    'use strict';

    var config = window.checkoutConfig.swissup.DeliveryDate;
    var weekendDays = config.options && config.options.excludedWeekdays
        ? config.options.excludedWeekdays : [];

    var holiDays = config.options && config.options.holidays
        ? config.options.holidays : [];

    var required = config.required || false;

    function isWeekend(date)
    {
        return $.inArray(date.getDay(), weekendDays) == -1;
    }

    function isDateEqual(date0, date1)
    {
        return date0.setHours(0,0,0,0) == date1.setHours(0,0,0,0);
    }

    function isHoliday(date)
    {
        var _return = true;
        $.each(holiDays, function(index, holiday){
            var holiday = new Date(holiday);
            if(isDateEqual(date, holiday)) {
                _return = false;
            }
        });
        return _return;
    }

    function beforeShowDay(date)
    {
        var _return = isWeekend(date) && isHoliday(date);
        return [_return, ''];
    }

    return Element.extend({
        defaults: {
            visible: true,
            validation: {'required-entry': required},
            template: 'Swissup_DeliveryDate/delivery-date'
        },
        // errorValidationMessage: ko.observable(false),
        initialize: function () {
            this._super();

            ko.bindingHandlers.datePicker = {
                init: function (element, valueAccessor, allBindingsAccessor) {
                    var $el = $(element);

                    var options = config.options;

                    if (options.defaultDate && "number" == typeof options.defaultDate) {
                        options.defaultDate = new Date(options.defaultDate);
                    }
                    options.beforeShowDay = beforeShowDay;

                    $el.datepicker(options);
                    if (options.defaultDate) {
                        $el.datepicker('setDate', options.defaultDate);
                    }

                    var writable = valueAccessor();
                    if (!ko.isObservable(writable)) {
                        var propertyWriters = allBindingsAccessor()._ko_property_writers;
                        if (propertyWriters && propertyWriters.datepicker) {
                            writable = propertyWriters.datepicker;
                        } else {
                            return;
                        }
                    }
                    writable($(element).datepicker("getDate"));
                },
                update: function (element, valueAccessor) {
                    var widget = $(element).data("DateTimePicker");
                    //when the view model is updated, update the widget
                    if (widget) {
                        var date = ko.utils.unwrapObservable(valueAccessor());
                        widget.date(date);
                    }
                }
            };

            // this.validation['required-entry'] = true;
            // this.required(true);

            quote.shippingMethod.subscribe(function(method) {
                var filter = !!config.filter_per_shipping_method || false;
                if (filter) {
                    return;
                }
                var methodType = method.carrier_code + '_' + method.method_code;
                var shippingMethods = config.shipping_methods || '';
                if (-1 != shippingMethods.indexOf(methodType)) {
                    this.visible(true);
                } else {
                    this.visible(false);
                }
            }, this);

            return this;
        },
        getTitle: function() {
            return config.label ? config.label : 'Delivery Date';
        }
    });
});