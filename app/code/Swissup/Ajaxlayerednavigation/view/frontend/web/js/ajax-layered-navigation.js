define([
    'jquery',
    'mage/apply/main',
    'Swissup_Ajaxlayerednavigation/js/ion.rangeSlider.min',
	'Bss_AddMultipleProducts/js/ajax',
	'Bss_AddMultipleProducts/js/jquery.fancybox.min'
], function ($, mage, ionRangeSlider,ajaxCart,fancybox) {
    'use strict';
    var AjaxLayeredNavigation = {
        AjaxLayeredNavigation: function (settings) {
            this.config = settings;
            this.url = $(location).attr('href');
            this.useAjax = this.config.useAjax;
            this.minPrice = $("#price-range-slider").data("from");
            this.maxPrice = $("#price-range-slider").data("to");
            this.fromPrice = $("#price-range-slider").data("from");
            this.toPrice = $("#price-range-slider").data("to");
            this.pricePrefix = this.config.pricePrefix;
            this.pricePostfix = this.config.pricePostfix;
			this.baseurl = this.config.baseurl;
            AjaxLayeredNavigation.initNavigation();
        },

        initNavigation: function() {
            this.addPriceSlider();
            this.addFilterObservers();
            this.addToolbarObservers();
			
        },
		
		ajaxqtybox: function() {
			var class_apply = '.cms-home .products-grid,.catalog-category-view .products-grid,.catalog-category-view .products-list';
			var trainindIdArray = class_apply.split(',');
            var form_addmuntiple = '';
            var productidad = '';
            var checkall = '';
            var total_init = '';
			var showcheckboxproduct = '';
            var positionbutton = 1;
			$.each(trainindIdArray, function(index, value) { 
               
                if ($(value).length) {
					$(value).each(function(i){
                    if ( $(this).find('.actions-primary form').length ) {
                           $(this).find('.actions-primary form').each(function(){    
                                if ( $(this).find('input[name="product"]').length ) {
                                            productidad = $(this).find('input[name="product"]').val();
                                }else{
                                    if ($(this).parents('.product.info').find('.price-box').data('product-id')!='') {
                                            productidad = $(this).parents('.product.info').find('.price-box').data('product-id');
                                    }
                                }
                                if (productidad != '') {
                                    if (showcheckboxproduct) {
                                        $(this).find('button.tocart').before('<input type="checkbox" name="product-select[]" id="product_'+productidad +'" data-froma="trim'+ i + '" class="product-select add-mt-'+ i +'" value="'+ productidad +'">');
                                    }else{
                                        $(this).find('button.tocart').before('<input type="hidden" name="product-select[]" id="product_'+productidad +'" data-froma="trim'+ i + '" class="add-mt-'+ i +'" value="'+ productidad +'">');
                                    }
									var minsalqt = $("#miniqty"+ productidad).val();
                                $(this).find('button.tocart').before('<input type="text" class="qty-m-c" data-group="gr-add-mt-'+ i +'" name="qty" placeholder="0" value="'+minsalqt+'">');
                                }
                            })
                            
                        }else{
                            $(this).find('li.product-item .actions-primary').each(function(){
                                var dataPost = jQuery.parseJSON($(this).find('.action.tocart').attr('data-post'));
                                if (dataPost) {
                                    if (dataPost.data.product) {
                                        productidad = dataPost.data.product;
                                    }else{
                                        if ($(this).parents('li.product-item').find('.price-box').data('product-id')!='') {
                                            productidad = $(this).parents('li.product-item').find('.price-box').data('product-id');
                                        }
                                    }
                                }
                                if (!dataPost && $(this).parents('li.product-item').find('.price-box').data('product-id')!='') {
                                    productidad = $(this).parents('li.product-item').find('.price-box').data('product-id');
                                }
                                if (productidad != '') {
                                    if (showcheckboxproduct) {
                                        $(this).find('button.tocart').before('<input type="checkbox" name="product-select[]" id="product_'+ productidad +'" class="product-select add-mt-'+ i +'"  data-froma="trim'+ i + '" value="'+ productidad +'">');
                                    }else{
                                        $(this).find('button.tocart').before('<input type="hidden" name="product-select[]" id="product_'+ productidad +'" class="add-mt-'+ i +'"  data-froma="trim'+ i + '" value="'+ productidad +'">'); 
                                    }
									var minsalqt = $("#miniqty"+ productidad).val();
                                    $(this).find('button.tocart').before('<input type="text" class="qty-m-c" data-group="gr-add-mt-'+ i +'" name="qty" placeholder="0" value="+minsalqt+">');
                                }
                            })
                        }
					
                    })
					}
                })
            
		},

        addPriceSlider: function() {
            var self = this,
                priceActive = location.search.split('price=')[1];
            if (priceActive) {
                $("#price-range-slider").data('from', this.fromPrice);
                $("#price-range-slider").data('to', this.toPrice);
            }
            $("#price-range-slider").ionRangeSlider({
                type: "double",
                min: self.minPrice,
                max: self.maxPrice,
                from: self.fromPrice,
                to: self.toPrice,
                prettify_enabled: true,
                prefix: self.pricePrefix,
                postfix: self.pricePostfix,
                grid: true,
                onFinish: function(obj) {
                    self.applyToolbarElement('price', obj.from + '-' + obj.to);
                    self.fromPrice = obj.from;
                    self.toPrice = obj.to;
                }
            });
        },

        addFilterObservers: function() {
            var selectedIds, checkbox, filterItem,
                self = this;

            $("#layered-filter-block .filter-title strong").off();
            $("#layered-filter-block .filter-title strong").on("click", function() {
                if (self.isMobile()) {
                    if ($('body').hasClass('filter-active')) {
                        $('body').removeClass('filter-active');
                    } else {
                        $('body').addClass('filter-active');
                    }

                    if ($('.block.filter').hasClass('active')) {
                        $('.block.filter').removeClass('active');
                        $('.block.filter .filter-options').hide();
                    } else {
                        $('.block.filter').addClass('active');
                        $('.block.filter .filter-options').show();
                    }
                }
            });

            $( ".swissup-content" ).off();
            $(".swissup-content").on("click", function() {
                checkbox = $(this).prev();
                filterItem = $(this).closest( ".swissup-filter-item-checkbox" ).next();

                if(checkbox.prop('disabled')) {
                    return false;
                }

                self.toggleCheckbox(checkbox);
                self.applyFilter(filterItem);
                return false;
            });

            $( ".swissup-aln-item" ).off();
            $(".swissup-aln-item").on("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                var checkboxWrapper = $(this).prev(),
                    checkbox = checkboxWrapper.find('input');

                self.toggleCheckbox(checkbox);
                self.applyFilter($(this));
                return false;
            });

            $(".filter-active-item-link").off();
            $(".state-item-remove").on("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                self.applyFilter($(this).next());
                return false;
            });


            $( ".swatch-attribute-options a" ).off();
            $(".swatch-attribute-options a").on("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                self.applyFilter($(this));
                return false;
            });

            $(".filter-active-item-clear-all").off();
            $(".filter-active-item-clear-all").on("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                self.applyFilter($(this));
                return false;
            });
            // show hide filter
            $( ".filter-content dt" ).off();
            $(".filter-content dt").on("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                self.toggleFilter($(this));
                return false;
            });
        },

        toggleCheckbox: function(el) {
            if (el.prop('checked')) {
                el.prop("checked", false);
            } else {
                el.addClass('loading');
                el.prop("checked", true);
            }
        },

        addToolbarObservers: function() {
            var self = this;
            $("#mode-list").off();
            $("#mode-list").on("click", function(e) {
                e.preventDefault();
                e.stopPropagation();

                self.applyToolbarElement('product_list_mode', 'list');
                return false;
            });

            $("#mode-grid").off();
            $("#mode-grid").on("click", function(e) {
                e.preventDefault();
                e.stopPropagation();

                self.applyToolbarElement('product_list_mode', 'grid');
                return false;
            });

            $("#sorter").off();
            $("#sorter").on("change", function(e) {
                e.preventDefault();
                e.stopPropagation();

                self.applyToolbarElement('product_list_order', $(this).val());
                return false;
            });

            $(".sorter-action").off();
            $(".sorter-action").on("click", function(e) {
                e.preventDefault();
                e.stopPropagation();

                self.applyToolbarElement('product_list_dir', $(this).attr("data-value"));
                return false;
            });


            $(".limiter-options").off();
            $(".limiter-options").on("change", function(e) {
                e.preventDefault();
                e.stopPropagation();

                self.applyToolbarElement('product_list_limit', $(this).val());
                return false;
            });

            $(".pages-items a").off();
            $(".pages-items a").on("click", function(e) {
                e.preventDefault();
                e.stopPropagation();
                self.applyFilter($(this));
                $('html, body').animate({
                    scrollTop: $("#maincontent").offset().top
                }, 500);
                return false;
            });
        },

        applyToolbarElement: function(param, value) {
            var self = this,
                urlParams = self.urlParams(self.url),
                url = self.url.split("?")[0];

            urlParams[param] = value;
            self.reload(url + '?' + $.param(urlParams));
        },

        applyFilter: function(el) {
            this.reload($(el).attr('href'));
        },

        reload: function(url) {
            var self = this;
            if (!this.useAjax) {
                window.location = decodeURIComponent(url);
                return false;
            }
            window.history.pushState("", "", decodeURIComponent(url));
            $.ajax({
                method: "GET",
                url: decodeURIComponent(url),
                dataType: "json",
                data: { aln: 1 },
                showLoader: true
            }) .done(function(data) {
                if (data.list) {
                    $(".main .toolbar-products").remove();
                    $(".main .products").remove();
                    $(".main .filter-active").remove();
                    $(".main #authenticationPopup").first().after(data.state + data.list);
                }
                if (data.filters) {
                    $(".sidebar-main .filter").remove();
                    $(".sidebar-main").prepend(data.filters);
                }
                self.url = url;
                self.initNavigation();
				self.ajaxqtybox();
				ajaxCart = new BssAjaxCart();
				ajaxCart.init(self.baseurl+'addmuntiple/cart/');
				$(mage.apply);
                if (self.isMobile()) {
                    if ($('body').hasClass('filter-active')) {
                        $('.block.filter').addClass('active');
                    } else {
                        $('.filter-options').hide();
                    }
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
            });
        },

        urlParams: function(url) {
            var result = {};
            var searchIndex = url.indexOf("?");
            if (searchIndex == -1 ) return result;
            var sPageURL = url.substring(searchIndex +1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) {
                var sParameterName = sURLVariables[i].split('=');
                result[sParameterName[0]] = sParameterName[1];
            }

            return result;
        },

        toggleFilter: function(el) {
            if ($(el).hasClass('inactive')) {
                $(el).removeClass('inactive');
                $(el).addClass('active');
                $(el).next().slideDown("100");
            } else {
                $(el).next().slideUp("100", function() {
                    $(el).removeClass('active');
                    $(el).addClass('inactive');
                });
            }
        },

        isMobile: function() {
            if( navigator.userAgent.match(/Android/i)
                 || navigator.userAgent.match(/webOS/i)
                 || navigator.userAgent.match(/iPhone/i)
                 || navigator.userAgent.match(/iPad/i)
                 || navigator.userAgent.match(/iPod/i)
                 || navigator.userAgent.match(/BlackBerry/i)
                 || navigator.userAgent.match(/Windows Phone/i)
                 ){
                return true;
            }else {
                return false;
            }
        }
    };

    return AjaxLayeredNavigation;
});
