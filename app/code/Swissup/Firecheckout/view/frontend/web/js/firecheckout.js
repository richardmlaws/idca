define([
    'jquery',
    'underscore',
    'uiComponent',
    'uiRegistry',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/payment/method-list',
    'Swissup_Firecheckout/js/model/validator',
    'Magento_Checkout/js/action/select-billing-address',
    'Swissup_Firecheckout/js/action/set-shipping-method',
    'Swissup_Firecheckout/js/custom'
], function(
    $,
    _,
    Component,
    registry,
    quote,
    paymentMethods,
    validator,
    selectBillingAddress,
    setShippingMethodAction
) {
    'use strict';

    return Component.extend({
        sameAsShippingObservers: [],

        /**
         * Initialize quote namespace with firecheckout storage
         *
         * @return void
         */
        initQuote: function() {
            quote.firecheckout = {
                state: {
                    savingShippingMethod: false
                },
                // last selected values are stored in memo
                memo: {
                    shippingMethod: {},
                    shippingAddress: {}
                }
            };
        },

        initialize: function() {
            this.initQuote();

            if (quote.isVirtual()) {
                $('body').addClass('firecheckout-quote-virtual');
            }

            quote.shippingMethod.subscribe(function(method) {
                validator.removeNotice('#co-shipping-method-form');
                this.saveShippingMethod(method);
            }, this);

            this.addSameAsShippingObservers();
            quote.paymentMethod.subscribe(function(method) {
                validator.removeNotice('#co-payment-form');
                this.toggleEqualAddressClassName(method);
            }, this);

            // Instant billing address update
            quote.shippingAddress.subscribe(function(address) {
                var method = quote.paymentMethod();
                if (!method) {
                    _.each(paymentMethods(), function (paymentMethodData) {
                        registry.get(
                            'checkout.steps.billing-step.payment.payments-list.' + paymentMethodData.method + '-form',
                            function(billingAddress) {
                                if (billingAddress.isAddressSameAsShipping()) {
                                    selectBillingAddress(quote.shippingAddress());
                                }
                            }
                        );
                    });
                    return;
                }

                registry.get(
                    'checkout.steps.billing-step.payment.payments-list.' + method.method + '-form',
                    function(billingAddress) {
                        if (billingAddress.isAddressSameAsShipping()) {
                            selectBillingAddress(quote.shippingAddress());
                        }
                    }
                );
            }, this);
        },

        /**
         * Saves shipping information with additional fixes:
         *  - check for ajax state in case of request is already sent
         *  - give 200ms time before making a request (for the form filler plugins)
         *
         * @param  Object method Shipping Method
         * @return void
         */
        saveShippingMethod: function(method) {
            // prevent multiple ajax requests
            if (quote.firecheckout.state.savingShippingMethod) {
                return;
            }

            // shipping titles are updated by ko, so we shoud care about amount only
            if (this.shouldSaveShippingInformation()) {
            // if (quote.shippingMethod().carrier_code + '_' + method.method_code)
                quote.firecheckout.state.savingShippingMethod = true;

                // give some time for the form fillers
                setTimeout(function() {
                    // Sometimes shippingMethod object is missing after timeout
                    // The code below prevents "Unable to set null, null" error
                    if (!quote.shippingMethod().method_code ||
                        !quote.shippingMethod().carrier_code) {

                        quote.firecheckout.state.savingShippingMethod = false;
                        return;
                    }

                    setShippingMethodAction()
                        .done(function() {
                            quote.firecheckout.state.savingShippingMethod = false;
                            quote.firecheckout.memo.shippingMethod = method;

                            var address = quote.shippingAddress();
                            quote.firecheckout.memo.shippingAddress = {
                                'countryId' : address.countryId,
                                'postcode'  : address.postcode,
                                'region'    : address.region,
                                'regionId'  : address.regionId,
                                'vatId'     : address.vatId
                            };
                        })
                        .fail(function() {
                            quote.firecheckout.state.savingShippingMethod = false;
                        });
                }, 200);
            }
        },

        shouldSaveShippingInformation: function() {
            var memo = quote.firecheckout.memo;
            if (memo.shippingMethod.amount !== quote.shippingMethod().amount) {
                return true;
            }

            // check for address sensitive data
            var addressFields = [
                'countryId',
                'postcode',
                'region',
                'regionId',
                'vatId'
            ];
            return addressFields.some(function(field, index) {
                return memo.shippingAddress[field] !== quote.shippingAddress()[field];
            });
        },

        /**
         * Toggle 'equal-billing-shipping' classname according to
         * billingAddress.isAddressSameAsShipping
         *
         * @return boolean
         */
        toggleEqualAddressClassName: function(method) {
            method = method || quote.paymentMethod();
            if (!method) {
                return;
            }
            registry.get(
                'checkout.steps.billing-step.payment.payments-list.' + method.method + '-form',
                function(billingAddress) {
                    var flag = billingAddress.isAddressSameAsShipping();
                    $('body').toggleClass('equal-billing-shipping', flag);
                }
            );
            return true;
        },

        /**
         * Add observers to each payment method to toggle 'equal-billing-shipping'
         * class name on "My billing and shipping address are the same" state update
         *
         * @param void
         */
        addSameAsShippingObservers: function() {
            _.each(paymentMethods(), function (paymentMethodData) {
                registry.get(
                    'checkout.steps.billing-step.payment.payments-list.' + paymentMethodData.method + '-form',
                    function(billingAddress) {
                        billingAddress.isAddressSameAsShipping.subscribe(function(flag) {
                            $('body').toggleClass('equal-billing-shipping', flag);
                        });
                    }
                );
            });
        }
    });
});
